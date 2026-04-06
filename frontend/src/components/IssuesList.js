import React from 'react';
import IssueCard from './IssueCard';
import './IssuesList.css';

function IssuesList({ issues }) {
  if (!issues || issues.length === 0) {
    return (
      <div className="issues-container">
        <h2>Analysis Results</h2>
        <div className="empty-state">
          <p>No issues found yet. Analyze some code to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="issues-container">
      <h2>Found {issues.length} Issue{issues.length !== 1 ? 's' : ''}</h2>
      <div className="issues-list">
        {issues.map((issue, index) => (
          <IssueCard key={issue.issue_id} issue={issue} index={index} />
        ))}
      </div>
    </div>
  );
}

export default IssuesList;
