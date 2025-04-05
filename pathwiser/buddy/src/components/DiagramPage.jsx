import React from 'react';
import MermaidDiagram from './mermaid';
import './Diagram.css'
import Navbar from './Navbar';
import { useNavigate,useLocation } from 'react-router-dom';

const DiagramPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const chart = location.state?.chart || ''; // Get the chart from navigation state

  return (
    <div className="diagram-page">
     <div className="overlay">
     <Navbar />
      <h1 className='vis-text'>Diagram for visualization</h1>
      <div className="diagra">
      <MermaidDiagram chart={chart} />
      </div>
     </div>
    </div>
  );
};

export default DiagramPage;