import React from 'react';
import { Outlet ,Navigate } from 'react-router-dom';
import { useUser } from '../Contexts/UserContext'; 

const ProtectedRoute = () => {
    const { userData } = useUser(); 

    return userData ? <Outlet/> : <Navigate to ={"/"}/>
};

export default ProtectedRoute;
