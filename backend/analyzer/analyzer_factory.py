"""Factory for creating language-specific analyzers"""
from .pylint_analyzer import PylintAnalyzer
from .eslint_analyzer import ESLintAnalyzer
from .checkstyle_analyzer import CheckstyleAnalyzer
from .cppcheck_analyzer import CppcheckAnalyzer


class AnalyzerFactory:
    """Factory to get the appropriate analyzer for a language"""
    
    SUPPORTED_LANGUAGES = {
        'python': {'name': 'Python', 'extensions': ['.py']},
        'javascript': {'name': 'JavaScript', 'extensions': ['.js', '.jsx']},
        'typescript': {'name': 'TypeScript', 'extensions': ['.ts', '.tsx']},
        'java': {'name': 'Java', 'extensions': ['.java']},
        'c': {'name': 'C', 'extensions': ['.c', '.h']},
        'cpp': {'name': 'C++', 'extensions': ['.cpp', '.hpp', '.cc', '.cxx']},
    }
    
    @staticmethod
    def get_analyzer(language: str):
        """
        Get the appropriate analyzer for the given language
        
        Args:
            language: Language identifier (python, javascript, typescript, java, c, cpp)
            
        Returns:
            Analyzer instance
            
        Raises:
            ValueError: If language is not supported
        """
        language = language.lower()
        
        if language == 'python':
            return PylintAnalyzer()
        elif language in ['javascript', 'typescript']:
            return ESLintAnalyzer()
        elif language == 'java':
            return CheckstyleAnalyzer()
        elif language in ['c', 'cpp']:
            return CppcheckAnalyzer()
        else:
            raise ValueError(f"Unsupported language: {language}")
    
    @staticmethod
    def detect_language(code: str) -> str:
        """
        Attempt to detect the programming language from code content
        
        Args:
            code: Source code string
            
        Returns:
            Detected language identifier
        """
        # C/C++ indicators (check first because of #include)
        if '#include' in code:
            if any(indicator in code for indicator in ['iostream', 'std::', 'cout', 'cin', 'vector<', 'string']):
                return 'cpp'
            if any(indicator in code for indicator in ['stdio.h', 'stdlib.h', 'printf', 'scanf', 'malloc']):
                return 'c'
            return 'c'  # Default to C if #include present
        
        # Java indicators (check before JavaScript due to similar keywords)
        if any(indicator in code for indicator in ['public class', 'public static void main', 'System.out', 'private class', 'protected class']):
            return 'java'
        if 'class ' in code and any(indicator in code for indicator in ['extends', 'implements', 'public ', 'private ']):
            return 'java'
        
        # TypeScript indicators (check before JavaScript)
        if any(indicator in code for indicator in ['interface ', ': string', ': number', ': boolean', ': void', 'type ', '<T>']):
            return 'typescript'
        
        # JavaScript indicators
        if any(keyword in code for keyword in ['const ', 'let ', 'var ', 'function ', '=>', 'console.log']):
            return 'javascript'
        
        # Python indicators
        if any(keyword in code for keyword in ['def ', 'import ', 'from ', 'class ', '__init__', 'elif ', 'print(']):
            return 'python'
        if 'self' in code or '"""' in code or "'''" in code:
            return 'python'
        
        # Default to Python if can't detect
        return 'python'
    
    @staticmethod
    def get_supported_languages() -> dict:
        """Get list of supported languages"""
        return AnalyzerFactory.SUPPORTED_LANGUAGES
