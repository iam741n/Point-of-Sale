import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AddRides = () => {
  const navigate = useNavigate();
  const [rideData, setRideData] = useState({
    ride_name: "",
    ride_description: "",
    ride_price: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRideData({
      ...rideData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost/POS/api/rides/AddRide", {
        ride_name: rideData.ride_name,
        ride_description: rideData.ride_description,
        ride_price: parseFloat(rideData.ride_price),
      });

      setSuccessMessage("Ride added successfully!");
      setRideData({ ride_name: "", ride_description: "", ride_price: "" });
    } catch (error) {
      setErrorMessage("Failed to add ride. Please try again.");
    }
  };

  return (
    <div style={{ backgroundColor: "#101820", minHeight: "100vh", padding: "20px" }}>
      <div className="container mt-5" style={{ fontFamily: "Poppins, sans-serif" }}>
        <div
          className="card shadow p-4"
          style={{ maxWidth: "1500px", margin: "0 auto", backgroundColor: "#FEE715" }}
        >
          {/* Header */}
          <div className="d-flex align-items-center mb-4">
            <FaArrowLeft
              onClick={() => navigate(-1)}
              style={{ cursor: "pointer", marginRight: "10px", color: "#101820" }}
              size={24}
            />
            <h2
              className="mb-0"
              style={{
                textShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
                fontFamily: "Poppins, sans-serif",
                fontWeight: "bold",
                color: "#101820",
                textAlign: "center",
                flex: 1,
              }}
            >
              Add New Ride
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="ride_name" className="form-label">
                Ride Name
              </label>
              <input
                type="text"
                className="form-control"
                id="ride_name"
                name="ride_name"
                placeholder="Enter ride name"
                value={rideData.ride_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="ride_description" className="form-label">
                Ride Description
              </label>
              <textarea
                className="form-control"
                id="ride_description"
                name="ride_description"
                rows="3"
                placeholder="Enter ride description"
                value={rideData.ride_description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="ride_price" className="form-label">
                Ride Price
              </label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                id="ride_price"
                name="ride_price"
                placeholder="Enter ride price"
                value={rideData.ride_price}
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn w-100"
              style={{
                backgroundColor: "#101820",
                borderColor: "#101820",
                fontWeight: "bold",
                color: "white",
              }}
            >
              Add Ride
            </button>

            {/* Success and Error Messages */}
            {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRides;
