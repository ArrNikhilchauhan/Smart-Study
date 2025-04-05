import { gsap } from 'gsap';
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Navbar from './Navbar';
const genAI = new GoogleGenerativeAI('AIzaSyB03pejTIoV0MXVKxjZG-mvc43ZA3sTAEw');

const Home = () => {
  const text = useRef(null);
  const navigate = useNavigate();

  // Text color animation
  // useEffect(() => {
  //   const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
  //   const colors =  [
  //     "#D4F1F9",  // Nebula teal
  //     "#E0D3FF",  // Quantum violet
  //     "#FFDAC1",  // Starlight peach
  //     "#B5EAD7",
  //       // Alien mint
  //     "#FFB7B2",
  //     "#D4F1F9",  // Martian coral
  //   ];
    
  //   colors.forEach(color => {
  //     tl.to(".head-text", {
  //       color,
  //       duration: 4,
  //       ease: "power1.inOut"
  //     });
  //   });
  // }, []);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const handleRender = async () => {
    if (!input) {
      setError('Please enter some text.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const prompt = `Convert the following natural language description into Mermaid syntax: ${input}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const fullResponse = response.text();

      const mermaidCode = extractMermaidCode(fullResponse);
      if (!mermaidCode) {
        throw new Error('No valid Mermaid code found in the response.');
      }

      navigate('/diagram', { state: { chart: mermaidCode } });
    } catch (err) {
      setError('Failed to generate diagram. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const extractMermaidCode = (text) => {
    // Handle different backtick formats and whitespace variations
    const mermaidRegex = /```\s*mermaid\s*\n?([\s\S]*?)```/gi;
    const match = mermaidRegex.exec(text);
    return match ? match[1].trim() : null;
  };

  return (
    <div className="home">
      <Navbar/>
      {/* Background elements */}
      <div className="background-container">
        <div className="background-overlay"></div>
      </div>

      {/* Content */}
      <div className="head-text" ref={text}>
        Empowering Students to Learn Smarter
      </div>

      <div className="chatbox">
        <input
          className="inputbox"
          value={input}
          onChange={handleChange}
          placeholder="Enter a description (e.g., flowchart of AI agents)..."
        />
        {error && <div className="error-message">{error}</div>}
        <button 
          onClick={handleRender} 
          disabled={loading} 
          className="visualize"
        >
          {loading ? 'Generating...' : 'Visualize'}
        </button>
      </div>
    </div>
  );
};

export default Home;