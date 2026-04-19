"""Cppcheck integration for C/C++ analysis"""
import tempfile
import os
import subprocess
import xml.etree.ElementTree as ET


class CppcheckAnalyzer:
    """Analyzes C/C++ code using Cppcheck or basic pattern matching"""
    
    def analyze(self, code: str, language: str = "cpp") -> list[dict]:
        """
        Analyze C/C++ code and return structured issues
        
        Args:
            code: C/C++ code string to analyze
            language: "c" or "cpp"
            
        Returns:
            List of issues with line, column, type, message, symbol
        """
        extension = '.c' if language == 'c' else '.cpp'
        
        with tempfile.NamedTemporaryFile(mode='w', suffix=extension, delete=False) as f:
            f.write(code)
            temp_file = f.name
        
        try:
            # Check if cppcheck is installed
            try:
                subprocess.run(['cppcheck', '--version'], 
                             capture_output=True, check=True)
                return self._run_cppcheck(temp_file)
            except (subprocess.CalledProcessError, FileNotFoundError):
                # Cppcheck not available, use basic checks
                return self._basic_syntax_check(code)
        finally:
            if os.path.exists(temp_file):
                os.unlink(temp_file)
    
    def _run_cppcheck(self, temp_file: str) -> list[dict]:
        """Run cppcheck on the file"""
        try:
            result = subprocess.run(
                ['cppcheck', '--xml', '--enable=all', temp_file],
                capture_output=True,
                text=True
            )
            
            issues = []
            if result.stderr:
                # Parse XML output
                try:
                    root = ET.fromstring(f'<root>{result.stderr}</root>')
                    for error in root.findall('.//error'):
                        location = error.find('location')
                        if location is not None:
                            issues.append({
                                'line': int(location.get('line', 0)),
                                'column': int(location.get('column', 0)),
                                'type': self._map_severity(error.get('severity', 'style')),
                                'message': error.get('msg', ''),
                                'symbol': error.get('id', ''),
                                'message_id': error.get('id', '')
                            })
                except ET.ParseError:
                    pass
            
            return issues
        except Exception as e:
            print(f"Cppcheck error: {e}")
            return []
    
    def _map_severity(self, severity: str) -> str:
        """Map cppcheck severity to our type system"""
        severity_map = {
            'error': 'error',
            'warning': 'warning',
            'style': 'convention',
            'performance': 'refactor',
            'portability': 'convention',
            'information': 'convention'
        }
        return severity_map.get(severity, 'convention')
    
    def _basic_syntax_check(self, code: str) -> list[dict]:
        """Basic syntax checking when cppcheck is not available"""
        issues = []
        lines = code.split('\n')
        
        for i, line in enumerate(lines, 1):
            # Check for missing semicolon
            stripped = line.strip()
            if stripped and not stripped.endswith((';', '{', '}', '//', '/*', '*/')):
                if any(keyword in stripped for keyword in ['int ', 'char ', 'return ', 'printf']):
                    if not stripped.startswith('//') and not stripped.startswith('*'):
                        issues.append({
                            'line': i,
                            'column': len(line),
                            'type': 'error',
                            'message': 'Missing semicolon',
                            'symbol': 'missing-semicolon',
                            'message_id': 'missing-semicolon'
                        })
            
            # Check for gets() usage (unsafe)
            if 'gets(' in line:
                issues.append({
                    'line': i,
                    'column': line.index('gets('),
                    'type': 'error',
                    'message': 'Never use gets(), use fgets() instead (buffer overflow risk)',
                    'symbol': 'unsafe-gets',
                    'message_id': 'unsafe-gets'
                })
            
            # Check for malloc without free
            if 'malloc(' in line:
                issues.append({
                    'line': i,
                    'column': line.index('malloc('),
                    'type': 'warning',
                    'message': 'Ensure allocated memory is freed to prevent memory leaks',
                    'symbol': 'memory-leak-check',
                    'message_id': 'memory-leak-check'
                })
            
            # Check for printf without format specifier
            if 'printf(' in line and '%' not in line:
                issues.append({
                    'line': i,
                    'column': line.index('printf('),
                    'type': 'convention',
                    'message': 'Consider using puts() for simple string output',
                    'symbol': 'printf-optimization',
                    'message_id': 'printf-optimization'
                })
        
        return issues
