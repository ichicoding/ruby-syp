// src/App.js

import React from 'react';
import './App.css'; // 
import ProductSelector from './ProductSelector';  // Import the ProductSelector component

function App() {
  return (
    <div className="App">
      <h1>Select a Product and a Destination</h1>
      {/* Render the ProductSelector component within the App component */}
      <ProductSelector />
    </div>
  );
}

export default App;
