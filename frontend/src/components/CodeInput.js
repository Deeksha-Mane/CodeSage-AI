import React, { useState, useEffect } from 'react';
import { FaCopy, FaCheck, FaCode } from 'react-icons/fa';
import './CodeInput.css';

function CodeInput({ onAnalyze, loading }) {
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [lineCount, setLineCount] = useState(1);
  const [language, setLanguage] = useState('auto');

  const languages = [
    { id: 'auto', name: 'Auto-detect' },
    { id: 'python', name: 'Python' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'typescript', name: 'TypeScript' },
    { id: 'java', name: 'Java' },
    { id: 'c', name: 'C' },
    { id: 'cpp', name: 'C++' }
  ];

  useEffect(() => {
    const lines = code.split('\n').length;
    setLineCount(lines);
  }, [code]);

  // Keyboard shortcut: Ctrl+Enter to analyze
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (code.trim() && !loading) {
          handleAnalyze();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, loading, language]);

  const handleAnalyze = () => {
    if (code.trim()) {
      onAnalyze(code, language === 'auto' ? null : language);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAnalyze();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearCode = () => {
    setCode('');
  };

  const loadSample = (lang) => {
    const samples = {
      python: `def calculate_sum(a, b):
    result = a + b
    print(result)
    return result

x = 10
y = 20
calculate_sum(x, y)`,
      javascript: `function calculateSum(a, b) {
    var result = a + b;
    console.log(result);
    return result;
}

const x = 10;
const y = 20;
calculateSum(x, y);`,
      java: `public class Calculator {
    public static void main(String[] args) {
        int x = 10;
        int y = 20;
        int result = x + y;
        System.out.println(result);
    }
}`,
      c: `#include <stdio.h>

int main() {
    int x = 10;
    int y = 20;
    int result = x + y;
    printf("%d", result);
    return 0;
}`
    };
    
    setCode(samples[lang] || samples.python);
  };

  return (
    <div className="code-input-container">
      <div className="code-input-header">
        <h2>
          <FaCode /> Enter Your Code
        </h2>
        <div className="code-actions">
          <select 
            className="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {languages.map(lang => (
              <option key={lang.id} value={lang.id}>{lang.name}</option>
            ))}
          </select>
          <button 
            type="button" 
            className="icon-btn"
            onClick={handleCopyCode}
            disabled={!code.trim()}
            title="Copy code"
          >
            {copied ? <FaCheck /> : <FaCopy />}
          </button>
          <span className="line-count">{lineCount} lines</span>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="code-editor-wrapper">
          <div className="line-numbers">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i + 1} className="line-number">{i + 1}</div>
            ))}
          </div>
          <textarea
            className="code-textarea"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here... (Ctrl+Enter to analyze)"
            rows={15}
            spellCheck={false}
          />
        </div>
        <div className="button-group">
          <button 
            type="submit" 
            className="analyze-btn"
            disabled={loading || !code.trim()}
          >
            {loading ? 'Analyzing...' : 'Analyze Code'}
          </button>
          <button 
            type="button" 
            className="sample-btn"
            onClick={() => loadSample(language === 'auto' ? 'python' : language)}
          >
            Load Sample
          </button>
          <button 
            type="button" 
            className="clear-btn"
            onClick={handleClearCode}
            disabled={!code.trim()}
          >
            Clear
          </button>
        </div>
        <div className="keyboard-hint">
          💡 Tip: Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to analyze quickly
        </div>
      </form>
    </div>
  );
}

export default CodeInput;
