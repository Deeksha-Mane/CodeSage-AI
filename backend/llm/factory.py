"""Factory for creating LLM providers"""
from .base import LLMProvider
from .dummy_provider import DummyLLMProvider
from .gemini_provider import GeminiProvider
import os


def get_llm_provider(provider_name: str = "dummy") -> LLMProvider:
    """
    Factory function to get LLM provider
    
    Args:
        provider_name: Name of the provider (dummy, gemini, etc.)
        
    Returns:
        LLMProvider instance
    """
    if provider_name.lower() == "gemini":
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        return GeminiProvider(api_key)
    
    return DummyLLMProvider()

