"""Pydantic models for API requests and responses"""
from pydantic import BaseModel
from typing import Optional


class CodeAnalysisRequest(BaseModel):
    code: str


class IssueResponse(BaseModel):
    issue_id: str
    line: int
    column: int
    type: str
    message: str
    symbol: str
    explanation: str
    suggested_fix: str


class AnalysisResponse(BaseModel):
    issues: list[IssueResponse]
    total_issues: int


class FeedbackRequest(BaseModel):
    issue_id: str
    is_helpful: bool
    issue_data: dict
    explanation: str
    user_comment: Optional[str] = None


class FeedbackResponse(BaseModel):
    feedback_id: str
    message: str



class UserSignup(BaseModel):
    name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict


class UpdateProfileRequest(BaseModel):
    name: str


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class DeleteAccountRequest(BaseModel):
    password: str
