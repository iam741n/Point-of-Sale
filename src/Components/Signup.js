import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const Signup = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    PhoneNo: "",
    Username: "",
    Password: "",
    Gender: "Male", // Default gender
    Role: "User", // Default role
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validate password (at least 3 numbers and 3 alphabets)
  const isValidPassword = (password) => {
    const hasThreeNumbers = /(.*\d.*){3,}/.test(password);
    const hasThreeAlphabets = /(.*[a-zA-Z].*){3,}/.test(password);
    return hasThreeNumbers && hasThreeAlphabets;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validate password
    if (!isValidPassword(formData.Password)) {
      setErrorMessage("Password must contain at least 3 numbers and 3 alphabets.");
      return;
    }

    try {
      const response = await axios.post("http://localhost/POS/api/user/Signup", formData);
      setSuccessMessage(response.data.Message);
      setFormData({
        FirstName: "",
        LastName: "",
        PhoneNo: "",
        Username: "",
        Password: "",
        Gender: "Male",
        Role: "User",
      });
    } catch (error) {
      setErrorMessage(error.response?.data || "An error occurred during signup.");
    }
  };

  return (
    <div style={{ backgroundColor: "#101820", minHeight: "100vh", padding: "20px" }}>
    <div className="container mt-5" style={{ fontFamily: 'Poppins, sans-serif' }}>

      <div className="card shadow p-4" style={{ maxWidth: "1500px", margin: "0 auto" ,backgroundColor: "#FEE715" }}>
      <div className="d-flex align-items-center mb-4">
      <FaArrowLeft onClick={() => navigate(-1)} style={{ cursor: "pointer", marginRight: "10px", color: "#101820" }}size={24}/>
      <h2 className="mb-0" style={{ 
          textShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)", 
          fontFamily: "Poppins, sans-serif", 
          fontWeight: "bold", 
          color: "#101820", 
          textAlign: "center" ,
          flex: 1
        }}
      >
        Signup
      </h2>
    </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="FirstName" className="form-label">
              First Name
            </label>
            <input
              type="text"
              className="form-control"
              id="FirstName"
              name="FirstName"
              placeholder="Enter Firstname"
              value={formData.FirstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="LastName" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              className="form-control"
              id="LastName"
              name="LastName"
              placeholder="Enter lastname"
              value={formData.LastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="PhoneNo" className="form-label">
              Phone Number
            </label>
            <input
              type="tel"
              className="form-control"
              id="PhoneNo"
              name="PhoneNo"
              placeholder="Enter Phone number"
              value={formData.PhoneNo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="Username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="Username"
              name="Username"
              placeholder="Enter Username"
              value={formData.Username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="Password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="Password"
              name="Password"
              placeholder="Enter Password"
              value={formData.Password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="Gender" className="form-label">
              Gender
            </label>
            <select
              className="form-select"
              id="Gender"
              name="Gender"
              value={formData.Gender}
              onChange={handleChange}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="Role" className="form-label">
              Role
            </label>
            <select
              className="form-select"
              id="Role"
              name="Role"
              value={formData.Role}
              onChange={handleChange}
            >
              <option value="Employee">Employee</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn w-100" style={{ backgroundColor: "#101820", borderColor: "#101820" ,fontWeight:"bold",color:"white"}}>
            Signup
          </button>
          {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
          {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
        </form>
      </div>
    </div>
    </div>
    
  );
};

export default Signup;
