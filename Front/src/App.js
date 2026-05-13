import React from 'react';
import './styles/style.css'; // Importante para que el fondo se aplique
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="container mt-5">
        <h1>Los odio</h1>
        <p>This is a test</p>
      </div>
    </div>
  );
}

export default App;