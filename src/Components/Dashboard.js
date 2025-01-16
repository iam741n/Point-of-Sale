import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Row, Col, Modal } from 'react-bootstrap';
import '../Styles/Dashboard.css';
import { useUser } from '../Contexts/UserContext';
import { FaCalendarWeek, FaClock } from 'react-icons/fa';
import axios from 'axios';
import Sidebar2 from './Sidebar2';

function Dashboard() {
  const { userData } = useUser();  // Access userData from context
  const userName = userData ? `${userData.FirstName} ${userData.LastName}` : 'Guest';
  const [items, setItems] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [dateTime, setDateTime] = useState({ date: '', time: '' });
  const [showModal, setShowModal] = useState(false); // Modal state
  const [paidAmount, setPaidAmount] = useState(0);
  const [receiptNo, setReceiptNo] = useState(67890); // Track receipt number
  const [billNo, setBillNo] = useState(''); // Track bill number
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [cart, setCart] = useState([]);

  const fetchRides = async () => {
    try {
      const response = await axios.get('http://localhost/POS/api/rides/GetRides');
      const rides = response.data.map((ride) => ({
        id: ride.ride_id,
        name: ride.ride_name,
        description: ride.ride_description,
        price: ride.ride_price,
        quantity: 0
      }));
      setItems(rides);
    } catch (error) {
      console.error('Error fetching rides:', error);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  // Call the API to generate Bill No and Receipt No
  const fetchBillAndReceipt = async () => {
    try {
      const response = await axios.get('http://localhost/POS/api/RideSales/GenerateBillAndReceipt');
      setBillNo(response.data.BillNo);
      setReceiptNo(response.data.ReceiptNo); // Receipt number should increment here
    } catch (error) {
      console.error('Error fetching bill and receipt:', error);
    }
  };

  const updateQuantity = (id, action) => {
    setItems(prevItems => prevItems.map(item => {
      if (item.id === id) {
        let newQuantity = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
        if (newQuantity < 0) newQuantity = 0;
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getBalance = () => {
    const totalAmount = getTotal();
    return paidAmount > 0 ? paidAmount - totalAmount : 0;
  };

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const date = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      setDateTime({ date, time });
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkMidnight = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) {
        setReceiptNo(0); // Reset receipt number at midnight
      }
    }, 1000);

    return () => clearInterval(checkMidnight);
  }, []);

 // Handle Save & Print Bill button click
 const handleSaveAndPrint = async () => {
  await fetchBillAndReceipt();  // Fetch bill and receipt, then show modal
  setShowModal(true); // Show modal when Save & Print Bill button is clicked
};

const handleSaveData = async (printReceipt) => {
  try {
    // Prepare the data to be saved
    const rideIds = items.filter((item) => item.quantity > 0).map((item) => item.id);
    const ridePrices = items.filter((item) => item.quantity > 0).map((item) => item.price);
    const rideQuantities = items.filter((item) => item.quantity > 0).map((item) => item.quantity);
    const totalAmount = getTotal();
    const balance = getBalance();

    const requestData = {
      BillNo: billNo,
      RideIds: rideIds,
      RidePrices: ridePrices,
      RideQuantities: rideQuantities,
      TotalAmount: totalAmount,
      PaidAmount: paidAmount,
      Balance: balance,
      PaymentMethod: selectedPayment,
      Date: dateTime.date,
      Time: dateTime.time,
      CreatedBy: userName,  // Add the logged-in user's name or ID here
    };

    // Always save data regardless of the print option
    const response = await axios.post('http://localhost/POS/api/RideSales/SaveRideSales', requestData);

    if (response.status === 200) {
      console.log('Data saved successfully');
      // Print receipt only if the user chooses "Yes"
      // Call clearCart to reset cart after successful data save
      clearCart();
      if (printReceipt) {
        printReceiptData();
      }
      setShowModal(false); // Close modal after action
    }
  } catch (error) {
    console.error('Error saving data:', error);
    setShowModal(false); // Close modal on error
  }
};
// Function to clear the cart and reset necessary fields
const clearCart = () => {
  // Reset cart items: set quantities to 0
  setItems((prevItems) => 
    prevItems.map((item) => ({
      ...item,
      quantity: 0, // Set quantity to 0 for all items
    }))
  );

  // Reset related fields
  setPaidAmount(0); // Reset paid amount
  setSelectedPayment(null); // Clear payment method
  setFormData({}); // Clear any form data
  setCart([]); // Clear the cart array if used
  setSuccessMessage(''); // Clear success message
  setErrorMessage(''); // Clear error message

  console.log('Cart cleared successfully!');
};




 // Create the receipt content based on the cart items
 const printReceiptData = () => {
  // Determine padding sizes
  const maxNameLength = Math.max(...items.map(item => item.name.length));
  const maxPriceLength = Math.max(...items.map(item => (item.price * item.quantity).toString().length));

  const receiptContent = `
    ------------------------------
    Receipt
    ------------------------------
    BillNo: ${billNo} ReceiptNo: ${receiptNo}
    Rides:
    ${items
      .filter(item => item.quantity > 0)
      .map(item => 
        `${item.name.padEnd(maxNameLength)}: ${item.quantity} x Rs. ${item.price} = Rs. ${(item.quantity * item.price)
          .toString()
          .padStart(maxPriceLength)}`
      )
      .join('\n')}
    ------------------------------
    Total Amount: Rs. ${getTotal()}
    Paid Amount: Rs. ${paidAmount}
    Balance: Rs. ${getBalance()}
    Payment Method: ${selectedPayment === 'cash' ? 'Cash' : 'Online Transfer'}
    Created By: ${userName}
    ------------------------------
    Thank you for shopping with us!
    ------------------------------
  `;

  // Log the receipt content to the console
  console.log(receiptContent);
  
  const newWindow = window.open('', '', 'width=600,height=400');
  newWindow.document.write('<pre>' + receiptContent + '</pre>'); // Use <pre> to preserve spacing
  newWindow.document.close();
  newWindow.print();
  newWindow.close();
};


  return (
    <div className="dashboard">
      <Sidebar2 />
      <div className="content-container">
        {/* Center Panel */}
        <div className="center-panel">
          <div className="date-time">
            <div><FaCalendarWeek /> {dateTime.date}</div>
            <div><FaClock /> {dateTime.time}</div>
          </div>

          {/* Action Buttons */}
          {/* Action Section */}
          <div className="actions mt-3">
              <h2 className="text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
             Welcome, <span className="text-primary text-custom-primary">{userName}</span>

                    </h2>
              </div>

           {/* Read-only forms for Bill No and Receipt No */}
           <Form className="bill-receipt-forms mt-3">
            <Row>
              <Col md={6}>
                <Form.Group controlId="formBillNo">
                  <Form.Label>Bill No</Form.Label>
                  <Form.Control type="text" readOnly value={billNo} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formReceiptNo">
                  <Form.Label>Receipt No</Form.Label>
                  <Form.Control type="text" readOnly value={receiptNo} />
                </Form.Group>
              </Col>
            </Row>
          </Form>
          <hr />

          <div className="items-grid mt-4">
            {items.map((item) => (
              <div className="card" key={item.id} style={{ width: '18rem' }}>
                <div className="card-body" style={{ backgroundColor: item.quantity > 0 ? '#ffe802' : '#fffdb8' }}>
                  <h4 className="card-title">{item.name}</h4>
                  <p className="card-text">{item.description}</p>
                  <p className="card-text"><strong>Price:</strong>  Rs. {item.price}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <Button className="btn btn-outline-secondary" onClick={() => updateQuantity(item.id, 'decrease')}>-</Button>
                    <span>{item.quantity}</span>
                    <Button className="btn btn-outline-secondary" onClick={() => updateQuantity(item.id, 'increase')}>+</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div> 

        {/* Cart Section */}
        <div className="cart-section">
          <div className="cart-items">
            <h5>Cart:</h5>
            {items.filter(item => item.quantity > 0).map(item => (
              <div key={item.id}>
                <p>{item.name}: {item.quantity} x Rs. {item.price} = Rs. {item.quantity * item.price}</p>
              </div>
            ))}

            <hr />
            <div><strong>Total Amount: </strong> Rs. {getTotal()}</div>
            
            {/* Paid Amount Input */}
            <Form.Control
  type="number"
  value={isNaN(paidAmount) ? '' : paidAmount} // Ensure it's either an empty string or a valid number
  onChange={(e) => {
    const value = e.target.value;
    setPaidAmount(value === '' ? 0 : parseFloat(value)); // Ensure valid number or fallback to 0
  }}
  placeholder="Enter paid amount"
/>


            
            <div><strong>Balance: </strong> Rs. {getBalance()}</div>
          </div>
          <hr />
          {/* Payment Methods */}
         <h6>Payment Method</h6>
<div className="payment-methods mt-3">
  <button
    className={`payment-button ${selectedPayment === 'Cash' ? 'selected' : ''}`}
    onClick={() => setSelectedPayment('Cash')}
  >
    <img src="/cash.png" alt="Cash" style={{ width: 20, marginRight: 8 }} />
    Cash
  </button>
  <button
    className={`payment-button ${selectedPayment === 'Online Transfer' ? 'selected' : ''}`}
    onClick={() => setSelectedPayment('Online Transfer')}
  >
    <img src="/online.png" alt="Online Transfer" style={{ width: 20, marginRight: 8 }} />
    Online Transfer
  </button>
</div>


          <div className="action-buttons mt-3">
            <button className="btn btn-success save-print-button" onClick={handleSaveAndPrint}>Save & Print Bill</button>
            <button className="btn btn-danger clear-button" onClick={clearCart}>Clear</button>
          </div>
           {/* Display success or error messages */}
      {successMessage && <div>{successMessage}</div>}
      {errorMessage && <div>{errorMessage}</div>}

          {/* Modal for Save/Print decision */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Save & Print Options</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <p>Do you want to save the data and print the receipt, or just save the data?</p>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => handleSaveData(false)}>No, Save only</Button>
    <Button variant="primary" onClick={() => handleSaveData(true)}>Yes, Save & Print</Button>
  </Modal.Footer>
</Modal>

    
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
