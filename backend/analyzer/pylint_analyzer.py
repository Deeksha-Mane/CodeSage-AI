"""Pylint integration for static code analysis"""
import tempfile
import os
from pylint.lint import Run
from pylint.reporters import JSONReporter
from io import StringIO
import json


class PylintAnalyzer:
    """Analyzes Python code using Pylint"""
    
    def analyze(self, code: str) -> list[dict]:
        """
        Analyze Python code and return structured issues
        
        Args:
            code: Python code string to analyze
            
        Returns:
            List of issues with line, column, type, message, symbol
        """
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
            f.write(code)
            temp_file = f.name
        
        try:
            output = StringIO()
            reporter = JSONReporter(output)
            
            # Run pylint with proper error handling
            try:
                Run([temp_file], reporter=reporter, exit=False)
            except SystemExit:
                pass  # Pylint calls sys.exit, we need to catch it
            
            output.seek(0)
            output_text = output.read()
            
            # Handle empty output
            if not output_text or output_text.strip() == '':
                return []
            
            results = json.loads(output_text)
            
            issues = []
            for item in results:
                issues.append({
                    'line': item.get('line', 0),
                    'column': item.get('column', 0),
                    'type': item.get('type', 'unknown'),
                    'message': item.get('message', ''),
                    'symbol': item.get('symbol', ''),
                    'message_id': item.get('message-id', '')
                })
            
            return issues
        finally:
            os.unlink(temp_file)
