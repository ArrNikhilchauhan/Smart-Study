import React, { useState, useRef, useEffect } from "react";
import "./Ask.css"; 
import ReactMarkdown from 'react-markdown';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Navbar from "./Navbar";

// Initialize the Google AI client
const genAI = new GoogleGenerativeAI('AIzaSyB03pejTIoV0MXVKxjZG-mvc43ZA3sTAEw');

const ChatUI = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const chatContainerRef = useRef(null);


  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChat();
    }
  };


  const handleChat = async (e) => {
    e.preventDefault(); // Prevent form from reloading the page

    if (!question) {
      setError('Please enter some text.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Initialize the Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // Send input to Gemini for structured response
      const prompt = `You are an advanced AI that is knowledgeable across all computer-related domains. Your task is to answer any query in the following structured format:

1. *Summary (1-2 sentences)*: Provide a concise and clear summary answering the query directly.
2. *Detailed Explanation*: Offer a more in-depth explanation with a step-by-step breakdown or important context related to the query.
3. *Key Points (bulleted list)*: Provide a bulleted list of the most critical takeaways or concepts.
4. *Code Example (if applicable)*: If relevant, provide any example code or technical illustration formatted with proper syntax.
5. *Further Reading (if applicable)*: Suggest additional resources or references for users who want to explore the topic further.

User Query: ${question}`;

      // Get response from Gemini AI
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();

      // Store the question and response in the chat history
      setChatHistory(prevHistory => [...prevHistory, { question, response: responseText }]);

      // Scroll to the most recent response
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 100); // Wait for the state to update before scrolling

    } catch (err) {
      setError('Failed to generate response. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const chatref=useRef(null);
  const textref=useRef(null);
  const darkref=useRef(null);
  const [isdark,setisdark]=useState(false);



  return (
    <div className="chat-container">
   <Navbar/>
   <div className="background-container">
    <div className="background-overlay"></div>
   </div>
      <div ref={chatContainerRef} className="chat-box">
        <div className="welcome-message">
          <h2>Welcome to Chat AI! 👋</h2>
          <p>Ask me anything, and I'll try my best to help!</p>
        </div>

        {/* Render chat history */}
        {chatHistory.map((message, index) => (
          <div key={index} className="chat-message">
            <strong>Q: </strong>{message.question}
            <ReactMarkdown >{message.response}</ReactMarkdown>
          </div>
        ))}

        {/* Display loading indicator */}
        {loading && <p>Loading...</p>}

        {/* Display error message */}
        {error && <p className="error">{error}</p>}
      </div>

      {/* Input Field */}
      <form className="chat-input" onSubmit={handleChat} ref={chatref}>
        <textarea
        ref={textref}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
           id="ask"
          placeholder="Type your message..."
          rows="2"
        ></textarea>
        <button type="submit" >Send</button>
      </form>
    </div>
  );
};

export default ChatUI;