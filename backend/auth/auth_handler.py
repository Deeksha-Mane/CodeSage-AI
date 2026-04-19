"""Authentication and JWT handling"""
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from pymongo import MongoClient
import config
import os

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


class AuthHandler:
    def __init__(self):
        # MongoDB Atlas connection with proper SSL handling for Windows
        self.client = MongoClient(
            config.MONGODB_URL,
            tls=True,
            tlsAllowInvalidCertificates=True,
            serverSelectionTimeoutMS=5000
        )
        self.db = self.client[config.DATABASE_NAME]
        self.users_collection = self.db['users']
    
    def hash_password(self, password: str) -> str:
        # Truncate password to 72 bytes for bcrypt (encode to bytes first to handle multi-byte chars)
        password_bytes = password.encode('utf-8')[:72]
        truncated_password = password_bytes.decode('utf-8', errors='ignore')
        return pwd_context.hash(truncated_password)
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        # Truncate password to 72 bytes for bcrypt (encode to bytes first to handle multi-byte chars)
        password_bytes = plain_password.encode('utf-8')[:72]
        truncated_password = password_bytes.decode('utf-8', errors='ignore')
        return pwd_context.verify(truncated_password, hashed_password)
    
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
        if self.users_collection.find_one({"email": email}):
            return None
        
        user_doc = {
            "name": name,
            "email": email,
            "password": self.hash_password(password),
            "created_at": datetime.utcnow()
        }
        
        result = self.users_collection.insert_one(user_doc)
        user_doc['_id'] = str(result.inserted_id)
        return user_doc
    
    def authenticate_user(self, email: str, password: str):
        user = self.users_collection.find_one({"email": email})
        if not user:
            return None
        if not self.verify_password(password, user['password']):
            return None
        user['_id'] = str(user['_id'])
        return user
    
    def update_user_profile(self, email: str, name: str):
        """Update user profile information"""
        result = self.users_collection.update_one(
            {"email": email},
            {"$set": {"name": name}}
        )
        if result.modified_count > 0:
            user = self.users_collection.find_one({"email": email})
            user['_id'] = str(user['_id'])
            return user
        return None
    
    def change_password(self, email: str, current_password: str, new_password: str):
        """Change user password"""
        user = self.users_collection.find_one({"email": email})
        if not user:
            return False
        
        if not self.verify_password(current_password, user['password']):
            return False
        
        result = self.users_collection.update_one(
            {"email": email},
            {"$set": {"password": self.hash_password(new_password)}}
        )
        return result.modified_count > 0
    
    def delete_user(self, email: str, password: str):
        """Delete user account"""
        user = self.users_collection.find_one({"email": email})
        if not user:
            return False
        
        if not self.verify_password(password, user['password']):
            return False
        
        result = self.users_collection.delete_one({"email": email})
        return result.deleted_count > 0
