import React, { useState } from 'react';
import './IssueCard.css';

function IssueCard({ issue, index }) {
  const [feedbackGiven, setFeedbackGiven] = useState(false);

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

  const getTypeColor = (type) => {
    const colors = {
      error: '#e74c3c',
      warning: '#f39c12',
      convention: '#3498db',
      refactor: '#9b59b6'
    };
    return colors[type] || '#95a5a6';
  };

  return (
    <div className="issue-card">
      <div className="issue-header">
        <span className="issue-number">#{index + 1}</span>
        <span 
          className="issue-type" 
          style={{ backgroundColor: getTypeColor(issue.type) }}
        >
          {issue.type}
        </span>
        <span className="issue-location">Line {issue.line}</span>
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
