import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const UpdateRideSale = () => {
  const [billNo, setBillNo] = useState('');
  const [rideQuantities, setRideQuantities] = useState([]);
  const [paidAmount, setPaidAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle Ride Quantity input change
  const handleRideQuantityChange = (index, value) => {
    const newQuantities = [...rideQuantities];
    newQuantities[index] = value;
    setRideQuantities(newQuantities);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!billNo || rideQuantities.length === 0 || !paidAmount || !paymentMethod) {
      setErrorMessage('All fields are required.');
      return;
    }

    const requestData = {
      RideQuantities: rideQuantities,
      PaidAmount: parseFloat(paidAmount),
      PaymentMethod: paymentMethod
    };

    try {
      const response = await axios.put(`http://localhost/POS/api/RideSales/UpdateRideSale?billNo=${billNo}`, requestData);
      setSuccessMessage(response.data);
    } catch (error) {
      setErrorMessage(error.response ? error.response.data : 'An error occurred.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Update Ride Sale</h2>
      {errorMessage && (
  <Alert variant="danger">
    {errorMessage.Message ? errorMessage.Message : "An error occurred."}
    {errorMessage.MessageDetail && <div>{errorMessage.MessageDetail}</div>}
  </Alert>
)}

{successMessage && (
  <Alert variant="success">
    {successMessage.Message ? successMessage.Message : "Operation was successful."}
    {successMessage.MessageDetail && <div>{successMessage.MessageDetail}</div>}
  </Alert>
)}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBillNo">
          <Form.Label>Bill Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Bill Number"
            value={billNo}
            onChange={(e) => setBillNo(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formRideQuantities">
          <Form.Label>Ride Quantities</Form.Label>
          <div>
            {[...Array(rideQuantities.length || 1)].map((_, index) => (
              <Form.Control
                key={index}
                type="number"
                value={rideQuantities[index] || ''}
                onChange={(e) => handleRideQuantityChange(index, e.target.value)}
                placeholder={`Enter Quantity for Ride ${index + 1}`}
              />
            ))}
          </div>
          <Button variant="link" onClick={() => setRideQuantities([...rideQuantities, ''])}>Add another ride</Button>
        </Form.Group>

        <Form.Group controlId="formPaidAmount">
          <Form.Label>Paid Amount</Form.Label>
          <Form.Control
            type="number"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            placeholder="Enter Paid Amount"
          />
        </Form.Group>

        <Form.Group controlId="formPaymentMethod">
          <Form.Label>Payment Method</Form.Label>
          <Form.Control
            as="select"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Select Payment Method</option>
            <option value="Cash">Cash</option>
            {/* <option value="Card">Card</option> */}
            <option value="Online Transfer">Online Transfer</option>
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit">
          Update Ride Sale
        </Button>
      </Form>
    </div>
  );
};

export default UpdateRideSale;
