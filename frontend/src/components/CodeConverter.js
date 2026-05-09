import React, { useState } from 'react';
import { FaExchangeAlt, FaCode, FaCopy, FaCheck } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import API_BASE_URL from '../config';
import './CodeConverter.css';

function CodeConverter() {
  const [inputCode, setInputCode] = useState('');
  const [fromLanguage, setFromLanguage] = useState('python');
  const [toLanguage, setToLanguage] = useState('javascript');
  const [convertedCode, setConvertedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const languages = [
    { id: 'python', name: 'Python' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'typescript', name: 'TypeScript' },
    { id: 'java', name: 'Java' },
    { id: 'c', name: 'C' },
    { id: 'cpp', name: 'C++' },
    { id: 'csharp', name: 'C#' },
    { id: 'go', name: 'Go' },
    { id: 'rust', name: 'Rust' },
    { id: 'php', name: 'PHP' },
    { id: 'ruby', name: 'Ruby' },
    { id: 'swift', name: 'Swift' },
    { id: 'kotlin', name: 'Kotlin' }
  ];

  const handleConvert = async () => {
    if (!inputCode.trim()) {
      alert('Please enter some code to convert');
      return;
    }

    if (fromLanguage === toLanguage) {
      alert('Please select different languages');
      return;
    }

    setLoading(true);
    setConvertedCode('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: inputCode,
          from_language: fromLanguage,
          to_language: toLanguage
        })
      });

      const data = await response.json();

      if (data.success) {
        setConvertedCode(data.converted_code);
      } else {
        setConvertedCode(`## ❌ Conversion Failed\n\n${data.error}`);
      }
    } catch (error) {
      console.error('Conversion error:', error);
      setConvertedCode(`## ❌ Error\n\nFailed to convert code. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    const temp = fromLanguage;
    setFromLanguage(toLanguage);
    setToLanguage(temp);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(convertedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputCode('');
    setConvertedCode('');
  };

  return (
    <div className="code-converter-container">
      <div className="converter-header">
        <h1 className="page-title">
          <FaExchangeAlt style={{ marginRight: '0.5rem', color: '#2563eb' }} />
          Code Converter
        </h1>
        <p className="page-subtitle">Convert code between different programming languages using AI</p>
      </div>

      <div className="converter-controls">
        <div className="language-selector">
          <label>From:</label>
          <select value={fromLanguage} onChange={(e) => setFromLanguage(e.target.value)}>
            {languages.map(lang => (
              <option key={lang.id} value={lang.id}>{lang.name}</option>
            ))}
          </select>
        </div>

        <button className="swap-btn" onClick={handleSwapLanguages} title="Swap languages">
          <FaExchangeAlt />
        </button>

        <div className="language-selector">
          <label>To:</label>
          <select value={toLanguage} onChange={(e) => setToLanguage(e.target.value)}>
            {languages.map(lang => (
              <option key={lang.id} value={lang.id}>{lang.name}</option>
            ))}
          </select>
        </div>

        <button 
          className="convert-btn" 
          onClick={handleConvert}
          disabled={loading || !inputCode.trim()}
        >
          {loading ? 'Converting...' : 'Convert Code'}
        </button>

        <button className="clear-btn" onClick={handleClear}>
          Clear
        </button>
      </div>

      <div className="converter-panels">
        <div className="input-panel">
          <div className="panel-header">
            <FaCode />
            <span>Input Code ({languages.find(l => l.id === fromLanguage)?.name})</span>
          </div>
          <textarea
            className="code-input"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder={`Enter your ${languages.find(l => l.id === fromLanguage)?.name} code here...`}
            disabled={loading}
          />
        </div>

        <div className="output-panel">
          <div className="panel-header">
            <FaCode />
            <span>Converted Code ({languages.find(l => l.id === toLanguage)?.name})</span>
            {convertedCode && (
              <button className="copy-btn" onClick={handleCopy} title="Copy converted code">
                {copied ? <FaCheck /> : <FaCopy />}
              </button>
            )}
          </div>
          <div className="code-output">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Converting your code...</p>
              </div>
            ) : convertedCode ? (
              <div className="markdown-output">
                <ReactMarkdown 
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    code({node, inline, className, children, ...props}) {
                      return inline ? (
                        <code className="inline-code" {...props}>
                          {children}
                        </code>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {convertedCode}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="empty-state">
                <FaExchangeAlt className="empty-icon" />
                <p>Converted code will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeConverter;
