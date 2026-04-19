import { useState, useEffect } from 'react';
import { FaCode, FaPlus, FaSearch, FaEdit, FaTrash, FaCopy, FaCheck, FaTimes, FaTag } from 'react-icons/fa';
import API_BASE_URL from '../config';
import './Snippets.css';

function Snippets({ onInsertSnippet }) {
  const [snippets, setSnippets] = useState([]);
  const [filteredSnippets, setFilteredSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [counts, setCounts] = useState({});
  
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    language: 'python',
    description: '',
    tags: ''
  });

  const languages = [
    { id: 'all', name: 'All Languages' },
    { id: 'python', name: 'Python' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'typescript', name: 'TypeScript' },
    { id: 'java', name: 'Java' },
    { id: 'c', name: 'C' },
    { id: 'cpp', name: 'C++' }
  ];

  useEffect(() => {
    fetchSnippets();
  }, []);

  useEffect(() => {
    filterSnippets();
  }, [searchTerm, selectedLanguage, snippets, filterSnippets]);

  const fetchSnippets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/snippets`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setSnippets(data.snippets);
      setFilteredSnippets(data.snippets);
      setTags(data.tags || []);
      setCounts(data.counts || {});
    } catch (error) {
      console.error('Error fetching snippets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSnippets = () => {
    let filtered = [...snippets];

    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(s => s.language === selectedLanguage);
    }

    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredSnippets(filtered);
  };

  const handleSaveSnippet = async () => {
    try {
      const token = localStorage.getItem('token');
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);
      
      const url = editingSnippet
        ? `${API_BASE_URL}/snippets/${editingSnippet.id}`
        : `${API_BASE_URL}/snippets`;
      
      const method = editingSnippet ? 'PUT' : 'POST';
      
      const params = new URLSearchParams({
        title: formData.title,
        code: formData.code,
        language: formData.language,
        description: formData.description,
        tags: JSON.stringify(tagsArray)
      });

      await fetch(`${url}?${params}`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setShowModal(false);
      setEditingSnippet(null);
      setFormData({ title: '', code: '', language: 'python', description: '', tags: '' });
      fetchSnippets();
    } catch (error) {
      console.error('Error saving snippet:', error);
    }
  };

  const handleEditSnippet = (snippet) => {
    setEditingSnippet(snippet);
    setFormData({
      title: snippet.title,
      code: snippet.code,
      language: snippet.language,
      description: snippet.description,
      tags: snippet.tags.join(', ')
    });
    setShowModal(true);
  };

  const handleDeleteSnippet = async (snippetId) => {
    if (!window.confirm('Are you sure you want to delete this snippet?')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/snippets/${snippetId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchSnippets();
    } catch (error) {
      console.error('Error deleting snippet:', error);
    }
  };

  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInsert = (code) => {
    if (onInsertSnippet) {
      onInsertSnippet(code);
    }
  };

  if (loading) {
    return <div className="snippets-loading">Loading snippets...</div>;
  }

  return (
    <div className="snippets-container">
      <div className="snippets-header">
        <div>
          <h2>Code Snippets Library</h2>
          <p>Save and reuse your favorite code snippets</p>
        </div>
        <button className="btn-new-snippet" onClick={() => setShowModal(true)}>
          <FaPlus /> New Snippet
        </button>
      </div>

      <div className="snippets-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search snippets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <select
          className="language-filter"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          {languages.map(lang => (
            <option key={lang.id} value={lang.id}>
              {lang.name} {counts[lang.id] ? `(${counts[lang.id]})` : ''}
            </option>
          ))}
        </select>
      </div>

      {filteredSnippets.length === 0 ? (
        <div className="no-snippets">
          <FaCode className="no-snippets-icon" />
          <h3>{snippets.length === 0 ? 'No Snippets Yet' : 'No Results Found'}</h3>
          <p>{snippets.length === 0 ? 'Create your first snippet to get started' : 'Try adjusting your search or filter'}</p>
        </div>
      ) : (
        <div className="snippets-grid">
          {filteredSnippets.map((snippet) => (
            <div key={snippet.id} className="snippet-card">
              <div className="snippet-card-header">
                <div className="snippet-title-row">
                  <h3>{snippet.title}</h3>
                  <span className={`language-badge language-${snippet.language}`}>
                    {snippet.language}
                  </span>
                </div>
                <div className="snippet-actions">
                  <button
                    className="action-btn"
                    onClick={() => handleCopyCode(snippet.code, snippet.id)}
                    title="Copy code"
                  >
                    {copiedId === snippet.id ? <FaCheck /> : <FaCopy />}
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => handleEditSnippet(snippet)}
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDeleteSnippet(snippet.id)}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {snippet.description && (
                <p className="snippet-description">{snippet.description}</p>
              )}

              <pre className="snippet-code">{snippet.code}</pre>

              {snippet.tags.length > 0 && (
                <div className="snippet-tags">
                  {snippet.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      <FaTag /> {tag}
                    </span>
                  ))}
                </div>
              )}

              {onInsertSnippet && (
                <button
                  className="btn-insert"
                  onClick={() => handleInsert(snippet.code)}
                >
                  Insert into Editor
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content snippet-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingSnippet ? 'Edit Snippet' : 'New Snippet'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Quick Sort Algorithm"
                />
              </div>

              <div className="form-group">
                <label>Language *</label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                >
                  {languages.filter(l => l.id !== 'all').map(lang => (
                    <option key={lang.id} value={lang.id}>{lang.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of what this snippet does"
                  rows={2}
                />
              </div>

              <div className="form-group">
                <label>Code *</label>
                <textarea
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Paste your code here..."
                  rows={10}
                  className="code-textarea"
                />
              </div>

              <div className="form-group">
                <label>Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g., algorithm, sorting, array"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleSaveSnippet}
                disabled={!formData.title || !formData.code}
              >
                {editingSnippet ? 'Update' : 'Save'} Snippet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Snippets;
