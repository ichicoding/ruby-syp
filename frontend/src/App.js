// src/App.js

import React from 'react';
import './App.css'; 
import ProductSelector from './ProductSelector';  // Import the ProductSelector component

function App() {
  return (
    <div className="App">
      {/* App Title */}
      <h1 className="app-title">SYP Search</h1>
      
      {/* Instructions */}
      <p>Select a Product and a Destination</p>
      
      {/* Render the ProductSelector component */}
      <ProductSelector />
    </div>
  );
}

export default App;
