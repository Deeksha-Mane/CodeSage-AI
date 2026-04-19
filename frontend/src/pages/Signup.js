import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaGithub, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import API_BASE_URL from '../config';
import './Auth.css';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError(data.detail || 'Signup failed');
      }
    } catch (err) {
      setError('Connection error. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Placeholder for social login - will implement later
    alert(`${provider} signup will be implemented soon!`);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="logo-circle">
              <FaUser />
            </div>
          </div>
          <h1>Create Account</h1>
          <p>Start your journey to better code</p>
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
          <span>or sign up with email</span>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <FaUser className="input-icon" />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

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

          <div className="form-group">
            <label>
              <FaLock className="input-icon" />
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <span className="link" onClick={() => navigate('/login')}>
              Login
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

export default Signup;
