import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import React from 'react';
import Dashboard from './Components/Dashboard';

function App() {
  return (
    <Router>
 <Routes>
   <Route path="/" element={<Dashboard />} />
   
   </Routes>
   </Router>
  );
}

export default App;
