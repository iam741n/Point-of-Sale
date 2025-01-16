import React, { useState } from 'react';
import { FaGamepad, FaChartBar, FaUser, FaTrash, FaSignOutAlt, FaHome } from 'react-icons/fa';
import { useUser } from '../Contexts/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import '../Styles/Sidebar.css';

function Sidebar2() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSalesDropdownOpen, setSalesDropdownOpen] = useState(false);
  const [isRidesDropdownOpen, setRidesDropdownOpen] = useState(false);

  const { userData, logout } = useUser();
  const userName = userData ? `${userData.FirstName} ${userData.LastName}` : 'Guest';
  const userImage = '/user.png';
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);





  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
      <div className="logo" onClick={toggleSidebar}>
        <img src="/menu.png" alt="Virtual Rides" className="logo-img" />
        <h2 style={{ color: 'white' }}>Virtual Rides</h2>
      </div>

      <div className="sidebar-item">
        <FaHome />
       <Link to='/Dashboard'> <span>Home</span></Link>
      </div>


      <div
        className="sidebar-item"
        onClick={handleLogout}
        style={{ cursor: 'pointer' }}
      >
        <FaSignOutAlt />
        <span>Logout</span>
      </div>

      <div className="sidebar-item user-profile">
        <img src={userImage} alt="User Profile" className="user-image" />
        <span className="user-name">{userName}</span>
      </div>
    </div>
  );
}

export default Sidebar2;
