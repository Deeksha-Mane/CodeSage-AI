import React, { useState } from 'react';
import './CodeInput.css';

function CodeInput({ onAnalyze, loading }) {
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim()) {
      onAnalyze(code);
    }
  };

  const sampleCode = `def calculate_sum(a, b):
    result = a + b
    print(result)
    return result

x = 10
y = 20
calculate_sum(x, y)`;

  return (
    <div className="code-input-container">
      <h2>Enter Your Python Code</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="code-textarea"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your Python code here..."
          rows={15}
        />
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
            onClick={() => setCode(sampleCode)}
          >
            Load Sample
          </button>
        </div>
      </form>
    </div>
  );
}

export default CodeInput;
