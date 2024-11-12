import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Button, Form, Row, Col } from 'react-bootstrap';
import '../Styles/Dashboard.css';
import { FaCalendarWeek, FaClock } from 'react-icons/fa';

function Dashboard() {
  const initialItems = [
    { id: 1, name: "Motion Ride", price: 200, quantity: 0 },
    { id: 2, name: "Kidi Ride", price: 250, quantity: 0 },
    { id: 3, name: "Flight Simulator", price: 300, quantity: 0 }
  ];

  const [items, setItems] = useState(initialItems);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [dateTime, setDateTime] = useState({ date: '', time: '' });
  const [paidAmount, setPaidAmount] = useState(0); // Track paid amount
  const [receiptNo, setReceiptNo] = useState(67890); // Track receipt number

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

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="content-container">
        {/* Center Panel */}
        <div className="center-panel">
          <div className="date-time">
            <div><FaCalendarWeek /> {dateTime.date}</div>
            <div><FaClock /> {dateTime.time}</div>
          </div>

          {/* Action Buttons */}
          <div className="actions mt-3">
            <button className="btn btn-primary">Edit Bill</button>
            <button className="btn btn-primary">Print Bill</button>
            <button className="btn btn-warning">Hold</button>
          </div>

          {/* Read-only forms for Bill No and Receipt No */}
          <Form className="bill-receipt-forms mt-3">
            <Row>
              <Col md={6}>
                <Form.Group controlId="formBillNo">
                  <Form.Label>Bill No</Form.Label>
                  <Form.Control type="text" readOnly value="12345" />
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

          {/* Item Cards */}
          <div className="items-grid mt-4">
            {items.map(item => (
              <div className="card" key={item.id} style={{ width: '18rem' }}>
                <div className="card-body" style={{ backgroundColor: item.quantity > 0 ? '#ffe802' : '#fffdb8' }}>
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">Rs. {item.price}</p>
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
            <Form.Group controlId="formPaidAmount" className="mt-3">
              <Form.Label><strong>Paid Amount</strong></Form.Label>
              <Form.Control
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(parseFloat(e.target.value))}
                placeholder="Enter paid amount"
              />
            </Form.Group>
            
            <div><strong>Balance: </strong> Rs. {getBalance()}</div>
          </div>
          <hr />
          {/* Payment Methods */}
          <h6>Payment Method</h6>
          <div className="payment-methods mt-3">
            
            <button
              className={`payment-button ${selectedPayment === 'cash' ? 'selected' : ''}`}
              onClick={() => setSelectedPayment('cash')}
            >
               <img src="/cash.png" alt="Cash" style={{ width: 20, marginRight: 8 }} />
              Cash
            </button>
            <button
              className={`payment-button ${selectedPayment === 'online' ? 'selected' : ''}`}
              onClick={() => setSelectedPayment('online')}
            >
               <img src="/online.png" alt="online transfer" style={{ width: 20, marginRight: 8 }} />
              Online Transfer
            </button>
          </div>

          <div className="action-buttons mt-3">
            <button className="btn btn-success save-print-button">Save & Print Bill</button>
            <button className="btn btn-danger clear-button">Clear</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
