import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import React from 'react';
import Dashboard from './Components/Dashboard';
import Login from './Components/Login';
import Signup from './Components/Signup';
import { UserProvider } from './Contexts/UserContext';
import AdminDashboard from './Components/AdminDashboard';
import ProtectedRoute from './Components/ProtectedRoute';
function App() {
  return (
    <UserProvider>
    <Router>
 <Routes>
   <Route path="/" element={<Login />} />
   <Route path="/Signup" element={<Signup />} />
   <Route element={<ProtectedRoute/>}>
   <Route path="/Dashboard" element={<Dashboard />} />
   
   <Route path="/AdminDashboard" element={<AdminDashboard />} />
   </Route>

   

   
   </Routes>
   </Router>
   </UserProvider>
  );
}

export default App;
