import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaCode, FaHistory, FaChartBar, FaCog, FaSignOutAlt, FaBars, FaTimes, FaCheckCircle, FaUser, FaEnvelope, FaCalendar, FaShieldAlt, FaCrown, FaExclamationTriangle, FaPalette } from 'react-icons/fa';
import { useTheme } from '../ThemeContext';
import CodeInput from '../components/CodeInput';
import IssuesList from '../components/IssuesList';
import History from '../components/History';
import Analytics from '../components/Analytics';
import './Dashboard.css';
import './DashboardThemed.css';

function Dashboard() {
  const navigate = useNavigate();
  const { theme, changeTheme, themes } = useTheme();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('review');
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [deletePassword, setDeletePassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setEditName(parsedUser.name);
    }
  }, [navigate]);

  const handleAnalyze = async (code) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code })
      });
      const data = await response.json();
      setIssues(data.issues);
    } catch (error) {
      console.error('Error analyzing code:', error);
      alert('Failed to analyze code. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleUpdateProfile = async () => {
    if (!editName.trim()) {
      setMessage({ type: 'error', text: 'Name cannot be empty' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: editName })
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setEditMode(false);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: data.detail || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Connection error. Make sure backend is running.' });
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: data.detail || 'Failed to change password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Connection error. Make sure backend is running.' });
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setMessage({ type: 'error', text: 'Please enter your password' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/auth/account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: deletePassword })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
      } else {
        setMessage({ type: 'error', text: data.detail || 'Failed to delete account' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Connection error. Make sure backend is running.' });
    }
  };

  if (!user) return null;

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <FaCode className="logo-icon" />
            {sidebarOpen && <span>CodeSage AI</span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'review' ? 'active' : ''}`}
            onClick={() => setActiveTab('review')}
          >
            <FaHome className="nav-icon" />
            {sidebarOpen && <span>Code Review</span>}
          </button>
          <button 
            className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <FaHistory className="nav-icon" />
            {sidebarOpen && <span>History</span>}
          </button>
          <button 
            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <FaChartBar className="nav-icon" />
            {sidebarOpen && <span>Analytics</span>}
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FaCog className="nav-icon" />
            {sidebarOpen && <span>Settings</span>}
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout" onClick={handleLogout}>
            <FaSignOutAlt className="nav-icon" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`dashboard-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Top Bar */}
        <div className="dashboard-topbar">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <div className="topbar-right">
            <span className="user-greeting">Hi, {user.name}!</span>
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'review' && (
          <div className="content-area">
            <div className="dashboard-main">
              <CodeInput onAnalyze={handleAnalyze} loading={loading} />
              <IssuesList issues={issues} />
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="content-area">
            <History />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="content-area">
            <Analytics />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="content-area">
            <div className="settings-page">
              <h1 className="page-title">Profile & Settings</h1>
              <p className="page-subtitle">Manage your account and preferences</p>

              {message.text && (
                <div className={`message-banner ${message.type}`}>
                  {message.text}
                </div>
              )}

              {/* Profile Overview Card */}
              <div className="profile-overview">
                <div className="profile-header">
                  <div className="profile-avatar-large">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="profile-header-info">
                    <h2>{user.name}</h2>
                    <p className="profile-email">{user.email}</p>
                    <div className="profile-badges">
                      <span className="badge badge-free">
                        <FaCrown /> Free Plan
                      </span>
                      <span className="badge badge-verified">
                        <FaShieldAlt /> Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Profile Information */}
              <div className="settings-section">
                <h3>Profile Information</h3>
                <div className="settings-card">
                  <div className="profile-details-grid">
                    <div className="profile-detail-item">
                      <div className="detail-icon">
                        <FaUser />
                      </div>
                      <div className="detail-content">
                        <label>Full Name</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="edit-input"
                          />
                        ) : (
                          <p>{user.name}</p>
                        )}
                      </div>
                    </div>

                    <div className="profile-detail-item">
                      <div className="detail-icon">
                        <FaEnvelope />
                      </div>
                      <div className="detail-content">
                        <label>Email Address</label>
                        <p>{user.email}</p>
                      </div>
                    </div>

                    <div className="profile-detail-item">
                      <div className="detail-icon">
                        <FaCalendar />
                      </div>
                      <div className="detail-content">
                        <label>Member Since</label>
                        <p>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>

                    <div className="profile-detail-item">
                      <div className="detail-icon">
                        <FaCrown />
                      </div>
                      <div className="detail-content">
                        <label>Account Type</label>
                        <p>Free Plan</p>
                      </div>
                    </div>

                    <div className="profile-detail-item">
                      <div className="detail-icon">
                        <FaCode />
                      </div>
                      <div className="detail-content">
                        <label>Total Reviews</label>
                        <p>0 reviews</p>
                      </div>
                    </div>

                    <div className="profile-detail-item">
                      <div className="detail-icon">
                        <FaShieldAlt />
                      </div>
                      <div className="detail-content">
                        <label>Account Status</label>
                        <p className="status-active">Active</p>
                      </div>
                    </div>
                  </div>

                  <div className="profile-actions">
                    {editMode ? (
                      <>
                        <button className="btn-primary-outline" onClick={handleUpdateProfile}>
                          <FaCheckCircle /> Save Changes
                        </button>
                        <button className="btn-secondary" onClick={() => {
                          setEditMode(false);
                          setEditName(user.name);
                        }}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn-primary-outline" onClick={() => setEditMode(true)}>
                          <FaUser /> Edit Profile
                        </button>
                        <button className="btn-primary-outline" disabled>
                          <FaCrown /> Upgrade to Pro
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h3>Preferences</h3>
                <div className="settings-card">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>
                        <FaPalette style={{ marginRight: '0.5rem' }} />
                        Theme
                      </h4>
                      <p>Choose your preferred color theme</p>
                    </div>
                    <select 
                      className="theme-dropdown"
                      value={theme}
                      onChange={(e) => changeTheme(e.target.value)}
                    >
                      {themes.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Email Notifications</h4>
                      <p>Receive email updates about your code reviews</p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Auto-save Code</h4>
                      <p>Automatically save your code snippets</p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h3>Security</h3>
                <div className="settings-card">
                  <div className="form-group">
                    <label>Change Password</label>
                    <button className="btn-secondary" onClick={() => setShowPasswordModal(true)}>
                      Update Password
                    </button>
                  </div>
                  <div className="form-group">
                    <label>Two-Factor Authentication</label>
                    <p className="setting-description">Add an extra layer of security to your account</p>
                    <button className="btn-secondary" disabled>
                      Enable 2FA (Coming Soon)
                    </button>
                  </div>
                </div>
              </div>

              <div className="settings-section danger-zone">
                <h3>
                  <FaExclamationTriangle /> Danger Zone
                </h3>
                <div className="settings-card">
                  <div className="danger-zone-content">
                    <div className="setting-info">
                      <h4>Delete Account</h4>
                      <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
                    </div>
                    <button className="btn-danger" onClick={() => setShowDeleteModal(true)}>
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
              <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h2>Change Password</h2>
                  <div className="form-group">
                    <label>Current Password</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      placeholder="Confirm new password"
                    />
                  </div>
                  <div className="modal-actions">
                    <button className="btn-primary-outline" onClick={handleChangePassword}>
                      Change Password
                    </button>
                    <button className="btn-secondary" onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    }}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Account Modal */}
            {showDeleteModal && (
              <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header-danger">
                    <FaExclamationTriangle className="modal-icon-danger" />
                    <h2>Delete Account</h2>
                  </div>
                  <p className="warning-text">
                    This action cannot be undone. All your data will be permanently deleted.
                  </p>
                  <div className="form-group">
                    <label>Enter your password to confirm</label>
                    <input
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                  </div>
                  <div className="modal-actions">
                    <button className="btn-danger" onClick={handleDeleteAccount}>
                      Delete My Account
                    </button>
                    <button className="btn-secondary" onClick={() => {
                      setShowDeleteModal(false);
                      setDeletePassword('');
                    }}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
