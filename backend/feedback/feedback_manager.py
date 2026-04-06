"""Feedback storage and retrieval module"""
from pymongo import MongoClient
from datetime import datetime
from typing import Optional
import config


class FeedbackManager:
    """Manages feedback storage in MongoDB"""
    
    def __init__(self):
        # MongoDB Atlas connection with proper SSL handling for Windows
        self.client = MongoClient(
            config.MONGODB_URL,
            tls=True,
            tlsAllowInvalidCertificates=True,
            serverSelectionTimeoutMS=5000
        )
        self.db = self.client[config.DATABASE_NAME]
        self.feedback_collection = self.db['feedback']
    
    def store_feedback(self, issue_id: str, is_helpful: bool, 
                      issue_data: dict, explanation: str, 
                      user_comment: Optional[str] = None) -> str:
        """
        Store user feedback
        
        Args:
            issue_id: Unique identifier for the issue
            is_helpful: Whether user found it helpful
            issue_data: Original issue from analyzer
            explanation: Generated explanation
            user_comment: Optional user comment
            
        Returns:
            Inserted document ID
        """
        feedback_doc = {
            'issue_id': issue_id,
            'is_helpful': is_helpful,
            'issue_data': issue_data,
            'explanation': explanation,
            'user_comment': user_comment,
            'timestamp': datetime.utcnow()
        }
        
        result = self.feedback_collection.insert_one(feedback_doc)
        return str(result.inserted_id)
    
    def get_feedback_stats(self) -> dict:
        """Get overall feedback statistics"""
        total = self.feedback_collection.count_documents({})
        helpful = self.feedback_collection.count_documents({'is_helpful': True})
        
        return {
            'total_feedback': total,
            'helpful_count': helpful,
            'not_helpful_count': total - helpful,
            'helpful_percentage': (helpful / total * 100) if total > 0 else 0
        }
