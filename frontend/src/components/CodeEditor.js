import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { FaCopy, FaCheck, FaCode, FaExpand, FaCompress } from 'react-icons/fa';
import './CodeEditor.css';

function CodeEditor({ onAnalyze, loading }) {
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState('python');
  const [theme, setTheme] = useState('vs-dark');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorRef = useRef(null);

  const languages = [
    { id: 'python', name: 'Python' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'typescript', name: 'TypeScript' },
    { id: 'java', name: 'Java' },
    { id: 'c', name: 'C' },
    { id: 'cpp', name: 'C++' }
  ];

  const themes = [
    { id: 'vs-dark', name: 'Dark' },
    { id: 'vs-light', name: 'Light' },
    { id: 'hc-black', name: 'High Contrast' }
  ];

  const samples = {
    python: `def calculate_sum(a, b):
    """Calculate sum of two numbers"""
    result = a + b
    print(f"Sum: {result}")
    return result

# Test the function
x = 10
y = 20
total = calculate_sum(x, y)`,
    
    javascript: `function calculateSum(a, b) {
    // Calculate sum of two numbers
    const result = a + b;
    console.log(\`Sum: \${result}\`);
    return result;
}

// Test the function
const x = 10;
const y = 20;
const total = calculateSum(x, y);`,
    
    java: `public class Calculator {
    public static int calculateSum(int a, int b) {
        int result = a + b;
        System.out.println("Sum: " + result);
        return result;
    }
    
    public static void main(String[] args) {
        int x = 10;
        int y = 20;
        int total = calculateSum(x, y);
    }
}`,
    
    c: `#include <stdio.h>

int calculateSum(int a, int b) {
    int result = a + b;
    printf("Sum: %d\\n", result);
    return result;
}

int main() {
    int x = 10;
    int y = 20;
    int total = calculateSum(x, y);
    return 0;
}`
  };

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
  }, [code, loading, language, handleAnalyze]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Add custom keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (code.trim() && !loading) {
        handleAnalyze();
      }
    });
  };

  const handleAnalyze = () => {
    if (code.trim()) {
      onAnalyze(code, language);
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

  const loadSample = () => {
    setCode(samples[language] || samples.python);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    // Optionally load sample for new language
    if (!code.trim()) {
      setCode(samples[newLang] || '');
    }
  };

  return (
    <div className={`code-editor-container ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="editor-header">
        <div className="editor-title">
          <FaCode /> Code Editor
        </div>
        <div className="editor-controls">
          <select 
            className="editor-select"
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            disabled={loading}
          >
            {languages.map(lang => (
              <option key={lang.id} value={lang.id}>{lang.name}</option>
            ))}
          </select>
          
          <select 
            className="editor-select"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            {themes.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <button 
            type="button" 
            className="editor-icon-btn"
            onClick={handleCopyCode}
            disabled={!code.trim()}
            title="Copy code"
          >
            {copied ? <FaCheck /> : <FaCopy />}
          </button>

          <button 
            type="button" 
            className="editor-icon-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>

      <div className="editor-wrapper">
        <Editor
          height={isFullscreen ? "calc(100vh - 200px)" : "400px"}
          language={language}
          value={code}
          onChange={(value) => setCode(value || '')}
          theme={theme}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: 'on',
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: 'always',
            matchBrackets: 'always',
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            autoIndent: 'full'
          }}
        />
      </div>

      <form onSubmit={handleSubmit} className="editor-actions">
        <div className="editor-stats">
          <span className="stat-item">
            Lines: {code.split('\n').length}
          </span>
          <span className="stat-item">
            Characters: {code.length}
          </span>
        </div>

        <div className="editor-buttons">
          <button 
            type="button" 
            className="btn-sample"
            onClick={loadSample}
            disabled={loading}
          >
            Load Sample
          </button>
          <button 
            type="button" 
            className="btn-clear"
            onClick={handleClearCode}
            disabled={!code.trim() || loading}
          >
            Clear
          </button>
          <button 
            type="submit" 
            className="btn-analyze"
            disabled={loading || !code.trim()}
          >
            {loading ? 'Analyzing...' : 'Analyze Code'}
          </button>
        </div>
      </form>

      <div className="editor-hint">
        💡 Tip: Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to analyze quickly
      </div>
    </div>
  );
}

export default CodeEditor;
