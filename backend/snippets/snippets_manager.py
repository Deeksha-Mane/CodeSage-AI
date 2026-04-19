"""Snippets management for code snippets library"""
from datetime import datetime
from pymongo import MongoClient
import config
from bson import ObjectId


class SnippetsManager:
    """Manages code snippets"""
    
    def __init__(self):
        self.client = MongoClient(
            config.MONGODB_URL,
            tls=True,
            tlsAllowInvalidCertificates=True,
            serverSelectionTimeoutMS=5000
        )
        self.db = self.client[config.DATABASE_NAME]
        self.collection = self.db.code_snippets
    
    def save_snippet(self, user_email: str, title: str, code: str, 
                    language: str, description: str = "", tags: list = None) -> str:
        """Save a code snippet"""
        snippet = {
            "user_email": user_email,
            "title": title,
            "code": code,
            "language": language,
            "description": description,
            "tags": tags or [],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = self.collection.insert_one(snippet)
        return str(result.inserted_id)
    
    def get_user_snippets(self, user_email: str, language: str = None, 
                         search: str = None, limit: int = 50, skip: int = 0) -> list:
        """Get all snippets for a user with optional filters"""
        query = {"user_email": user_email}
        
        if language:
            query["language"] = language
        
        if search:
            query["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}},
                {"tags": {"$regex": search, "$options": "i"}}
            ]
        
        snippets = self.collection.find(query).sort("created_at", -1).skip(skip).limit(limit)
        
        result = []
        for snippet in snippets:
            result.append({
                "id": str(snippet["_id"]),
                "title": snippet.get("title", ""),
                "code": snippet.get("code", ""),
                "language": snippet.get("language", "python"),
                "description": snippet.get("description", ""),
                "tags": snippet.get("tags", []),
                "created_at": snippet["created_at"].isoformat(),
                "updated_at": snippet.get("updated_at", snippet["created_at"]).isoformat()
            })
        
        return result
    
    def get_snippet_by_id(self, snippet_id: str, user_email: str) -> dict:
        """Get a specific snippet by ID"""
        try:
            snippet = self.collection.find_one({
                "_id": ObjectId(snippet_id),
                "user_email": user_email
            })
            
            if not snippet:
                return None
            
            return {
                "id": str(snippet["_id"]),
                "title": snippet.get("title", ""),
                "code": snippet.get("code", ""),
                "language": snippet.get("language", "python"),
                "description": snippet.get("description", ""),
                "tags": snippet.get("tags", []),
                "created_at": snippet["created_at"].isoformat(),
                "updated_at": snippet.get("updated_at", snippet["created_at"]).isoformat()
            }
        except:
            return None
    
    def update_snippet(self, snippet_id: str, user_email: str, 
                      title: str = None, code: str = None, 
                      description: str = None, tags: list = None) -> bool:
        """Update a snippet"""
        try:
            update_data = {"updated_at": datetime.utcnow()}
            
            if title is not None:
                update_data["title"] = title
            if code is not None:
                update_data["code"] = code
            if description is not None:
                update_data["description"] = description
            if tags is not None:
                update_data["tags"] = tags
            
            result = self.collection.update_one(
                {"_id": ObjectId(snippet_id), "user_email": user_email},
                {"$set": update_data}
            )
            
            return result.modified_count > 0
        except:
            return False
    
    def delete_snippet(self, snippet_id: str, user_email: str) -> bool:
        """Delete a snippet"""
        try:
            result = self.collection.delete_one({
                "_id": ObjectId(snippet_id),
                "user_email": user_email
            })
            return result.deleted_count > 0
        except:
            return False
    
    def get_user_tags(self, user_email: str) -> list:
        """Get all unique tags for a user"""
        pipeline = [
            {"$match": {"user_email": user_email}},
            {"$unwind": "$tags"},
            {"$group": {"_id": "$tags"}},
            {"$sort": {"_id": 1}}
        ]
        
        result = list(self.collection.aggregate(pipeline))
        return [item["_id"] for item in result if item["_id"]]
    
    def get_snippet_count(self, user_email: str) -> dict:
        """Get snippet count by language"""
        pipeline = [
            {"$match": {"user_email": user_email}},
            {"$group": {
                "_id": "$language",
                "count": {"$sum": 1}
            }}
        ]
        
        result = list(self.collection.aggregate(pipeline))
        return {item["_id"]: item["count"] for item in result}
