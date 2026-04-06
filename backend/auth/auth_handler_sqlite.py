"""Authentication with SQLite (no MongoDB needed)"""
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import sqlite3
import json

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "your-secret-key-change-this-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


class AuthHandler:
    def __init__(self):
        self.conn = sqlite3.connect('code_review.db', check_same_thread=False)
        self.create_tables()
    
    def create_tables(self):
        cursor = self.conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        self.conn.commit()
    
    def hash_password(self, password: str) -> str:
        return pwd_context.hash(password)
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)
    
    def create_access_token(self, data: dict):
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    def decode_token(self, token: str):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except JWTError:
            return None
    
    def create_user(self, name: str, email: str, password: str):
        cursor = self.conn.cursor()
        try:
            cursor.execute(
                "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
                (name, email, self.hash_password(password))
            )
            self.conn.commit()
            user_id = cursor.lastrowid
            return {
                '_id': str(user_id),
                'name': name,
                'email': email
            }
        except sqlite3.IntegrityError:
            return None
    
    def authenticate_user(self, email: str, password: str):
        cursor = self.conn.cursor()
        cursor.execute("SELECT id, name, email, password FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()
        if not user:
            return None
        if not self.verify_password(password, user[3]):
            return None
        return {
            '_id': str(user[0]),
            'name': user[1],
            'email': user[2]
        }
