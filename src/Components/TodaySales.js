import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TodaySales = () => {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [rideName, setRideName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);

  // Helper functions for formatting date and time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US");
  };

  const formatTime = (time) => {
    if (!time) return "Invalid Time";
  
    try {
      // Create a Date object assuming the time is in UTC
      const date = new Date(`1970-01-01T${time}`); 
      // Convert to local time
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.error("Invalid time format:", time, error);
      return "Invalid Time";
    }
  };
  

  // Fetch sales data from the API
  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost/POS/api/RideSales/GetTodaySales",
        {
          params: {
            rideName: rideName,
            paymentMethod: paymentMethod,
          },
        }
      );
      const formattedSales = response.data.map((sale) => ({
        ...sale,
        formattedDate: formatDate(sale.date),
        formattedTime: formatTime(sale.date, sale.time),
      }));
      setSales(formattedSales);
    } catch (error) {
      console.error("Error fetching sales data", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts or when filters change
  useEffect(() => {
    fetchSalesData();
  }, [rideName, paymentMethod]);

  return (
    <div style={{ backgroundColor: "#101820", minHeight: "100vh", padding: "20px" }}>
      <div className="container mt-5" style={{ fontFamily: "Poppins, sans-serif" }}>
        <div className="card shadow p-4" style={{ maxWidth: "1500px", margin: "0 auto", backgroundColor: "#FEE715" }}>
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
              Today's Sales
            </h2>
          </div>

          {/* Filter Section */}
          <Row className="mb-3">
            <Col md={3}>
              <Form.Group controlId="rideName">
                <Form.Label style={{ fontWeight: "bold", color: "#101820" }}>Ride Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter ride name"
                  value={rideName}
                  onChange={(e) => setRideName(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="paymentMethod">
                <Form.Label style={{ fontWeight: "bold", color: "#101820" }}>Payment Method</Form.Label>
                <Form.Control
                  as="select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Cash">Cash</option>
                  <option value="Online Transfer">Online Transfer</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={3} className="d-flex align-items-end">
              <Button
                className="w-100"
                style={{
                  backgroundColor: "#101820",
                  borderColor: "#101820",
                  fontWeight: "bold",
                  color: "white",
                }}
                onClick={fetchSalesData}
              >
                Apply Filters
              </Button>
            </Col>
          </Row>

          {/* Sales Table */}
          {loading ? (
            <div className="text-center" style={{ color: "#101820", fontWeight: "bold" }}>
              Loading...
            </div>
          ) : (
            <Table striped bordered hover responsive style={{ marginTop: "20px" }}>
              <thead style={{ backgroundColor: "#101820", color: "#FEE715" }}>
                <tr>
                  <th>Bill No</th>
                  <th>Receipt No</th>
                  <th>Ride Name</th>
                  <th>Ride Price</th>
                  <th>Ride Quantity</th>
                  <th>Total Amount</th>
                  <th>Paid Amount</th>
                  <th>Balance</th>
                  <th>Payment Method</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan="12" className="text-center" style={{ color: "#101820" }}>
                      No data available
                    </td>
                  </tr>
                ) : (
                  sales.map((sale) => (
                    <tr key={sale.id}>
                      <td>{sale.bill_no}</td>
                      <td>{sale.receipt_no}</td>
                      <td>{sale.ride_name}</td>
                      <td>{sale.ride_price}</td>
                      <td>{sale.ride_quantity}</td>
                      <td>{sale.total_amount}</td>
                      <td>{sale.paid_amount}</td>
                      <td>{sale.balance}</td>
                      <td>{sale.payment_method}</td>
                      <td>{sale.formattedDate}</td>
                      <td>{formatTime(sale.time)}</td> {/* Updated */}
                      <td>{sale.created_at}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodaySales;
