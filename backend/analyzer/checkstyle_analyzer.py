"""Checkstyle integration for Java analysis"""
import tempfile
import os
import re


class CheckstyleAnalyzer:
    """Analyzes Java code using basic pattern matching"""
    
    def analyze(self, code: str) -> list[dict]:
        """
        Analyze Java code and return structured issues
        
        Args:
            code: Java code string to analyze
            
        Returns:
            List of issues with line, column, type, message, symbol
        """
        issues = []
        lines = code.split('\n')
        
        for i, line in enumerate(lines, 1):
            # Check for missing semicolon
            stripped = line.strip()
            if stripped and not stripped.endswith((';', '{', '}', '//', '/*', '*/', '*')):
                if any(keyword in stripped for keyword in ['int ', 'String ', 'return ', 'System.out']):
                    if not stripped.startswith('//') and not stripped.startswith('*'):
                        issues.append({
                            'line': i,
                            'column': len(line),
                            'type': 'error',
                            'message': 'Missing semicolon',
                            'symbol': 'missing-semicolon',
                            'message_id': 'missing-semicolon'
                        })
            
            # Check for System.out.println (should use logger)
            if 'System.out.println' in line or 'System.out.print' in line:
                issues.append({
                    'line': i,
                    'column': line.index('System.out'),
                    'type': 'warning',
                    'message': 'Avoid using System.out, use a logger instead',
                    'symbol': 'avoid-system-out',
                    'message_id': 'avoid-system-out'
                })
            
            # Check for class naming convention
            class_match = re.search(r'class\s+([a-z][a-zA-Z0-9]*)', line)
            if class_match:
                issues.append({
                    'line': i,
                    'column': line.index(class_match.group(1)),
                    'type': 'convention',
                    'message': f'Class name "{class_match.group(1)}" should start with uppercase',
                    'symbol': 'class-naming',
                    'message_id': 'class-naming'
                })
            
            # Check for variable naming (should be camelCase)
            var_match = re.search(r'(int|String|double|float|boolean)\s+([A-Z][a-zA-Z0-9]*)', line)
            if var_match:
                issues.append({
                    'line': i,
                    'column': line.index(var_match.group(2)),
                    'type': 'convention',
                    'message': f'Variable "{var_match.group(2)}" should use camelCase',
                    'symbol': 'variable-naming',
                    'message_id': 'variable-naming'
                })
            
            # Check for magic numbers
            number_match = re.search(r'[^a-zA-Z0-9_](\d{2,})[^a-zA-Z0-9_]', line)
            if number_match and 'final' not in line:
                issues.append({
                    'line': i,
                    'column': line.index(number_match.group(1)),
                    'type': 'refactor',
                    'message': f'Magic number {number_match.group(1)} should be a named constant',
                    'symbol': 'magic-number',
                    'message_id': 'magic-number'
                })
            
            # Check for empty catch blocks
            if 'catch' in line and '{' in line and '}' in line:
                issues.append({
                    'line': i,
                    'column': line.index('catch'),
                    'type': 'error',
                    'message': 'Empty catch block',
                    'symbol': 'empty-catch',
                    'message_id': 'empty-catch'
                })
        
        return issues
