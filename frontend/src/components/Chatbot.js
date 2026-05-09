import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaTimes, FaRobot, FaUser } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import './Chatbot.css';
import API_BASE_URL from '../config';

function Chatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m your coding assistant. Ask me anything about programming, debugging, or best practices!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const isFullPage = onClose === undefined || (typeof onClose === 'function' && onClose.toString() === '() => {}');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMessage,
          context: ''
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Add AI response
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`chatbot-container ${isFullPage ? 'fullpage' : ''}`}>
      {!isFullPage && (
        <div className="chatbot-header">
          <div className="chatbot-header-title">
            <FaRobot className="chatbot-icon" />
            <span>AI Coding Assistant</span>
          </div>
          <button className="chatbot-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
      )}

      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chatbot-message ${msg.role}`}>
            <div className="message-icon">
              {msg.role === 'user' ? <FaUser /> : <FaRobot />}
            </div>
            <div className="message-content">
              {msg.role === 'assistant' ? (
                <ReactMarkdown 
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    code({node, inline, className, children, ...props}) {
                      return inline ? (
                        <code className="inline-code" {...props}>
                          {children}
                        </code>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="chatbot-message assistant">
            <div className="message-icon">
              <FaRobot />
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input-container">
        <textarea
          className="chatbot-input"
          placeholder="Ask me anything about coding..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          rows="1"
          disabled={isLoading}
        />
        <button 
          className="chatbot-send-btn" 
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
