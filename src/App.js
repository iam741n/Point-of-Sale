import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import React from 'react';
import Dashboard from './Components/Dashboard';
import Login from './Components/Login';
import Signup from './Components/Signup';
import { UserProvider } from './Contexts/UserContext';
import AdminDashboard from './Components/AdminDashboard';
import ProtectedRoute from './Components/ProtectedRoute';
import AddRides from './Components/AddRides';
import ManageRides from './Components/ManageRides';
import TodaySales from './Components/TodaySales';
import UpdateRideSale from './Components/UpdateRideSale';
import CancelBill from './Components/CancelBill';
import MainEditor from './Components/maineditor';
import ExpenseManagement from './Components/ExpenseManagement';

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
   <Route path="/AddRides" element={<AddRides />} />
   <Route path="/ManageRides" element={<ManageRides />} />
   <Route path="/TodaySales" element={<TodaySales />} />
   <Route path="/UpdateRideSale" element={<UpdateRideSale/>} />
   <Route path="/CancelBill" element={<CancelBill/>} />
   <Route path="/me" element={<MainEditor/>} />
   <Route path="/ExpenseManagement" element={<ExpenseManagement/>} />


   

   
   </Routes>
   </Router>
   </UserProvider>
  );
}

export default App;
