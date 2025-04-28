import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('API key here');
const MODEL_NAME = 'gemini-2.0-flash';

export async function generateContent(code) {
  // Define prompt template INSIDE the function after receiving code
  const prompt = `
 You are an expert code reviewer with 7+ years of professional experience in reviewing JavaScript, Python, and modern web development codebases. Your job is to analyze the provided code for correctness, performance, best practices, security, and logical accuracy.

ANALYSIS REQUEST
================
Analyze the given code carefully and respond ONLY with a valid JSON object:

CODE:
${code}

RESPONSE FORMAT:
{
  "status": "correct" | "needs_fix",
  "summary": "Brief summary of the code’s quality",
  "explanation": "Detailed explanation of why the code is correct or what needs to be fixed",
  "issues": [
    {
      "type": "syntax" | "logic" | "security" | "performance" | "style",
      "description": "Description of the issue found",
      "severity": "low" | "medium" | "high",
      "corrected_code": "Fully corrected version of the original code"
    }
  ],
  "suggested_fix": "Fully corrected version of the original code"
}

RULES:
1. Do NOT use markdown, code blocks, bullet points, or comments.
2. Escape all special characters properly (e.g., use \\n for newlines, \\\" for quotes).
3. Include all fields in the JSON even if they are empty.
4. If no issues are found, set status to "correct", leave issues as an empty array [], and set suggested_fix identical to the original code.
5. For each issue in the issues array, provide a corrected_code snippet that specifically addresses the described issue. This should be a minimal code fragment focused on fixing that issue.
6. The suggested_fix field must contain the fully corrected version of the original code, incorporating fixes for all issues identified.
7. Make the explanation thorough and insightful—cover why something is wrong, what impact it may cause, and how the fix resolves it.
8. If there are multiple issues, include all of them in the issues list with their respective corrected_code snippets.

EXAMPLES:

Input:
\\\`js
function greet(name) {
  console.log("Hello " + name);
}
\\\`

Output:
{"status":"correct","summary":"No issues found","explanation":"The code is clean, performs as expected, and follows basic best practices.","issues":[],"suggested_fix":"function greet(name) {\\n  console.log(\\\"Hello \\\" + name);\\n}"}

---

Input:
\\\`js
function getData() {
  let data = fetch('/api/data').then(res => res.json());
  return data;
}
\\\`

Output:
{"status":"needs_fix","summary":"Code returns a pending Promise without handling it properly","explanation":"The fetch call is asynchronous, but the function doesn't use async/await, causing it to return a pending Promise instead of the resolved data. Additionally, there is no error handling for failed HTTP requests, which could lead to uncaught errors.","issues":[{"type":"logic","description":"Function does not await the Promise returned by fetch","severity":"high","corrected_code":"async function getData() {\\n  let data = await fetch(\\\"/api/data\\\").then(res => res.json());\\n  return data;\\n}"},{"type":"security","description":"Missing error handling for failed HTTP requests","severity":"medium","corrected_code":"async function getData() {\\n  try {\\n    let data = await fetch(\\\"/api/data\\\").then(res => res.json());\\n    return data;\\n  } catch (e) {\\n    console.error(\\\"Error:\\\", e);\\n    return null;\\n  }\\n}"}],"suggested_fix":"async function getData() {\\n  try {\\n    const res = await fetch(\\\"/api/data\\\");\\n    if (!res.ok) throw new Error(\\\"Failed to fetch\\\");\\n    return await res.json();\\n  } catch (e) {\\n    console.error(\\\"Error:\\\", e);\\n    return null;\\n  }\\n}"}

`;

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    // Clean response
    responseText = responseText
      .replace(/```json|```/g, '')
      .trim();

    // Parse with multiple fallbacks
    let parsed;
    try {
      parsed = JSON.parse(responseText);
      console.log(responseText)
    } catch {
      // Try extracting JSON from malformed response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
    }

    // Validate structure
    if (!parsed || !parsed.status) {
      throw new Error('Invalid response format');
    }

    return {
      status: parsed.status,
      summary: parsed.summary || 'No summary',
      explanation: parsed.explanation || 'No explanation',
      issues: parsed.issues || []
    };

  } catch (error) {
    console.error('Analysis failed:', error);
    return {
      status: "error",
      summary: "⚠️ Analysis failed",
      explanation: error.message,
      issues: []
    };
  }
}