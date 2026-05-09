"""Dummy LLM provider for testing"""
from .base import LLMProvider


class DummyLLMProvider(LLMProvider):
    """Dummy LLM that returns template responses"""
    
    def generate_explanation(self, issue: dict, code: str) -> dict:
        """Generate dummy explanation"""
        issue_type = issue.get('type', 'unknown')
        message = issue.get('message', 'No message')
        symbol = issue.get('symbol', '')
        
        explanations = {
            'convention': f"Code style issue: {message}. Consider following PEP 8 guidelines.",
            'refactor': f"Code can be improved: {message}. Refactoring will make it cleaner.",
            'warning': f"Potential problem: {message}. This might cause issues at runtime.",
            'error': f"Code error: {message}. This will prevent your code from running.",
        }
        
        explanation = explanations.get(issue_type, f"Issue detected: {message}")
        
        suggested_fix = f"Review line {issue.get('line', 0)} and address: {symbol or message}"
        
        return {
            'explanation': explanation,
            'suggested_fix': suggested_fix
        }
    
    def chat(self, message: str, context: str = "") -> str:
        """Generate dummy chat response"""
        return f"This is a dummy response. To get real AI responses, configure a Gemini API key in your .env file (LLM_PROVIDER=gemini, GEMINI_API_KEY=your_key). Your question was: {message}"
    
    def convert_code(self, code: str, from_language: str, to_language: str) -> dict:
        """Generate dummy conversion response"""
        return {
            "success": False,
            "error": "Dummy provider - Configure Gemini API key for real code conversion",
            "from_language": from_language,
            "to_language": to_language
        }
