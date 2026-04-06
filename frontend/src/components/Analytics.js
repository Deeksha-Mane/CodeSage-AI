import { useState, useEffect } from 'react';
import { FaChartBar, FaCode, FaExclamationTriangle, FaCheckCircle, FaTrophy } from 'react-icons/fa';
import './Analytics.css';

function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/analytics/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="analytics-loading">Loading analytics...</div>;
  }

  if (!stats) {
    return <div className="analytics-error">Failed to load analytics</div>;
  }

  const { stats: userStats, issues_by_type } = stats;

  const getIssueTypeColor = (type) => {
    const colors = {
      'error': '#ef4444',
      'warning': '#f59e0b',
      'convention': '#3b82f6',
      'refactor': '#8b5cf6',
      'info': '#06b6d4'
    };
    return colors[type] || '#6b7280';
  };

  const totalIssues = Object.values(issues_by_type).reduce((sum, count) => sum + count, 0);

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2><FaChartBar /> Analytics Dashboard</h2>
        <p>Track your code quality and improvement over time</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <FaCode />
          </div>
          <div className="stat-content">
            <h3>{userStats.total_reviews}</h3>
            <p>Total Reviews</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <FaExclamationTriangle />
          </div>
          <div className="stat-content">
            <h3>{userStats.total_issues}</h3>
            <p>Issues Found</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <FaChartBar />
          </div>
          <div className="stat-content">
            <h3>{userStats.avg_issues_per_review}</h3>
            <p>Avg Issues/Review</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <FaTrophy />
          </div>
          <div className="stat-content">
            <h3>{userStats.total_reviews > 0 ? 'Active' : 'New'}</h3>
            <p>Status</p>
          </div>
        </div>
      </div>

      <div className="issues-breakdown">
        <h3><FaExclamationTriangle /> Issues Breakdown by Type</h3>
        
        {Object.keys(issues_by_type).length === 0 ? (
          <div className="no-data">
            <FaCheckCircle className="no-data-icon" />
            <p>No issues found yet. Start analyzing code to see breakdown!</p>
          </div>
        ) : (
          <div className="issues-chart">
            {Object.entries(issues_by_type).map(([type, count]) => {
              const percentage = ((count / totalIssues) * 100).toFixed(1);
              return (
                <div key={type} className="issue-type-row">
                  <div className="issue-type-info">
                    <span className="issue-type-name">{type}</span>
                    <span className="issue-type-count">{count} issues ({percentage}%)</span>
                  </div>
                  <div className="issue-type-bar">
                    <div 
                      className="issue-type-fill"
                      style={{ 
                        width: `${percentage}%`,
                        background: getIssueTypeColor(type)
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="insights-section">
        <h3><FaTrophy /> Insights & Recommendations</h3>
        <div className="insights-grid">
          {userStats.total_reviews === 0 && (
            <div className="insight-card">
              <FaCode className="insight-icon" />
              <h4>Get Started</h4>
              <p>Analyze your first piece of code to start tracking your progress!</p>
            </div>
          )}
          
          {userStats.total_reviews > 0 && userStats.avg_issues_per_review > 5 && (
            <div className="insight-card warning">
              <FaExclamationTriangle className="insight-icon" />
              <h4>High Issue Rate</h4>
              <p>Your average is {userStats.avg_issues_per_review} issues per review. Focus on code quality best practices.</p>
            </div>
          )}
          
          {userStats.total_reviews > 0 && userStats.avg_issues_per_review <= 3 && (
            <div className="insight-card success">
              <FaCheckCircle className="insight-icon" />
              <h4>Great Job!</h4>
              <p>You're maintaining excellent code quality with an average of {userStats.avg_issues_per_review} issues per review.</p>
            </div>
          )}
          
          {userStats.total_reviews >= 10 && (
            <div className="insight-card">
              <FaTrophy className="insight-icon" />
              <h4>Consistent Reviewer</h4>
              <p>You've completed {userStats.total_reviews} reviews! Keep up the great work.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
