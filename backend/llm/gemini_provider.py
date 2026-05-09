"""Google Gemini AI provider"""
import google.generativeai as genai
from .base import LLMProvider


class GeminiProvider(LLMProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')
    
    def generate_explanation(self, issue: dict, code: str) -> dict:
        """Generate AI explanation for a code issue"""
        prompt = f"""You are an expert code reviewer. Analyze this code issue and provide a well-structured explanation.

**Issue Details:**
- Type: {issue.get('type', 'Unknown')}
- Message: {issue.get('message', '')}
- Line: {issue.get('line', 'N/A')}

**Code Context:**
```
{code}
```

Provide a professional, well-formatted response with:

## 🔍 What's the Issue?
[Brief explanation of what the problem is]

## ⚠️ Why It Matters
[Explain why this is a problem and potential consequences]

## ✅ How to Fix It
[Step-by-step solution with code examples if applicable]

## 💡 Best Practice
[Professional recommendation for avoiding this in the future]

Use markdown formatting, code blocks with ```language```, bullet points, and emojis for visual appeal. Keep it concise but informative."""

        try:
            response = self.model.generate_content(prompt)
            explanation = response.text
        except Exception as e:
            explanation = f"Error generating explanation: {str(e)}"
        
        # Generate fix suggestion
        fix_prompt = f"""Provide a clean, well-formatted code fix for this issue.

**Issue:** {issue.get('message', '')}
**Line:** {issue.get('line', 'N/A')}

**Original Code:**
```
{code}
```

Provide ONLY the corrected code in a proper code block with syntax highlighting. Format it professionally with proper indentation. Start with ```python (or appropriate language) and end with ```. Add a brief comment explaining the fix."""

        try:
            fix_response = self.model.generate_content(fix_prompt)
            suggested_fix = fix_response.text
        except Exception as e:
            suggested_fix = f"```\n# Error generating fix: {str(e)}\n```"
        
        return {
            "explanation": explanation,
            "suggested_fix": suggested_fix
        }
    
    def chat(self, message: str, context: str = "") -> str:
        """Chat with AI about coding questions"""
        context_section = f"**Code Context:**\n```\n{context}\n```" if context else ""
        
        prompt = f"""You are a professional coding assistant. Answer the user's question with well-formatted, premium-quality responses.

**User Question:** {message}

{context_section}

Provide a comprehensive, well-structured answer using:
- Markdown formatting (headers, bold, italic)
- Code blocks with proper syntax highlighting (```language)
- Bullet points and numbered lists
- Emojis for visual appeal (✅ ❌ 💡 🔍 ⚠️)
- Clear sections with headers (##)
- Professional tone

Make it look premium and easy to read. Include code examples when relevant."""

        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"⚠️ **Error:** {str(e)}"
    
    def convert_code(self, code: str, from_language: str, to_language: str) -> dict:
        """Convert code from one language to another"""
        prompt = f"""You are an expert code converter. Convert the following {from_language} code to {to_language}.

**Original Code ({from_language}):**
```{from_language}
{code}
```

**Requirements:**
1. Convert to idiomatic {to_language} code
2. Maintain the same functionality
3. Follow {to_language} best practices and conventions
4. Add helpful comments explaining key conversions
5. Use proper {to_language} syntax and style

Provide your response in this format:

## 🔄 Converted Code

```{to_language}
[Your converted code here]
```

## 📝 Conversion Notes

- Key changes made
- Important differences to note
- Best practices applied

## ⚠️ Important Considerations

- Any limitations or caveats
- Things to test
- Potential issues to watch for

Make it professional and well-formatted with proper indentation."""

        try:
            response = self.model.generate_content(prompt)
            return {
                "success": True,
                "converted_code": response.text,
                "from_language": from_language,
                "to_language": to_language
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "from_language": from_language,
                "to_language": to_language
            }
