"""Factory for creating LLM providers"""
from .base import LLMProvider
from .dummy_provider import DummyLLMProvider


def get_llm_provider(provider_name: str = "dummy") -> LLMProvider:
    """
    Factory function to get LLM provider
    
    Args:
        provider_name: Name of the provider (dummy, openai, etc.)
        
    Returns:
        LLMProvider instance
    """
    providers = {
        'dummy': DummyLLMProvider,
    }
    
    provider_class = providers.get(provider_name.lower(), DummyLLMProvider)
    return provider_class()
