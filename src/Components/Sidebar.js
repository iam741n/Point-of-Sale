import React, { useState } from 'react';
import { FaGamepad, FaChartBar, FaUser, FaTrash, FaSignOutAlt } from 'react-icons/fa'; // Using react-icons for icons
import { useUser } from '../Contexts/UserContext'; // Importing the useUser hook
import { useNavigate } from 'react-router-dom'; // For navigation
import '../Styles/Sidebar.css'; // Importing CSS

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to track sidebar open/close

  // Accessing user data from context
  const { userData, logout } = useUser(); // Get user data and logout function from context

  // If user data is available, destructure first and last name
  const userName = userData ? `${userData.FirstName} ${userData.LastName}` : 'Guest'; // Default to 'Guest' if no user data

  // Fixed image URL (no change)
  const userImage = '/user.png';

  const navigate = useNavigate();

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle logout
  const handleLogout = () => {
    logout(); // Call logout from UserContext
    navigate('/'); // Redirect to the login page
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
      <div className="logo" onClick={toggleSidebar}>
        <img src="/menu.png" alt="Virtual Rides" className="logo-img" />
        <h2 style={{ color: 'white' }}>Virtual Rides</h2> {/* Virtual Rides text */}
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

      {/* Logout Button */}
      <div
        className="sidebar-item"
        onClick={handleLogout} // Attach the updated logout handler
        style={{ cursor: 'pointer' }}
      >
        <FaSignOutAlt /> {/* Logout icon */}
        <span>Logout</span>
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
