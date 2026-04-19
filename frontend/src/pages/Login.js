import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaGithub, FaEnvelope, FaLock } from 'react-icons/fa';
import API_BASE_URL from '../config';
import './Auth.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError(data.detail || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Placeholder for social login - will implement later
    alert(`${provider} login will be implemented soon!`);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="logo-circle">
              <FaLock />
            </div>
          </div>
          <h1>Welcome Back</h1>
          <p>Login to continue your coding journey</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="social-login">
          <button 
            className="social-btn google-btn" 
            onClick={() => handleSocialLogin('Google')}
            type="button"
          >
            <FaGoogle className="social-icon" />
            <span>Continue with Google</span>
          </button>
          <button 
            className="social-btn github-btn" 
            onClick={() => handleSocialLogin('GitHub')}
            type="button"
          >
            <FaGithub className="social-icon" />
            <span>Continue with GitHub</span>
          </button>
        </div>

        <div className="divider">
          <span>or login with email</span>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <FaEnvelope className="input-icon" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <FaLock className="input-icon" />
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <button type="button" className="forgot-password" onClick={() => alert('Password reset feature coming soon!')}>Forgot password?</button>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <span className="link" onClick={() => navigate('/signup')}>
              Sign up
            </span>
          </p>
          <p>
            <span className="link" onClick={() => navigate('/')}>
              ← Back to home
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
