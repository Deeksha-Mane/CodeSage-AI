import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCode, FaRocket, FaBolt, FaShieldAlt, FaLightbulb, FaChartLine, FaArrowRight, FaCheckCircle, FaBars, FaTimes, FaArrowUp } from 'react-icons/fa';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [navbarScrolled, setNavbarScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show back to top button after scrolling 300px
      setShowBackToTop(window.scrollY > 300);
      // Add shadow to navbar after scrolling 50px
      setNavbarScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'auto' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="landing-page">
      <nav className={`navbar ${navbarScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="logo" onClick={() => navigate('/')}>
            <FaCode className="logo-icon" />
            <span className="logo-text">CodeSage AI</span>
          </div>
          
          <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            <a onClick={() => scrollToSection('features')} className="nav-link">Features</a>
            <a onClick={() => scrollToSection('how-it-works')} className="nav-link">How It Works</a>
            <a onClick={() => scrollToSection('pricing')} className="nav-link">Pricing</a>
            <a href="#" className="nav-link">Documentation</a>
          </div>

          <div className="nav-buttons">
            <button className="btn-secondary" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="btn-primary" onClick={() => navigate('/signup')}>
              Get Started
            </button>
          </div>

          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Back to Top Button */}
      <button 
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <FaArrowUp />
      </button>

      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <FaBolt className="badge-icon" />
            <span>Powered by AI</span>
          </div>
          <h1 className="hero-title">
            Transform Your Code with
            <span className="gradient-text"> AI-Powered Reviews</span>
          </h1>
          <p className="hero-subtitle">
            Get instant, intelligent feedback on your Python code. Learn faster, code better, 
            and build with confidence using our advanced AI analysis platform.
          </p>
          <div className="hero-buttons">
            <button className="btn-hero-primary" onClick={() => navigate('/signup')}>
              Start Free Trial
              <FaArrowRight className="arrow" />
            </button>
            <button className="btn-hero-secondary" onClick={() => navigate('/demo')}>
              <FaRocket />
              Watch Demo
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Code Reviews</div>
            </div>
            <div className="stat">
              <div className="stat-number">500+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat">
              <div className="stat-number">99%</div>
              <div className="stat-label">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <div className="features-header">
          <h2 className="section-title">Why Developers Choose Us</h2>
          <p className="section-subtitle">
            Everything you need to write better code, faster
          </p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FaBolt className="feature-icon" />
            </div>
            <h3>Lightning Fast Analysis</h3>
            <p>Get real-time feedback on your code in seconds. No waiting, no delays.</p>
            <div className="feature-check">
              <FaCheckCircle /> Instant results
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FaLightbulb className="feature-icon" />
            </div>
            <h3>Smart Suggestions</h3>
            <p>AI-powered recommendations that help you learn and improve with every review.</p>
            <div className="feature-check">
              <FaCheckCircle /> Contextual advice
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FaShieldAlt className="feature-icon" />
            </div>
            <h3>Secure & Private</h3>
            <p>Your code is analyzed securely with enterprise-grade encryption.</p>
            <div className="feature-check">
              <FaCheckCircle /> 100% confidential
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FaChartLine className="feature-icon" />
            </div>
            <h3>Track Your Progress</h3>
            <p>Monitor your improvement over time with detailed analytics and insights.</p>
            <div className="feature-check">
              <FaCheckCircle /> Visual dashboards
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FaCode className="feature-icon" />
            </div>
            <h3>Best Practices</h3>
            <p>Learn industry standards and coding conventions from expert recommendations.</p>
            <div className="feature-check">
              <FaCheckCircle /> Professional tips
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FaRocket className="feature-icon" />
            </div>
            <h3>Accelerate Learning</h3>
            <p>Master programming faster with personalized feedback and explanations.</p>
            <div className="feature-check">
              <FaCheckCircle /> Beginner friendly
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="how-it-works">
        <div className="how-it-works-content">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Get started in three simple steps</p>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Paste Your Code</h3>
              <p>Simply paste your Python code into our editor</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>AI Analysis</h3>
              <p>Our AI analyzes your code for issues and improvements</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Get Feedback</h3>
              <p>Receive detailed explanations and actionable suggestions</p>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="testimonials-content">
          <h2 className="section-title">Loved by Developers Worldwide</h2>
          <p className="section-subtitle">See what developers are saying about CodeSage AI</p>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <span>JD</span>
                </div>
                <div className="testimonial-info">
                  <h4>John Doe</h4>
                  <p>Senior Developer at TechCorp</p>
                </div>
              </div>
              <div className="testimonial-rating">
                ⭐⭐⭐⭐⭐
              </div>
              <p className="testimonial-text">
                "CodeSage AI has transformed how I review code. The AI suggestions are incredibly accurate and have helped me catch bugs I would have missed. It's like having a senior developer reviewing every line!"
              </p>
              <div className="testimonial-badge">Verified User</div>
            </div>

            <div className="testimonial-card featured">
              <div className="featured-badge">Top Review</div>
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <span>SK</span>
                </div>
                <div className="testimonial-info">
                  <h4>Sarah Kim</h4>
                  <p>Lead Engineer at StartupXYZ</p>
                </div>
              </div>
              <div className="testimonial-rating">
                ⭐⭐⭐⭐⭐
              </div>
              <p className="testimonial-text">
                "The best code review tool I've used. The explanations are clear, the suggestions are practical, and it's saved our team countless hours. The learning curve is zero - just paste and analyze!"
              </p>
              <div className="testimonial-badge">Verified User</div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <span>MP</span>
                </div>
                <div className="testimonial-info">
                  <h4>Mike Peterson</h4>
                  <p>Full Stack Developer</p>
                </div>
              </div>
              <div className="testimonial-rating">
                ⭐⭐⭐⭐⭐
              </div>
              <p className="testimonial-text">
                "As a junior developer, CodeSage AI has been my mentor. It not only finds issues but explains why they're problems and how to fix them. My code quality has improved dramatically!"
              </p>
              <div className="testimonial-badge">Verified User</div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="pricing">
        <div className="pricing-content">
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <p className="section-subtitle">Choose the plan that's right for you</p>
          <div className="pricing-grid">
            <div className="pricing-card">
              <h3>Free</h3>
              <div className="price">
                <span className="currency">$</span>
                <span className="amount">0</span>
                <span className="period">/month</span>
              </div>
              <ul className="features-list">
                <li><FaCheckCircle /> 10 reviews per day</li>
                <li><FaCheckCircle /> Basic analysis</li>
                <li><FaCheckCircle /> Community support</li>
              </ul>
              <button className="btn-pricing" onClick={() => navigate('/signup')}>
                Get Started
              </button>
            </div>
            <div className="pricing-card featured">
              <div className="popular-badge">Most Popular</div>
              <h3>Pro</h3>
              <div className="price">
                <span className="currency">$</span>
                <span className="amount">19</span>
                <span className="period">/month</span>
              </div>
              <ul className="features-list">
                <li><FaCheckCircle /> Unlimited reviews</li>
                <li><FaCheckCircle /> Advanced AI analysis</li>
                <li><FaCheckCircle /> Priority support</li>
                <li><FaCheckCircle /> Code history</li>
              </ul>
              <button className="btn-pricing primary" onClick={() => navigate('/signup')}>
                Start Free Trial
              </button>
            </div>
            <div className="pricing-card">
              <h3>Team</h3>
              <div className="price">
                <span className="currency">$</span>
                <span className="amount">49</span>
                <span className="period">/month</span>
              </div>
              <ul className="features-list">
                <li><FaCheckCircle /> Everything in Pro</li>
                <li><FaCheckCircle /> Team collaboration</li>
                <li><FaCheckCircle /> Custom integrations</li>
                <li><FaCheckCircle /> Dedicated support</li>
              </ul>
              <button className="btn-pricing" onClick={() => navigate('/signup')}>
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="cta-content">
          <h2>Ready to Level Up Your Coding?</h2>
          <p>Join thousands of developers who are writing better code with AI assistance</p>
          <button className="btn-cta" onClick={() => navigate('/signup')}>
            Get Started Free
            <FaArrowRight />
          </button>
          <p className="cta-note">No credit card required • Free forever</p>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <FaCode />
              <span>CodeSage AI</span>
            </div>
            <p>Empowering developers with AI-powered code reviews</p>
          </div>
          <div className="footer-section">
            <h4>Product</h4>
            <a href="#">Features</a>
            <a href="#">Pricing</a>
            <a href="#">Documentation</a>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Blog</a>
            <a href="#">Careers</a>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Contact</a>
            <a href="#">Privacy</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 CodeSage AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
