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
