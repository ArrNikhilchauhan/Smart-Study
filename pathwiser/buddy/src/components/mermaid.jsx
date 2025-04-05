import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import Navbar from './Navbar';
const MermaidDiagram = ({ chart, key }) => {
  const diagramRef = useRef(null);

  useEffect(() => {
    // Initialize Mermaid
    mermaid.initialize({ startOnLoad: true });

    // Render the diagram
    if (diagramRef.current) {
       
      mermaid.contentLoaded();
    }
  }, [chart, key]); // Re-render when chart or key changes

  return (
    <div className="mermaid"  ref={diagramRef}>
      {chart}
    </div>
  );
};

export default MermaidDiagram;