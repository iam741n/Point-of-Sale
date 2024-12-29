import React, { useState } from 'react';
import { FaGamepad, FaChartBar, FaUser, FaTrash, FaSignOutAlt, FaHome } from 'react-icons/fa';
import { useUser } from '../Contexts/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import '../Styles/Sidebar.css';

function Sidebar() {
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
        <span>Home</span>
      </div>

      <div className="sidebar-item" onClick={() => setSalesDropdownOpen(!isSalesDropdownOpen)}>
  <FaChartBar />
  <span>Sales</span>
  <span className="dropdown-arrow">{isSalesDropdownOpen ? '▲' : '▼'}</span>
</div>
{isSalesDropdownOpen && (
  <div className="dropdown-content">
    <div className="dropdown-item">Daily Sales</div>
    <div className="dropdown-item">Monthly Sales</div>
    <div className="dropdown-item">Yearly Sales</div>
  </div>
)}

<div className="sidebar-item" onClick={() => setRidesDropdownOpen(!isRidesDropdownOpen)}>
  <FaGamepad />
  <span>Rides</span>
  <span className="dropdown-arrow">{isRidesDropdownOpen ? '▲' : '▼'}</span>
</div>
{isRidesDropdownOpen && (
  <div className="dropdown-content">
    <div className="dropdown-item"><Link to="/AddRides">Add Rides</Link></div>
    <div className="dropdown-item"><Link to="/ManageRidess">Manage Rides</Link></div>
    <div className="dropdown-item">Cancelled Rides</div>
  </div>
)}


      <div className="sidebar-item">
        <FaUser />
        <span>Accounts</span>
      </div>
      <div className="sidebar-item">
        <FaTrash />
        <span><Link to='/CancelBill'>Cancellation</Link></span>
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

export default Sidebar;
