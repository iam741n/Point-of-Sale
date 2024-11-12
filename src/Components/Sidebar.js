import React, { useState } from 'react';
import { FaGamepad, FaChartBar, FaUser,FaTrash } from 'react-icons/fa'; // Using react-icons for icons
import '../Styles/Sidebar.css'; // Importing CSS

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to track sidebar open/close

  // Sample dynamic user data (only name changes)
  const [userName, setUserName] = useState('John Doe'); // Default user name

  // Fixed image URL (no change)
  const userImage = '/user.png';

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
      <div className="logo" onClick={toggleSidebar}>
        <img src="/menu.png" alt="Virtual Rides" className="logo-img" />
        <h2>Virtual Rides</h2> {/* Virtual Rides text */}
      </div>

      {/* Sidebar items */}
      <div className="sidebar-item">
        <FaChartBar />
        <span>Sales</span>
      </div>
      <div className="sidebar-item">
        <FaGamepad />
        <span>Game</span>
      </div>
      <div className="sidebar-item">
        <FaUser />
        <span>Accounts</span>
      </div>
      <div className="sidebar-item">
        <FaTrash />
        <span>Cancellation</span>
      </div>

      {/* User Profile at the bottom */}
      <div className="sidebar-item user-profile">
        <img src={userImage} alt="User Profile" className="user-image" />
        <span className="user-name">{userName}</span>
      </div>
    </div>
  );
}

export default Sidebar;
