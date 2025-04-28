import React from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import './Chatbot.css'

const Content = () => {
  // Access the state passed from Home.jsx
  const location = useLocation();
  const { response } = location.state || { response: 'No response received' };
  console.log(response)

  return (
    <div className='chatbot'>
      <h1>Generated Response</h1>
      <ReactMarkdown>
        {response}
      </ReactMarkdown>
    </div>
  );
};

export default Content;
