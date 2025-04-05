import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI("AIzaSyB03pejTIoV0MXVKxjZG-mvc43ZA3sTAEw");

const MODEL_NAME = "gemini-2.0-flash";

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
};

const safetySettings = [
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" }
];

const model = genAI.getGenerativeModel({
  model: MODEL_NAME,
  generationConfig,
  safetySettings,
  systemInstruction: `You are an AI code analyzer. Respond ONLY with valid JSON in this EXACT format:
{
  "status": "correct|needs_fix|error",
  "message": "Brief summary",
  "issues": [{
    "type": "syntax|logic|security|performance",
    "description": "Detailed issue",
    "severity": "low|medium|high|critical",
    "line": "optional line reference"
  }],
  "corrected_code": "Improved code (if needed)",
  "explanation": "Technical explanation"
}

RULES:
1. Never add comments, explanations, or markdown
2. Use double quotes for JSON properties
3. Escape all quotes in string values
4. If code is perfect, use:
   {"status":"correct","message":"✅ Code is perfect"}

EXAMPLE RESPONSE FOR ISSUES:
{
  "status": "needs_fix",
  "message": "Potential improvements found",
  "issues": [
    {
      "type": "performance",
      "description": "Linear search has O(n) time complexity",
      "severity": "medium",
      "line": "linearSearch function"
    }
  ],
  "corrected_code": "#include <iostream>\n#include <vector>\n...",
  "explanation": "While functionally correct, consider binary search for better time complexity"
}

NOW ANALYZE THIS CODE:`
});

export async function generateContent(prompt) {
    try {
      const result = await model.generateContent(`${prompt}\n\n${systemInstruction}`);
      const responseText = result.response.text();
      
      // Extract JSON from response
      const jsonMatch = responseText.match(/{(?:[^{}]|{(?:[^{}]|)*})*}/s);
      if (!jsonMatch) throw new Error('No JSON found in response');
      
      const sanitized = jsonMatch[0]
        .replace(/(\w+):/g, '"$1":') // Ensure proper quoting
        .replace(/'/g, '"');         // Replace single quotes
  
      console.log('Sanitized JSON:', sanitized);
      
      const parsed = JSON.parse(sanitized);
      if (!parsed.status) throw new Error('Invalid JSON structure');
      
      return JSON.stringify(parsed);
  
    } catch (error) {
      console.error('AI Service Error:', error.message);
      return JSON.stringify({
        status: "error",
        message: "Analysis failed",
        details: error.message,
        raw_response: responseText // For debugging
      });
    }
  }