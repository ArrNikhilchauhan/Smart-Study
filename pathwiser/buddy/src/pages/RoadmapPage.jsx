import { useState, useEffect, useRef } from "react";
import { roadmaps } from "../data/roadmaps";
import RoadmapDropdown from "../components/RoadmapDropdown.jsx";
import Navbar from "../components/Navbar.jsx";
import gsap from "gsap";
import "../pages/RoadmapPage.css";

const RoadmapPage = () => {
  const [selectedRoadmapKey, setSelectedRoadmapKey] = useState("cybersecurity");
  const [markedTopics, setMarkedTopics] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState({});
  const topicRefs = useRef([]);
  const animations = useRef({});

  const roadmap = roadmaps[selectedRoadmapKey];

  // Progress calculation
  const totalTopics = roadmap.topics.reduce((acc, topic) => acc + topic.subTopics.length, 0);
  const completedCount = Object.values(markedTopics).flat().length;

  // Load progress
  useEffect(() => {
    try {
      const storedMarks = JSON.parse(localStorage.getItem("roadmapProgress")) || {};
      setMarkedTopics(storedMarks);
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(prefersDark);
    } catch (error) {
      console.error("Error loading progress:", error);
      localStorage.removeItem("roadmapProgress");
    }
  }, []);

  // Save progress
  useEffect(() => {
    localStorage.setItem("roadmapProgress", JSON.stringify(markedTopics));
  }, [markedTopics]);

  // GSAP animation setup for topic toggling
  useEffect(() => {
    roadmap.topics.forEach((topic) => {
      const element = topicRefs.current[topic.id];
      if (!element) return;

      animations.current[topic.id] = gsap.timeline({ paused: true })
        .fromTo(element,
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" }
        );
    });
  }, [roadmap.topics]);

  const handleMarkTopic = (topicId, subIndex) => {
    setMarkedTopics(prev => ({
      ...prev,
      [topicId]: prev[topicId]?.includes(subIndex)
        ? prev[topicId].filter(idx => idx !== subIndex)
        : [...(prev[topicId] || []), subIndex]
    }));
  };

  const toggleTopic = (topicId) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));

    const animation = animations.current[topicId];
    if (animation) {
      expandedTopics[topicId] ? animation.reverse() : animation.play();
    }
  };

  return (
    <div className="roadmap-container">
      <div className="background-container">
        <div className="background-overlay"></div>
      </div>
      <Navbar />
   

      <div className="content-wrapper">
        <div className="header">
          <h1 className="title">📚 {roadmap.title}</h1>
          <div className="progress-indicator">
            <h2>Your Progress: {completedCount}/{totalTopics}
            </h2></div>
          <div className="nav-links">
            <RoadmapDropdown
              onSelectRoadmap={setSelectedRoadmapKey}
              selectedRoadmap={selectedRoadmapKey}
            />
          </div>
        </div>

        <div className="roadmap-table">
          <div className="table-header">
            <div className="status">Status</div>
            <div className="problem">Topics</div>
            
          </div>

          {roadmap.topics.map(topic => (
            <div key={topic.id} className="topic-section">
              <div className="topic-header" onClick={() => toggleTopic(topic.id)}>
                <div className="status">
                  <span className={`arrow ${expandedTopics[topic.id] ? "expanded" : ""}`}>
                    ▼
                  </span>
                </div>
                <div className="problem">{topic.text}</div>
                <div className="resources">
                  <span className="practice">💶G</span>
                  <span className="difficulty">Easy</span>
                </div>
              </div>

              <div ref={el => topicRefs.current[topic.id] = el} className="subtopics-container">
                {topic.subTopics.map((sub, index) => {
                  const isChecked = markedTopics[topic.id]?.includes(index);
                  return (
                    <label key={index} className={`table-row ${isChecked ? 'completed' : ''}`}>
                      <div className="status">
                        <label for="chk" className="checkbox-label" >
                          <input
                            type="checkbox"
                            id={`chk${index}${topic.id}`}
                            checked={isChecked}
                            onChange={() => handleMarkTopic(topic.id, index)}
                            className="visually-hidden"
                          />
                          <label className="checkmark" htmlFor={`chk${index}${topic.id}`}></label>
                        </label>
                      </div>
                      <div className="problem">{sub}</div>
                      <div className="resources">
                        <span className="difficulty">Easy</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;