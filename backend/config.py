"""Configuration settings for the application"""
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# MongoDB Configuration
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017/")
DATABASE_NAME = os.getenv("DATABASE_NAME", "code_review_ai")

# LLM Configuration (for future use)
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "dummy")
LLM_API_KEY = os.getenv("LLM_API_KEY", "")
