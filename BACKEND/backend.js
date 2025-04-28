import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { readFileSync, unlinkSync } from 'fs';
import canvas from 'canvas'; // Changed import style
import { GoogleGenerativeAI } from '@google/generative-ai';
import pdfjsLib from 'pdfjs-dist';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import {generateContent} from './ai.service.js' // Adjust path
// import jwt from 'jsonwebtoken'
// import bodyParser from 'body-parser';
// import fetch from 'node-fetch'
// import bcrypt from 'bcrypt'

const app = express();
app.use(express.json());
app.use(cors());
// app.use(bodyParser.json());

const { createCanvas } = canvas;
const __dirname = dirname(fileURLToPath(import.meta.url));



global.DOMMatrix = createCanvas(1, 1).DOMMatrix;
global.ImageData = canvas.ImageData;
global.Path2D = canvas.Path2D;
const upload = multer({ dest: 'uploads/' });
const genAI = new GoogleGenerativeAI('your API key here');

// Set the worker path using import.meta.resolve (Node.js 20+)
pdfjsLib.GlobalWorkerOptions.workerSrc = resolve(__dirname, 'node_modules/pdfjs-dist/build/pdf.worker.js');
// Then modify your route to remove express.json() from individual route
app.post('/ai/get-review', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ 
        status: 'error',
        summary: 'Invalid input',
        explanation: 'No code provided'
      });
    }

    const review = await generateContent(code);
    res.json(review);

  } catch (error) {
    res.status(500).json({
      status: 'error',
      summary: 'Server error',
      explanation: error.message
    });
  }
});




async function extractTextFromPDF(path) {
  const data = new Uint8Array(readFileSync(path));
  const pdf = await pdfjsLib.getDocument({
    data,
    verbosity: 0
  }).promise;

  let textContent = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    textContent += content.items.map(item => item.str).join(' ');
  }
  return textContent;
}

function formatStudyPlan(text, daysRemaining) {
  return {
    summary: "Study plan generated for your syllabus and this",
    topics: [], // Will be populated
    schedule: [], // Will be populated
    daysRemaining,
    status: "success"
  };
}

app.post('/upload', upload.single('syllabus'), async (req, res) => {
  try {
    const text = await extractTextFromPDF(req.file.path);
    const examDate = new Date(req.body.examDate);
    const daysRemaining = Math.ceil((examDate - new Date()) / (86400000));

    // Strict prompt with JSON example
    const prompt = `
    Analyze this syllabus and create a study plan with EXACTLY this JSON format:
    {
      "summary": "Brief overview",
      "topics": [
        {
          "name": "Topic name",
          "priority": "High",
          "hours": 4,
          "subtopics": ["Subtopic 1", "Subtopic 2"] and more if there are any
        }
      ],
      "schedule": [
        {
          "day": 1,
          "topics": ["Topic name"],
          "totalHours": 4,
          "activities": ["Study subtopic 1", "Practice problems"]
        }
      ]
    }
    
    Syllabus content (${daysRemaining} days until exam):
    ${text.substring(0, 25000)}
    
    Respond ONLY with valid JSON. Do not include any other text.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Clean and parse response
    let cleanResponse = response.text()
      .replace(/```json|```/g, '')
      .trim();

    console.log('Raw Gemini response:', cleanResponse); // Debug

    let studyPlan;
    try {
      studyPlan = JSON.parse(cleanResponse);
    } catch (error) {
      console.error('JSON parse error:', error);
      studyPlan = {
        summary: "Generated study plan",
        topics: [],
        schedule: []
      };
    }

    // Validate structure
    if (!Array.isArray(studyPlan.topics)) studyPlan.topics = [];
    if (!Array.isArray(studyPlan.schedule)) studyPlan.schedule = [];
    
    // Add days remaining
    studyPlan.daysRemaining = daysRemaining;

    res.json(studyPlan);
    unlinkSync(req.file.path);

  } catch (error) {
    console.error('Final error:', error);
    res.status(500).json({
      summary: "Error generating plan",
      topics: [],
      schedule: [],
      error: error.message
    });
  }
});



app.post('/upload/summarize', upload.single('material'), async (req, res) => {
  try {
    const text = await extractTextFromPDF(req.file.path);

    const summarizePrompt = `
    Analyze this educational content and create study notes with PROPERLY FORMATTED Mermaid flowcharts.
    Follow these STRICT rules for flowcharts:
    1. Use simple, clear node labels
    2. Only use --> for connections
    3. No special characters in node names
    4. Use exactly this syntax: [Node Label] --> [Next Node Label]
    5. Start with 'flowchart TD' directive
    
    Format response as JSON:
    {
      "summary": "Summary...",
      "notes": [
        {
          "topic": "Topic Name",
          "key_points": [],
          "flowchart": {
            "description": "Chart description",
            "steps": [
              "Start --> Process",
              "Process --> Decision",
              "Decision -->|Yes| End"
            ]
          }
        }
      ],
      "study_tips": []
    }
    
    Content to process:
    ${text.substring(0, 25000)}
    
    Respond ONLY with valid JSON containing PROPER Mermaid syntax.
    `;

    function validateMermaidSteps(steps) {
      return steps.filter(step => {
        const isValid = /^[a-zA-Z0-9\s]+(-|>|.)+[a-zA-Z0-9\s]+$/.test(step);
        if (!isValid) console.warn('Invalid Mermaid step removed:', step);
        return isValid;
      });
    }

    // studyNotes.notes.forEach(note => {
    //   note.flowchart.steps = validateMermaidSteps(note.flowchart.steps);
    // });
    const generationConfig = {
      temperature: 0.9,  // More creative output
      topK: 40,
      topP: 0.95,
    };


    const safetySettings = [
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_ONLY_HIGH"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_ONLY_HIGH"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_ONLY_HIGH"
      },
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_ONLY_HIGH"
      }
    ];

    const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash",
  generationConfig,
  safetySettings,
});
    const result = await model.generateContent(summarizePrompt);
    const response = await result.response;
    
    let cleanResponse = response.text().replace(/```json|```/g, '').trim();
    let studyNotes = JSON.parse(cleanResponse);
    
    // Add summary specific metadata
    studyNotes.generatedAt = new Date().toISOString();
    studyNotes.originalLength = text.length;
    studyNotes.processedLength = text.substring(0, 25000).length;
    
    res.json(studyNotes);
    unlinkSync(req.file.path);

  } catch (error) {
    console.error('Summarization Error:', error);
    res.status(500).json({
      error: "Processing failed",
      message: error.message
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));