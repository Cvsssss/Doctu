import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/style.css'; // Asegura que los estilos carguen desde el principio

// Aquí React busca el ancla que pusimos en el index.html
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);