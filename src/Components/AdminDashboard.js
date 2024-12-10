import React from 'react';
import { useUser } from '../Contexts/UserContext';
import '../Styles/AdminDashboard.css';

function AdminDashboard() {
    const { userData } = useUser();

    return (
        <div className="admin-dashboard">
            <h1>Welcome {userData?.Role}, {userData?.FirstName} {userData?.LastName}</h1>
            <p className="blinking-message">This section is under construction</p>
        </div>
    );
}

export default AdminDashboard;
