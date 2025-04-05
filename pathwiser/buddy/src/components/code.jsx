import { useState, useEffect } from 'react';
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios';
import './code.css';

// Add C++ syntax highlighting
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
      
      // Handle JSON response properly
      if (response.data && response.data.status) {
        setReview(response.data);
      } else {
        setReview({
          status: 'error',
          message: 'Unexpected response format from server'
        });
      }
    } catch (error) {
      setReview({
        status: 'error',
        message: error.response?.data?.error || 'Failed to get review'
      });
    } finally {
      setIsLoading(false);
    }
  }

  const renderReviewContent = () => {
    if (!review) return null;

    switch (review.status) {
      case 'correct':
        return (
          <div className="correct-message">
            ✅ {review.message}
          </div>
        );

      case 'needs_fix':
        return (
          <div className="review-content">
            <div className="issues-section">
              <h3>Identified Issues:</h3>
              <ul>
                {review.issues?.map((issue, index) => (
                  <li key={index} className={`issue ${issue.severity}`}>
                    <strong>{issue.type.toUpperCase()}</strong>: {issue.description}
                    {issue.line && ` (Line: ${issue.line})`}
                  </li>
                ))}
              </ul>
            </div>

            {review.corrected_code && (
              <div className="corrected-code">
                <h3>Suggested Fix:</h3>
                <pre>
                  <code className="language-cpp">
                    {review.corrected_code}
                  </code>
                </pre>
              </div>
            )}

            {review.explanation && (
              <div className="explanation">
                <h3>Explanation:</h3>
                <Markdown rehypePlugins={[rehypeHighlight]}>
                  {review.explanation}
                </Markdown>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="error-message">
            ❌ {review.message || 'Unknown error occurred'}
          </div>
        );
    }
  };

  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.cpp, "cpp")}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%"
              }}
            />
          </div>
          <button
            onClick={reviewCode}
            className="review-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading">
                <div className="spinner"></div>
                Analyzing...
              </div>
            ) : 'Get Code Review'}
          </button>
        </div>
        <div className="right">
          {renderReviewContent()}
        </div>
      </main>
    </>
  );
}

export default Code;