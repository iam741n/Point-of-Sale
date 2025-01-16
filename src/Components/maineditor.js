import React from "react";
import "../Styles/mianeditor.css";

const MainEditor = () => {
  return (
    <div className="maineditor-container">
      {/* Toolbar */}
      <div className="maineditor-toolbar">
        <div className="maineditor-dropdown">
          <button className="maineditor-dropdown-button">File</button>
          <div className="maineditor-dropdown-content">
            <div>New</div>
            <div>Open</div>
            <div>Save</div>
            <div>Export</div>
          </div>
        </div>
        <div className="maineditor-dropdown">
          <button className="maineditor-dropdown-button">Edit</button>
          <div className="maineditor-dropdown-content">
            <div>Undo</div>
            <div>Redo</div>
          </div>
        </div>
        <div className="maineditor-dropdown">
          <button className="maineditor-dropdown-button">View</button>
          <div className="maineditor-dropdown-content">
            <div>Fullscreen</div>
            <div>Reset View</div>
          </div>
        </div>
        <div className="maineditor-dropdown">
          <button className="maineditor-dropdown-button">Add</button>
          <div className="maineditor-dropdown-content">
            <div>Cube</div>
            <div>Sphere</div>
            <div>Light</div>
          </div>
        </div>
        <div className="maineditor-toolbar-right">
          <button className="maineditor-button">Save</button>
          <button className="maineditor-button">Open</button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="maineditor-body">
        {/* Sidebar */}
        <div className="maineditor-sidebar">
          <h3>Scene Graph</h3>
          <ul>
            <li>Object 1</li>
            <li>Object 2</li>
            <li>Object 3</li>
          </ul>
        </div>

        {/* Canvas Area */}
        <div className="maineditor-canvas-container">
          <h3>Canvas Area</h3>
          <p>This is where the Three.js content will render.</p>
        </div>

        {/* Properties Panel */}
        <div className="maineditor-properties">
          <h3>Properties</h3>
          <p>Select an object to view its properties.</p>
        </div>
      </div>

      {/* Footer */}
      <div className="maineditor-footer">
        <p>Application Status: Ready</p>
      </div>
    </div>
  );
};

export default MainEditor;
