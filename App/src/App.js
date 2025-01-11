import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar"; // Import Navbar component

const App = () => {
  const isLoggedIn = localStorage.getItem("token"); // Check if token is in localStorage

  return (
    <Router>
      <div className="app">
        {isLoggedIn && <Navbar />} {/* Show Navbar only when logged in */}
        <div className="main-container">
          <div className={`content ${isLoggedIn ? "shifted" : ""}`}>
            <Routes>
              <Route
                path="/"
                element={isLoggedIn ? <Navigate to="/dashboard" /> : <LoginPage />}
              />
              <Route
                path="/dashboard"
                element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />}
              />
              {/* Add more routes as needed */}
              <Route
                path="/add-task"
                element={isLoggedIn ? <div>Add Task Page</div> : <Navigate to="/" />}
              />
              <Route
                path="/activity-log"
                element={
                  isLoggedIn && localStorage.getItem("role") === "admin" ? (
                    <div>Activity Log Page</div>
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route path="*" element={<div>404 - Page Not Found</div>} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;