// src/App.js
import React, { useState } from 'react';
import './App.css'; 
import ProductSelector from './ProductSelector'; 
import Login from './components/Login'; 

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <h1 className="app-title">SYP Search</h1>
          <p>Select a Product and a Destination</p>
          <ProductSelector />
          {/* Logout button */}
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </>
      )}
    </div>
  );
}

export default App;
