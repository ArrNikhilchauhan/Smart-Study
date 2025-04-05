import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import "./RoadmapDropdown.css";
const RoadmapDropdown = ({ onSelectRoadmap, selectedRoadmap }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownBtnRef = useRef(null);
  const itemsRef = useRef([]);
  const animation = useRef(null);

  const roadmaps = {
    cybersecurity: "Cybersecurity Roadmap",
    fullstack: "Full-Stack Development Roadmap",
    datascience: "📊 Data Science",
    cloud: "☁️ Cloud Engineering",
    devops: "🔄 DevOps",
    blockchain: "⛓️ Blockchain",
    mobile: "📱 Mobile Dev"
  
  };

  // GSAP Animation Setup
  useEffect(() => {
    const dropdown = dropdownRef.current;
    const items = itemsRef.current;
    
    // Clear existing animations
    gsap.killTweensOf([dropdown, items]);
    
    // Set initial state
    gsap.set(dropdown, {
      opacity: 0,
      y: -20,
      scaleY: 0.9,
      display: "none"
    });
    
    gsap.set(items, {
      opacity: 0,
      y: -10
    });

    // Create master timeline
    animation.current = gsap.timeline({ paused: true })
      .to(dropdown, {
        opacity: 1,
        y: 0,
        scaleY: 1,
        display: "block",
        duration: 0.3,
        ease: "power3.out"
      })
      .to(items, {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        ease: "power2.out",
        duration: 0.2
      }, "-=0.2");

    return () => {
      gsap.killTweensOf([dropdown, items]);
    };
  }, []);

  // Toggle animation
  useEffect(() => {
    if (!animation.current) return;
    
    if (isOpen) {
      animation.current.play();
    } else {
      animation.current.reverse();
    }
  }, [isOpen]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          dropdownBtnRef.current && !dropdownBtnRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dropdown-container">
        
      <button
        ref={dropdownBtnRef}
        className={`dropdown-btn ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="dropdown-btn-text">
          {selectedRoadmap ? roadmaps[selectedRoadmap] : "Select Roadmap"}
        </span>
        <span className="dropdown-arrow">
          <svg width="12" height="8" viewBox="0 0 12 8">
            <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" />
          </svg>
        </span>
      </button>

      <div
        ref={dropdownRef}
        className="dropdown-menu"
        style={{ opacity: 0 }}
      >
        {Object.entries(roadmaps).map(([key, value], index) => (
          <button
            key={key}
            ref={el => itemsRef.current[index] = el}
            className={`dropdown-item ${selectedRoadmap === key ? "selected" : ""}`}
            onClick={() => {
              onSelectRoadmap(key);
              setIsOpen(false);
            }}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoadmapDropdown;