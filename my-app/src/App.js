import React from 'react';
import './App.css';
import ImageContainer from './ImageContainer'; // Import the ImageContainer component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Superimpose Images</h1>
        <ImageContainer /> {/* Render the ImageContainer component */}
      </header>
    </div>
  );
}

export default App;
