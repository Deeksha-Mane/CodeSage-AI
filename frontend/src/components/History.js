import { useState, useEffect } from 'react';
import { FaCode, FaCalendar, FaExclamationTriangle, FaTrash, FaEye } from 'react-icons/fa';
import './History.css';

function History() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setReviews(data.reviews);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewReview = async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/history/${reviewId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setSelectedReview(data);
    } catch (error) {
      console.error('Error fetching review:', error);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:8000/history/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchHistory();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return <div className="history-loading">Loading history...</div>;
  }

  if (selectedReview) {
    return (
      <div className="review-detail">
        <button className="back-btn" onClick={() => setSelectedReview(null)}>
          ← Back to History
        </button>
        <div className="review-detail-header">
          <h2>Review Details</h2>
          <p className="review-date">
            <FaCalendar /> {formatDate(selectedReview.created_at)}
          </p>
        </div>
        <div className="review-code">
          <h3><FaCode /> Code</h3>
          <pre>{selectedReview.code}</pre>
        </div>
        <div className="review-issues">
          <h3><FaExclamationTriangle /> Issues Found: {selectedReview.total_issues}</h3>
          {selectedReview.issues.map((issue, index) => (
            <div key={index} className={`issue-item issue-${issue.type}`}>
              <div className="issue-header">
                <span className="issue-type">{issue.type}</span>
                <span className="issue-line">Line {issue.line}</span>
              </div>
              <p className="issue-message">{issue.message}</p>
              <p className="issue-explanation">{issue.explanation}</p>
              {issue.suggested_fix && (
                <div className="issue-fix">
                  <strong>Suggested Fix:</strong>
                  <p>{issue.suggested_fix}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h2>Code Review History</h2>
        <p>View your past code reviews and analysis results</p>
      </div>

      {reviews.length === 0 ? (
        <div className="no-history">
          <FaCode className="no-history-icon" />
          <h3>No Reviews Yet</h3>
          <p>Start analyzing code to build your review history</p>
        </div>
      ) : (
        <div className="history-list">
          {reviews.map((review) => (
            <div key={review.id} className="history-card">
              <div className="history-card-header">
                <div className="history-info">
                  <FaCalendar className="history-icon" />
                  <span>{formatDate(review.created_at)}</span>
                </div>
                <div className="history-actions">
                  <button 
                    className="view-btn"
                    onClick={() => viewReview(review.id)}
                    title="View Details"
                  >
                    <FaEye />
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteReview(review.id)}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="history-card-body">
                <div className="history-stat">
                  <FaExclamationTriangle className="stat-icon" />
                  <span>{review.total_issues} issues found</span>
                </div>
                <div className="history-stat">
                  <FaCode className="stat-icon" />
                  <span>{review.language}</span>
                </div>
              </div>
              <div className="history-code-preview">
                <pre>{review.code.substring(0, 150)}...</pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
