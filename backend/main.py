"""FastAPI main application"""
from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
import hashlib
from analyzer import AnalyzerFactory
from llm import get_llm_provider
from feedback import FeedbackManager
from history import HistoryManager
from auth import AuthHandler
from snippets import SnippetsManager
from models import (
    CodeAnalysisRequest, AnalysisResponse, IssueResponse,
    FeedbackRequest, FeedbackResponse, UserSignup, UserLogin, TokenResponse,
    UpdateProfileRequest, ChangePasswordRequest, DeleteAccountRequest
)

app = FastAPI(title="CodeSage AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm_provider = get_llm_provider("dummy")
feedback_manager = FeedbackManager()
history_manager = HistoryManager()
auth_handler = AuthHandler()
snippets_manager = SnippetsManager()


@app.get("/")
def read_root():
    return {
        "message": "CodeSage AI API", 
        "status": "running",
        "supported_languages": AnalyzerFactory.get_supported_languages()
    }


@app.get("/languages")
def get_supported_languages():
    """Get list of supported programming languages"""
    return {"languages": AnalyzerFactory.get_supported_languages()}


@app.post("/analyze", response_model=AnalysisResponse)
def analyze_code(request: CodeAnalysisRequest, authorization: str = Header(None)):
    """Analyze code and return issues with explanations"""
    try:
        # Get user email from token
        user_email = None
        if authorization and authorization.startswith("Bearer "):
            user_email = get_current_user(authorization)
        
        # Detect or use provided language
        language = request.language
        if not language:
            language = AnalyzerFactory.detect_language(request.code)
        
        # Get appropriate analyzer
        try:
            analyzer = AnalyzerFactory.get_analyzer(language)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        
        # Analyze code
        if language in ['javascript', 'typescript']:
            issues = analyzer.analyze(request.code, language)
        elif language in ['c', 'cpp']:
            issues = analyzer.analyze(request.code, language)
        else:
            issues = analyzer.analyze(request.code)
        
        enriched_issues = []
        for issue in issues:
            issue_id = hashlib.md5(
                f"{issue['line']}{issue['message']}{issue['symbol']}".encode()
            ).hexdigest()
            
            llm_response = llm_provider.generate_explanation(issue, request.code)
            
            enriched_issue = IssueResponse(
                issue_id=issue_id,
                line=issue['line'],
                column=issue['column'],
                type=issue['type'],
                message=issue['message'],
                symbol=issue['symbol'],
                explanation=llm_response['explanation'],
                suggested_fix=llm_response['suggested_fix']
            )
            enriched_issues.append(enriched_issue)
        
        # Save to history if user is authenticated
        if user_email:
            issues_dict = [issue.dict() for issue in enriched_issues]
            history_manager.save_review(user_email, request.code, issues_dict, language)
        
        return AnalysisResponse(
            issues=enriched_issues,
            total_issues=len(enriched_issues),
            language=language
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/feedback", response_model=FeedbackResponse)
def submit_feedback(request: FeedbackRequest):
    """Store user feedback"""
    try:
        feedback_id = feedback_manager.store_feedback(
            issue_id=request.issue_id,
            is_helpful=request.is_helpful,
            issue_data=request.issue_data,
            explanation=request.explanation,
            user_comment=request.user_comment
        )
        
        return FeedbackResponse(
            feedback_id=feedback_id,
            message="Feedback stored successfully"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/feedback/stats")
def get_feedback_stats():
    """Get feedback statistics"""
    try:
        return feedback_manager.get_feedback_stats()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def get_current_user(authorization: str = Header(None)):
    """Get current user from JWT token"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.split(" ")[1]
    payload = auth_handler.decode_token(token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return payload.get("sub")


@app.post("/auth/signup", response_model=TokenResponse)
def signup(user: UserSignup):
    """Register a new user"""
    try:
        created_user = auth_handler.create_user(user.name, user.email, user.password)
        
        if not created_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        access_token = auth_handler.create_access_token(
            data={"sub": created_user['email']}
        )
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user={
                "id": created_user['_id'],
                "name": created_user['name'],
                "email": created_user['email']
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/auth/login", response_model=TokenResponse)
def login(user: UserLogin):
    """Login user"""
    try:
        authenticated_user = auth_handler.authenticate_user(user.email, user.password)
        
        if not authenticated_user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        access_token = auth_handler.create_access_token(
            data={"sub": authenticated_user['email']}
        )
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user={
                "id": authenticated_user['_id'],
                "name": authenticated_user['name'],
                "email": authenticated_user['email']
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.put("/auth/profile")
def update_profile(request: UpdateProfileRequest, authorization: str = Header(None)):
    """Update user profile"""
    try:
        email = get_current_user(authorization)
        updated_user = auth_handler.update_user_profile(email, request.name)
        
        if not updated_user:
            raise HTTPException(status_code=400, detail="Failed to update profile")
        
        return {
            "message": "Profile updated successfully",
            "user": {
                "id": updated_user['_id'],
                "name": updated_user['name'],
                "email": updated_user['email']
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.put("/auth/change-password")
def change_password(request: ChangePasswordRequest, authorization: str = Header(None)):
    """Change user password"""
    try:
        email = get_current_user(authorization)
        
        if len(request.new_password) < 6:
            raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
        
        success = auth_handler.change_password(
            email, 
            request.current_password, 
            request.new_password
        )
        
        if not success:
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        
        return {"message": "Password changed successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/auth/account")
def delete_account(request: DeleteAccountRequest, authorization: str = Header(None)):
    """Delete user account"""
    try:
        email = get_current_user(authorization)
        
        success = auth_handler.delete_user(email, request.password)
        
        if not success:
            raise HTTPException(status_code=400, detail="Password is incorrect")
        
        return {"message": "Account deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# History endpoints
@app.get("/history")
def get_history(authorization: str = Header(None), limit: int = 50, skip: int = 0):
    """Get user's code review history"""
    try:
        email = get_current_user(authorization)
        reviews = history_manager.get_user_reviews(email, limit, skip)
        return {"reviews": reviews, "total": len(reviews)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/history/{review_id}")
def get_review_detail(review_id: str, authorization: str = Header(None)):
    """Get detailed review by ID"""
    try:
        email = get_current_user(authorization)
        review = history_manager.get_review_by_id(review_id, email)
        
        if not review:
            raise HTTPException(status_code=404, detail="Review not found")
        
        return review
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/history/{review_id}")
def delete_review(review_id: str, authorization: str = Header(None)):
    """Delete a review"""
    try:
        email = get_current_user(authorization)
        success = history_manager.delete_review(review_id, email)
        
        if not success:
            raise HTTPException(status_code=404, detail="Review not found")
        
        return {"message": "Review deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Analytics endpoints
@app.get("/analytics/stats")
def get_analytics_stats(authorization: str = Header(None)):
    """Get user analytics statistics"""
    try:
        email = get_current_user(authorization)
        stats = history_manager.get_user_stats(email)
        issues_by_type = history_manager.get_issues_by_type(email)
        
        return {
            "stats": stats,
            "issues_by_type": issues_by_type
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Snippets endpoints
@app.post("/snippets")
def create_snippet(
    title: str,
    code: str,
    language: str,
    description: str = "",
    tags: list = None,
    authorization: str = Header(None)
):
    """Create a new code snippet"""
    try:
        email = get_current_user(authorization)
        snippet_id = snippets_manager.save_snippet(
            email, title, code, language, description, tags or []
        )
        return {"snippet_id": snippet_id, "message": "Snippet saved successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/snippets")
def get_snippets(
    authorization: str = Header(None),
    language: str = None,
    search: str = None,
    limit: int = 50,
    skip: int = 0
):
    """Get user's code snippets"""
    try:
        email = get_current_user(authorization)
        snippets = snippets_manager.get_user_snippets(email, language, search, limit, skip)
        tags = snippets_manager.get_user_tags(email)
        counts = snippets_manager.get_snippet_count(email)
        
        return {
            "snippets": snippets,
            "total": len(snippets),
            "tags": tags,
            "counts": counts
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/snippets/{snippet_id}")
def get_snippet(snippet_id: str, authorization: str = Header(None)):
    """Get a specific snippet"""
    try:
        email = get_current_user(authorization)
        snippet = snippets_manager.get_snippet_by_id(snippet_id, email)
        
        if not snippet:
            raise HTTPException(status_code=404, detail="Snippet not found")
        
        return snippet
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.put("/snippets/{snippet_id}")
def update_snippet(
    snippet_id: str,
    title: str = None,
    code: str = None,
    description: str = None,
    tags: list = None,
    authorization: str = Header(None)
):
    """Update a snippet"""
    try:
        email = get_current_user(authorization)
        success = snippets_manager.update_snippet(
            snippet_id, email, title, code, description, tags
        )
        
        if not success:
            raise HTTPException(status_code=404, detail="Snippet not found")
        
        return {"message": "Snippet updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/snippets/{snippet_id}")
def delete_snippet(snippet_id: str, authorization: str = Header(None)):
    """Delete a snippet"""
    try:
        email = get_current_user(authorization)
        success = snippets_manager.delete_snippet(snippet_id, email)
        
        if not success:
            raise HTTPException(status_code=404, detail="Snippet not found")
        
        return {"message": "Snippet deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
