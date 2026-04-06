"""Feedback with SQLite"""
import sqlite3
from datetime import datetime
from typing import Optional


class FeedbackManager:
    def __init__(self):
        self.conn = sqlite3.connect('code_review.db', check_same_thread=False)
        self.create_tables()
    
    def create_tables(self):
        cursor = self.conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS feedback (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                issue_id TEXT NOT NULL,
                is_helpful BOOLEAN NOT NULL,
                issue_data TEXT,
                explanation TEXT,
                user_comment TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        self.conn.commit()
    
    def store_feedback(self, issue_id: str, is_helpful: bool, 
                      issue_data: dict, explanation: str, 
                      user_comment: Optional[str] = None) -> str:
        cursor = self.conn.cursor()
        cursor.execute(
            "INSERT INTO feedback (issue_id, is_helpful, issue_data, explanation, user_comment) VALUES (?, ?, ?, ?, ?)",
            (issue_id, is_helpful, str(issue_data), explanation, user_comment)
        )
        self.conn.commit()
        return str(cursor.lastrowid)
    
    def get_feedback_stats(self) -> dict:
        cursor = self.conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM feedback")
        total = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM feedback WHERE is_helpful = 1")
        helpful = cursor.fetchone()[0]
        
        return {
            'total_feedback': total,
            'helpful_count': helpful,
            'not_helpful_count': total - helpful,
            'helpful_percentage': (helpful / total * 100) if total > 0 else 0
        }
