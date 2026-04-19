import React, { useState } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';
import './IssueCard.css';

function IssueCard({ issue, index }) {
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFeedback = async (isHelpful) => {
    try {
      await fetch('http://localhost:8000/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issue_id: issue.issue_id,
          is_helpful: isHelpful,
          issue_data: {
            line: issue.line,
            type: issue.type,
            message: issue.message
          },
          explanation: issue.explanation
        })
      });
      setFeedbackGiven(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const handleCopy = () => {
    const text = `Issue #${index + 1} - ${issue.type.toUpperCase()}
Line: ${issue.line}
Message: ${issue.message}
Explanation: ${issue.explanation}
Suggested Fix: ${issue.suggested_fix}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTypeColor = (type) => {
    const colors = {
      error: '#e74c3c',
      warning: '#f39c12',
      convention: '#3498db',
      refactor: '#9b59b6'
    };
    return colors[type] || '#95a5a6';
  };

  const getSeverityBadge = (type) => {
    const severities = {
      error: { label: 'Critical', color: '#e74c3c' },
      warning: { label: 'High', color: '#f39c12' },
      convention: { label: 'Medium', color: '#3498db' },
      refactor: { label: 'Low', color: '#9b59b6' }
    };
    return severities[type] || { label: 'Info', color: '#95a5a6' };
  };

  const severity = getSeverityBadge(issue.type);

  return (
    <div className="issue-card">
      <div className="issue-header">
        <div className="issue-header-left">
          <span className="issue-number">#{index + 1}</span>
          <span 
            className="issue-type" 
            style={{ backgroundColor: getTypeColor(issue.type) }}
          >
            {issue.type}
          </span>
          <span 
            className="severity-badge"
            style={{ 
              backgroundColor: `${severity.color}20`,
              color: severity.color,
              border: `1px solid ${severity.color}`
            }}
          >
            {severity.label}
          </span>
          <span className="issue-location">Line {issue.line}</span>
        </div>
        <button 
          className="copy-issue-btn"
          onClick={handleCopy}
          title="Copy issue details"
        >
          {copied ? <FaCheck /> : <FaCopy />}
        </button>
      </div>
      
      <div className="issue-message">
        <strong>Issue:</strong> {issue.message}
      </div>
      
      <div className="issue-explanation">
        <strong>Explanation:</strong> {issue.explanation}
      </div>
      
      <div className="issue-fix">
        <strong>Suggested Fix:</strong> {issue.suggested_fix}
      </div>
      
      <div className="feedback-section">
        {!feedbackGiven ? (
          <>
            <span>Was this helpful?</span>
            <button 
              className="feedback-btn helpful"
              onClick={() => handleFeedback(true)}
            >
              👍 Yes
            </button>
            <button 
              className="feedback-btn not-helpful"
              onClick={() => handleFeedback(false)}
            >
              👎 No
            </button>
          </>
        ) : (
          <span className="feedback-thanks">Thanks for your feedback!</span>
        )}
      </div>
    </div>
  );
}

export default IssueCard;
