import React, { useState } from 'react';
import './Exam.css';
import Navbar from './Navbar';

const StudyPlanner = () => {
  const [file, setFile] = useState(null);
  const [examDate, setExamDate] = useState('');
  const [studyPlan, setStudyPlan] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processingTime, setProcessingTime] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setStudyPlan(null);

    if (!file) {
      setError('Please select a PDF file');
      return;
    }
    if (!examDate) {
      setError('Please select an exam date');
      return;
    }

    const startTime = performance.now();
    setIsLoading(true);
    console.log('Starting upload process...', {
      fileName: file.name,
      fileSize: file.size,
      examDate
    });

    try {
      const formData = new FormData();
      formData.append('syllabus', file);
      formData.append('examDate', examDate);

      console.log('Sending to backend...');
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });

      const endTime = performance.now();
      const duration = (endTime - startTime) / 1000;
      setProcessingTime(duration);
      console.log(`Request completed in ${duration.toFixed(2)} seconds`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend error:', errorData);
        throw new Error(errorData.error || 'Failed to generate plan');
      }

      const data = await response.json();
      console.log('Backend response:', data);

      // Validate response structure
      const validatedPlan = {
        summary: data.summary || "Your study plan",
        topics: Array.isArray(data.topics) ? data.topics : [],
        schedule: Array.isArray(data.schedule) ? data.schedule : [],
        daysRemaining: data.daysRemaining || 0,
      };

      setStudyPlan(validatedPlan);
      console.log('Study plan validated:', validatedPlan);

    } catch (err) {
      console.error('Error during processing:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="study-planner">
      <div className="stud-over">
        <h1>📚 AI Study Planner</h1>

        <div className="plan">
          <form onSubmit={handleSubmit} className="planner-form">
            <div className="file-upload-wrapper">
              <input
                id="file-upload"
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  console.log('File selected:', e.target.files[0]);
                  setFile(e.target.files[0]);
                }}
                disabled={isLoading}
                className="hidden-input"
              />
              <h2 style={{color:"#2980b9"}}>Upload your PDF</h2>
              <label htmlFor="file-upload" className="custom-file-upload">
                
                <span className="file-icon">📄</span>
                <span className="file-text">
                  {file ? (
                    <>
                      <span className="file-name">{file.name}</span>
                      <span className="file-change">(Click to change)</span>
                    </>
                  ) : (
                    'Add your PDF here'
                  )}
                </span>
              </label>
            </div>


            <div className="form-group">
              <label htmlFor="exam-date"><h2>Exam Date:</h2></label>
              <input
                id="exam-date"
                type="date"
                value={examDate}
                onChange={(e) => {
                  console.log('Exam date selected:', e.target.value);
                  setExamDate(e.target.value);
                }}
                min={new Date().toISOString().split('T')[0]}
                disabled={isLoading}
              />
            </div>

            <button
              id='gen'
              type="submit"
              disabled={isLoading}
              className={isLoading ? 'loading' : ''}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Generating...
                </>
              ) : (
                'Generate Study Plan'
              )}
            </button>
          </form>

        </div>
        {error && (
          <div className="error-message">
            ⚠️ Error: {error}
          </div>
        )}

        {processingTime > 0 && (
          <div className="processing-info">
            Processed in {processingTime.toFixed(2)} seconds
          </div>
        )}

        {studyPlan && (
          <div className="study-plan">
            {/* Header remains same */}

            {/* Topics Section */}
            {studyPlan.topics.length > 0 ? (
              <div className="topics-section">
                <h3>📌 Key Topics</h3>
                <div className="topics-grid">
                  {studyPlan.topics.map((topic, index) => (
                    <div key={index} className="topic-card">
                      <span className={`priority-dot ${(topic.priority || 'medium').toLowerCase()}`}></span>
                      <div className="topic-details">
                        <h4>{topic.name || "Important Topic"}</h4>
                        <div className="topic-meta">
                          <span>⏳ {topic.hours || 2} hours</span>
                          <span>📝 {topic.subtopics?.length || 0} subtopics</span>
                        </div>
                        {topic.subtopics?.length > 0 && (
                          <ul className="subtopics-list">
                            {topic.subtopics.map((sub, i) => (
                              <li key={i}>• {sub}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="empty-state">No topics identified</div>
            )}

            {/* Schedule Section */}
            {studyPlan.schedule.length > 0 ? (
              <div className="schedule-section">
                <h3>📅 Study Schedule</h3>
                <div className="schedule-grid">
                  {studyPlan.schedule.map((day) => (
                    <div key={day.day} className="day-card">
                      <div className="day-header">
                        <h4>Day {day.day}</h4>
                        <div className="day-meta">
                          <span>⏱️ {day.totalHours || 0}h</span>
                          <span>📚 {day.topics?.length || 0} topics</span>
                        </div>
                      </div>
                      {day.activities?.length > 0 && (
                        <ul className="activities-list">
                          {day.activities.map((activity, i) => (
                            <li key={i}>✔️ {activity}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="empty-state">Schedule not generated</div>
            )}
          </div>
        )}
      </div>
    </div></>
  );
};

export default StudyPlanner;