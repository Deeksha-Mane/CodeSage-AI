"""Base LLM provider interface"""
from abc import ABC, abstractmethod


class LLMProvider(ABC):
    """Abstract base class for LLM providers"""
    
    @abstractmethod
    def generate_explanation(self, issue: dict, code: str) -> dict:
        """
        Generate explanation for a code issue
        
        Args:
            issue: Issue dict from static analysis
            code: Original code string
            
        Returns:
            Dict with 'explanation' and 'suggested_fix'
        """
        pass
    
    @abstractmethod
    def chat(self, message: str, context: str = "") -> str:
        """
        Chat with AI about coding questions
        
        Args:
            message: User's question
            context: Optional code context
            
        Returns:
            AI response as string
        """
        pass
    
    @abstractmethod
    def convert_code(self, code: str, from_language: str, to_language: str) -> dict:
        """
        Convert code from one language to another
        
        Args:
            code: Source code to convert
            from_language: Source language
            to_language: Target language
            
        Returns:
            Dict with 'success', 'converted_code', 'error', 'from_language', 'to_language'
        """
        pass
