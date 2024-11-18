import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import React from 'react';
import Dashboard from './Components/Dashboard';
import Login from './Components/Login';
import Signup from './Components/Signup';

function App() {
  return (
    <Router>
 <Routes>
   <Route path="/" element={<Login />} />
   <Route path="/Dashboard" element={<Dashboard />} />
   <Route path="/Signup" element={<Signup />} />

   
   </Routes>
   </Router>
  );
}

export default App;
