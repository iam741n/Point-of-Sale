import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Modal, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ManageRides = () => {
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [updatedRide, setUpdatedRide] = useState({
    ride_name: "",
    ride_description: "",
    ride_price: "",
  });

  // Fetch rides from the API
  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await axios.get("http://localhost/POS/api/rides/GetRides");
        setRides(response.data);
      } catch (error) {
        console.error("Error fetching rides", error);
      }
    };

    fetchRides();
  }, []);

  // Open the update modal
  const handleUpdateClick = (ride) => {
    setSelectedRide(ride);
    setUpdatedRide({
      ride_name: ride.ride_name,
      ride_description: ride.ride_description,
      ride_price: ride.ride_price,
    });
    setShowUpdateModal(true);
  };

  // Handle update submission
  const handleUpdateSubmit = async () => {
    try {
      await axios.put(`http://localhost/POS/api/rides/UpdateRide/${selectedRide.ride_id}`, updatedRide);
      setRides((prevRides) =>
        prevRides.map((ride) =>
          ride.ride_id === selectedRide.ride_id ? { ...ride, ...updatedRide } : ride
        )
      );
      setShowUpdateModal(false);
    } catch (error) {
      console.error("Error updating ride", error);
    }
  };

  // Open the delete modal
  const handleDeleteClick = (ride) => {
    setSelectedRide(ride);
    setShowDeleteModal(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost/POS/api/rides/DeleteRide/${selectedRide.ride_id}`);
      setRides((prevRides) => prevRides.filter((ride) => ride.ride_id !== selectedRide.ride_id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting ride", error);
    }
  };

  return (
    <div style={{ backgroundColor: "#101820", minHeight: "100vh", padding: "20px" }}>
      <div className="container mt-5" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <div className="d-flex align-items-center mb-4">
          <FaArrowLeft onClick={() => navigate(-1)} style={{ cursor: "pointer", marginRight: "10px", color: "#FEE715" }} size={24} />
          <h2 className="mb-0" style={{
            textShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
            fontFamily: "Poppins, sans-serif",
            fontWeight: "bold",
            color: "#FEE715",
            textAlign: "center",
            flex: 1
          }}>Manage Rides</h2>
        </div>
        <div className="row">
          {rides.map((ride) => (
            <div className="col-md-4 mb-4" key={ride.ride_id}>
              <Card style={{ backgroundColor: "#FEE715" }}>
                <Card.Body>
                  <Card.Title style={{ color: "#101820" }}>{ride.ride_name}</Card.Title>
                  <Card.Text style={{ color: "#101820" }}>{ride.ride_description}</Card.Text>
                  <Card.Text style={{ color: "#101820" }}>Price: ${ride.ride_price.toFixed(2)}</Card.Text>
                  <Button
                    variant="primary"
                    className="me-2"
                    style={{ backgroundColor: "#101820", borderColor: "#101820" }}
                    onClick={() => handleUpdateClick(ride)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="danger"
                    style={{ backgroundColor: "#101820", borderColor: "#101820" }}
                    onClick={() => handleDeleteClick(ride)}
                  >
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>

        {/* Update Modal */}
        <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} style={{ backgroundColor: "#101820" }}>
          <Modal.Header closeButton style={{ backgroundColor: "#FEE715" }}>
            <Modal.Title style={{ color: "#101820" }}>Update Ride</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: "#FEE715" }}>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: "#101820" }}>Ride Name</Form.Label>
                <Form.Control
                  type="text"
                  value={updatedRide.ride_name}
                  onChange={(e) => setUpdatedRide({ ...updatedRide, ride_name: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: "#101820" }}>Ride Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={updatedRide.ride_description}
                  onChange={(e) => setUpdatedRide({ ...updatedRide, ride_description: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: "#101820" }}>Ride Price</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={updatedRide.ride_price}
                  onChange={(e) => setUpdatedRide({ ...updatedRide, ride_price: parseFloat(e.target.value) })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: "#FEE715" }}>
            <Button variant="secondary" onClick={() => setShowUpdateModal(false)} style={{ backgroundColor: "#101820", borderColor: "#101820" }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateSubmit} style={{ backgroundColor: "#101820", borderColor: "#101820" }}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} style={{ backgroundColor: "#101820" }}>
          <Modal.Header closeButton style={{ backgroundColor: "#FEE715" }}>
            <Modal.Title style={{ color: "#101820" }}>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: "#FEE715" }}>
            Are you sure you want to delete this ride?
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: "#FEE715" }}>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)} style={{ backgroundColor: "#101820", borderColor: "#101820" }}>
              No
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm} style={{ backgroundColor: "#101820", borderColor: "#101820" }}>
              Yes, Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default ManageRides;
