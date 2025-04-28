import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './CodeReview.css';

const CodeReview = () => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3000/ai/get-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      setResult(data);
      
    } catch (error) {
      setResult({
        status: 'error',
        summary: 'Connection failed',
        explanation: 'Could not reach the server'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="code-review-container">
      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label>Paste Your Code:</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your code here..."
            rows="10"
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Review Code'}
        </button>
      </form>

      {result && (
        <div className={`result-box ${result.status}`}>
          <div className="status-header">
            <div className="status-icon">
              {result.status === 'correct' ? '✅' : '⚠️'}
            </div>
            <h3>{result.summary}</h3>
          </div>

          <div className="explanation">
            <ReactMarkdown>{result.explanation}</ReactMarkdown>
          </div>

          {result.issues?.length > 0 && (
            <div className="issues-list">
              <h4>Identified Issues:</h4>
              {result.issues.map((issue, index) => (
                <div key={index} className={`issue ${issue.severity}`}>
                  <span className="issue-type">{issue.type}</span>
                  <span className="issue-description">{issue.description}</span>
                  <span className="severity-badge">{issue.severity}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CodeReview;