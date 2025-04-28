import React, { useState } from 'react';
import RoadmapPage from './pages/RoadmapPage';
import Home from './components/Home';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import DiagramPage from './components/DiagramPage';
import StudyPlanner from './components/Exam'
import NotesSummarizer from './components/Notes'
import './App.css';
import ask from './components/Ask';
import ChatUI from './components/Ask';
import Content from './components/Chatbot';
import Code from './components/code';

import Navbar from './components/Navbar';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/diagram" element={<DiagramPage />} />
        <Route path='/content' element={<Content />} />
        <Route path='/ask' element={<ChatUI />} />
        <Route path='/exam' element={<StudyPlanner/>} />
        <Route path='/code' element={<Code/>} />
        
      </Routes>
    </Router>

    // <Home/>
  );
}


export default App;