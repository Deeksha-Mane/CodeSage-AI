"""ESLint integration for JavaScript/TypeScript analysis"""
import tempfile
import os
import subprocess
import json


class ESLintAnalyzer:
    """Analyzes JavaScript/TypeScript code using ESLint"""
    
    def analyze(self, code: str, language: str = "javascript") -> list[dict]:
        """
        Analyze JavaScript/TypeScript code and return structured issues
        
        Args:
            code: JavaScript/TypeScript code string to analyze
            language: "javascript" or "typescript"
            
        Returns:
            List of issues with line, column, type, message, rule
        """
        extension = '.ts' if language == 'typescript' else '.js'
        
        with tempfile.NamedTemporaryFile(mode='w', suffix=extension, delete=False) as f:
            f.write(code)
            temp_file = f.name
        
        try:
            # Check if eslint is installed
            try:
                subprocess.run(['npx', 'eslint', '--version'], 
                             capture_output=True, check=True)
            except (subprocess.CalledProcessError, FileNotFoundError):
                # ESLint not available, return basic syntax check
                return self._basic_syntax_check(code, language)
            
            # Run ESLint
            result = subprocess.run(
                ['npx', 'eslint', '--format', 'json', temp_file],
                capture_output=True,
                text=True
            )
            
            if result.stdout:
                eslint_output = json.loads(result.stdout)
                
                issues = []
                for file_result in eslint_output:
                    for message in file_result.get('messages', []):
                        issues.append({
                            'line': message.get('line', 0),
                            'column': message.get('column', 0),
                            'type': self._map_severity(message.get('severity', 1)),
                            'message': message.get('message', ''),
                            'symbol': message.get('ruleId', ''),
                            'message_id': message.get('ruleId', '')
                        })
                
                return issues
            
            return []
        except Exception as e:
            print(f"ESLint error: {e}")
            return self._basic_syntax_check(code, language)
        finally:
            if os.path.exists(temp_file):
                os.unlink(temp_file)
    
    def _map_severity(self, severity: int) -> str:
        """Map ESLint severity to our type system"""
        if severity == 2:
            return 'error'
        elif severity == 1:
            return 'warning'
        return 'convention'
    
    def _basic_syntax_check(self, code: str, language: str) -> list[dict]:
        """Basic syntax checking when ESLint is not available"""
        issues = []
        
        # Check for common issues
        lines = code.split('\n')
        for i, line in enumerate(lines, 1):
            # Check for console.log (common issue)
            if 'console.log' in line:
                issues.append({
                    'line': i,
                    'column': line.index('console.log'),
                    'type': 'warning',
                    'message': 'Unexpected console statement',
                    'symbol': 'no-console',
                    'message_id': 'no-console'
                })
            
            # Check for var usage
            if ' var ' in line:
                issues.append({
                    'line': i,
                    'column': line.index(' var '),
                    'type': 'warning',
                    'message': 'Unexpected var, use let or const instead',
                    'symbol': 'no-var',
                    'message_id': 'no-var'
                })
            
            # Check for == instead of ===
            if '==' in line and '===' not in line and '!=' in line:
                issues.append({
                    'line': i,
                    'column': line.index('=='),
                    'type': 'warning',
                    'message': 'Use === instead of ==',
                    'symbol': 'eqeqeq',
                    'message_id': 'eqeqeq'
                })
        
        return issues
