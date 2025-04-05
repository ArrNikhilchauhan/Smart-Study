import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const [isSignIn, setIsSignIn] = useState(true); // Toggle between sign-in and sign-up forms
  const [email, setEmail] = useState(""); // Email state
  const [password, setPassword] = useState(""); // Password state
  const [username, setUsername] = useState(""); // Username state (used for Sign Up)
  const navigate = useNavigate();

  // Toggle between sign-in and sign-up forms
  const toggleForm = () => {
    setIsSignIn(!isSignIn);
    setEmail(""); // Reset email
    setPassword(""); // Reset password
    setUsername(""); // Reset username
  };

  // Handle Sign In
  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token); // Store token
        alert("Login successful!");
        navigate("/profile")
        // Redirect or update UI
      } else {
        alert(data.message || "Login failed!");
      }
    } catch (err) {
      console.error("Error during sign-in:", err);
      alert("An error occurred during login.");
    }
  };

  // Handle Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, username }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Signup successful! You can now log in.");
        toggleForm(); // Switch to sign-in form
      } else {
        alert(data.message || "Signup failed!");
      }
    } catch (err) {
      console.error("Error during sign-up:", err);
      alert("An error occurred during signup.");
    }

    
  };

  return (
    <div className="container">
      <div className="background-animation"></div>
      <div className="form-container">
        {isSignIn ? (
          <form className="form" onSubmit={handleSignIn}>
            <h2>Sign In</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn gradient-btn">
              Sign In
            </button>
          </form>
        ) : (
          <form className="form" onSubmit={handleSignUp}>
            <h2>Sign Up</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn gradient-btn">
              Sign Up
            </button>
          </form>
        )}
        <button className="toggle-btn" onClick={toggleForm}>
          {isSignIn ? "Switch to Sign Up" : "Switch to Sign In"}
        </button>
      </div>
    </div>
  );
}

export default Login;
