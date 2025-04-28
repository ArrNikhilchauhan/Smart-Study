import { useState, useEffect } from 'react';
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios';
import './code.css';

prism.languages.cpp = prism.languages.extend('clike', {
  'keyword': /\b(alignas|alignof|asm|auto|bool|break|case|catch|char|char8_t|char16_t|char32_t|class|concept|const|consteval|constexpr|constinit|const_cast|continue|co_await|co_return|co_yield|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|false|float|for|friend|goto|if|inline|int|long|mutable|namespace|new|noexcept|nullptr|operator|private|protected|public|register|reinterpret_cast|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|true|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/
});

function Code() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState(` 
#include <iostream>
#include <vector>
using namespace std;

int linearSearch(const vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); ++i) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}

int main() {
    vector<int> arr = {10, 20, 30, 40, 50};
    int target = 30;
    int result = linearSearch(arr, target);

    if (result != -1) {
        cout << "Element found at index: " << result << endl;
    } else {
        cout << "Element not found." << endl;
    }
    return 0;
}`);
  const [review, setReview] = useState(null);

  useEffect(() => {
    prism.highlightAll();
  }, [review]);

  async function reviewCode() {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/ai/get-review', { code });
      
      // Handle response structure properly
      const result = {
        status: response.data?.status || 'error',
        summary: response.data?.summary || 'No summary provided',
        explanation: response.data?.explanation || '',
        issues: response.data?.issues || [],
        corrected_code: response.data?.corrected_code || ''
      };

      console.log(response.data);
      setReview(result);
    } catch (error) {
      setReview({
        status: 'error',
        summary: 'Analysis failed',
        explanation: error.response?.data?.details || error.message,
        issues: [],
        corrected_code: ''
      });
    } finally {
      setIsLoading(false);
    }
  }

  const renderReviewContent = () => {
    if (!review) return null;

    // Extract corrected code from issues
    const correctedCode = review.issues
      .filter(issue => issue.corrected_code)
      .map(issue => issue.corrected_code)
      .join('\n');

    return (
      <div className={`review-container ${review.status}`}>
        <div className="status-header">
          <div className="status-icon">
            {review.status === 'correct' ? '✅' : '⚠️'}
          </div>
          <h3>{review.summary}</h3>
        </div>

        {review.status === 'needs_fix' && (
          <>
            {review.issues?.length > 0 && (
              <div className="issues-section">
                <h4>Identified Issues:</h4>
                <ul>
                  {review.issues.map((issue, index) => (
                    <li key={index} className={`issue ${issue.severity}`}>
                      <span className="issue-type">{issue.type}</span>
                      <span className="issue-description">{issue.description}</span>
                      <span className="severity">{issue.severity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {correctedCode && (
          <div className="corrected-code-section">
            <h4>Corrected Code:</h4>
            <Editor
              value={correctedCode}
              onValueChange={() => {}} // Read-only, no changes allowed
              highlight={code => prism.highlight(code, prism.languages.cpp, "cpp")}
              padding={15}
              className="code-editor"
              style={{
                fontFamily: '"Fira Code", monospace',
                fontSize: '14px',
                minHeight: '100px',
                backgroundColor: '#2d2d2d',
                color: '#ffffff'
              }}
              readOnly={true}
            />
          </div>
        )}

        {review.explanation && (
          <div className="explanation">
            <h4>Explanation:</h4>
            <Markdown rehypePlugins={[rehypeHighlight]}>
              {review.explanation}
            </Markdown>
          </div>
        )}

        {review.status === 'error' && (
          <div className="error-details">
            {review.explanation}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="code-review-app">
      <div className="editor-pane">
        <div className="editor-header">
          <h2>C++ Code Editor</h2>
          <button
            onClick={reviewCode}
            disabled={isLoading}
            className={isLoading ? 'loading' : ''}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Analyzing...
              </>
            ) : 'Get Code Review'}
          </button>
        </div>
        
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={code => prism.highlight(code, prism.languages.cpp, "cpp")}
          padding={15}
          className="code-editor"
          style={{
            fontFamily: '"Fira Code", monospace',
            fontSize: '14px',
            minHeight: '400px'
          }}
        />
      </div>

      <div className="review-pane">
        <h2 className="review-title">Code Analysis</h2>
        {renderReviewContent()}
      </div>
    </div>
  );
}

export default Code;