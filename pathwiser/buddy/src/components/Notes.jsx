import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import mermaid from 'mermaid';
import './Notes.css';

// Initialize Mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  securityLevel: 'loose',
  flowchart: { 
    curve: 'basis',
    htmlLabels: true
  }
});

function NotesSummarizer() {
  const [studyNotes, setStudyNotes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mermaidContainers = useRef(new Map());

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles[0]) await handleFileUpload(acceptedFiles[0]);
    }
  });

  // Mermaid rendering effect
  useEffect(() => {
    const renderDiagrams = async () => {
      try {
        await mermaid.run({
          querySelector: '.mermaid-diagram',
          suppressErrors: true,
        });
      } catch (err) {
        console.error('Mermaid rendering error:', err);
      }
    };
  
    if (studyNotes) {
      renderDiagrams();
    }
  }, [studyNotes]);

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('material', file);

    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(
        'http://localhost:3000/upload/summarize',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setStudyNotes(response.data);
    } catch (err) {
      if (err.response?.data?.error?.includes('RECITATION')) {
        setError('Our AI detected potential copyrighted content. Please upload original materials and avoid direct textbook excerpts.');
      } else {
        setError(err.response?.data?.message || 'Failed to process PDF');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderFlowchart = (steps, index) => {
    const diagramId = `mermaid-${index}-${Date.now()}`;
    const mermaidCode = `%%{init: {'theme': 'neutral'} }%%\nflowchart TD\n${steps.join('\n')}`;
  
    return (
      <div key={diagramId} className="mermaid-container">
        <pre className="mermaid-source" style={{ display: 'none' }}>
          {mermaidCode}
        </pre>
        <div className="mermaid-diagram" data-id={diagramId}>
          {mermaidCode}
        </div>
      </div>
    );
  };
  
  return (
    <div className="notes-summarizer-container">

<div className="disclaimer">
      Note: This tool generates original study materials. Avoid uploading 
      copyrighted textbook content directly.
    </div>
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        <p className="dropzone-text">
          {isDragActive ? 'Drop the PDF here' : 'Drag & drop a PDF file here, or click to select'}
        </p>
      </div>

      {loading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p className="loading-text">Processing your PDF...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      {studyNotes && (
        <div className="notes-container">
          <div className="summary-section">
            <h2 className="section-title">Document Summary</h2>
            <p className="summary-text">{studyNotes.summary}</p>
          </div>

          <div className="detailed-notes">
            <h2 className="section-title">Detailed Notes</h2>
            {studyNotes.notes.map((note, index) => (
              <div key={index} className="note-card">
                <h3 className="note-title">{note.topic}</h3>
                <div className="note-content">
                  <h4 className="subsection-title">Key Points:</h4>
                  <ul className="key-points">
                    {note.key_points.map((point, i) => (
                      <li key={i} className="point-item">{point}</li>
                    ))}
                  </ul>
                  <h4 className="subsection-title">Flowchart:</h4>
                  {renderFlowchart(note.flowchart.steps, index)}
                  <p className="flowchart-description">{note.flowchart.description}</p>
                </div>
              </div>
            ))}
          </div>

          {studyNotes.study_tips && (
            <div className="study-tips">
              <h2 className="section-title">Study Tips</h2>
              <ul className="tips-list">
                {studyNotes.study_tips.map((tip, index) => (
                  <li key={index} className="tip-item">{tip}</li>
                ))}
              </ul>
            </div>
          )}
          
        </div>
        
      )}
          {studyNotes?.notes?.map((note, index) => (
        <div key={index} className="note-card">
          {/* Other note content */}
          {renderFlowchart(note.flowchart.steps, index)}
        </div>
      ))}
    </div>
  );
}

export default NotesSummarizer;