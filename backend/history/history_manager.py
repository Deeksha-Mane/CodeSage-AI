"""History management for code reviews"""
from datetime import datetime
from pymongo import MongoClient
import config
from bson import ObjectId


class HistoryManager:
    """Manages code review history"""
    
    def __init__(self):
        self.client = MongoClient(
            config.MONGODB_URL,
            tls=True,
            tlsAllowInvalidCertificates=True,
            serverSelectionTimeoutMS=5000
        )
        self.db = self.client[config.DATABASE_NAME]
        self.collection = self.db.code_reviews
    
    def save_review(self, user_email: str, code: str, issues: list, language: str = "python") -> str:
        """Save a code review to history"""
        review = {
            "user_email": user_email,
            "code": code,
            "language": language,
            "issues": issues,
            "total_issues": len(issues),
            "created_at": datetime.utcnow(),
            "status": "completed"
        }
        
        result = self.collection.insert_one(review)
        return str(result.inserted_id)
    
    def get_user_reviews(self, user_email: str, limit: int = 50, skip: int = 0) -> list:
        """Get all reviews for a user"""
        reviews = self.collection.find(
            {"user_email": user_email}
        ).sort("created_at", -1).skip(skip).limit(limit)
        
        result = []
        for review in reviews:
            result.append({
                "id": str(review["_id"]),
                "code": review.get("code", ""),
                "language": review.get("language", "python"),
                "total_issues": review.get("total_issues", 0),
                "created_at": review["created_at"].isoformat(),
                "status": review.get("status", "completed")
            })
        
        return result
    
    def get_review_by_id(self, review_id: str, user_email: str) -> dict:
        """Get a specific review by ID"""
        try:
            review = self.collection.find_one({
                "_id": ObjectId(review_id),
                "user_email": user_email
            })
            
            if not review:
                return None
            
            return {
                "id": str(review["_id"]),
                "code": review.get("code", ""),
                "language": review.get("language", "python"),
                "issues": review.get("issues", []),
                "total_issues": review.get("total_issues", 0),
                "created_at": review["created_at"].isoformat(),
                "status": review.get("status", "completed")
            }
        except:
            return None
    
    def get_user_stats(self, user_email: str) -> dict:
        """Get analytics stats for a user"""
        pipeline = [
            {"$match": {"user_email": user_email}},
            {"$group": {
                "_id": None,
                "total_reviews": {"$sum": 1},
                "total_issues": {"$sum": "$total_issues"},
                "avg_issues": {"$avg": "$total_issues"}
            }}
        ]
        
        result = list(self.collection.aggregate(pipeline))
        
        if not result:
            return {
                "total_reviews": 0,
                "total_issues": 0,
                "avg_issues_per_review": 0
            }
        
        stats = result[0]
        return {
            "total_reviews": stats.get("total_reviews", 0),
            "total_issues": stats.get("total_issues", 0),
            "avg_issues_per_review": round(stats.get("avg_issues", 0), 2)
        }
    
    def get_issues_by_type(self, user_email: str) -> dict:
        """Get issue breakdown by type"""
        reviews = self.collection.find({"user_email": user_email})
        
        type_counts = {}
        for review in reviews:
            for issue in review.get("issues", []):
                issue_type = issue.get("type", "unknown")
                type_counts[issue_type] = type_counts.get(issue_type, 0) + 1
        
        return type_counts
    
    def delete_review(self, review_id: str, user_email: str) -> bool:
        """Delete a review"""
        try:
            result = self.collection.delete_one({
                "_id": ObjectId(review_id),
                "user_email": user_email
            })
            return result.deleted_count > 0
        except:
            return False
