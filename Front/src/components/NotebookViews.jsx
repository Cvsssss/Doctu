import React from 'react';
import '../styles/style.css'; 

const NotebookViews = () => {
  return (
    <div className="notebook-page">
      <h1 className="title-dotted">Gitflow</h1>
      
      <p className="note-text">
        Todo se sube a Develop, una vez que sirva, se sube a main
      </p>

      <h2 className="title-dotted">Arquitectura</h2>
      
      <ul className="note-text">
        <li>src/</li>
        <ul>
          <li>assets/ <span className="highlight-dotted">Logos</span></li>
          <li>components/ <span className="highlight-dotted">Botones</span></li>
          <li>context/ <span className="highlight-dotted">Logs</span></li>
          <li>pages/ <span className="highlight-dotted">Vistas</span></li>
          <li>services/ <span className="highlight-dotted">accesos al Back</span></li>
          <li>styles/ <span className="highlight-dotted">CSS global</span></li>
        </ul>
      </ul>
    </div>
  );
};

export default NotebookViews;