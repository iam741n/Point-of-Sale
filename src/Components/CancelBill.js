import React, { useState } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Alert, Form, Button } from 'react-bootstrap';
import { useUser } from '../Contexts/UserContext';

const CancelBill = () => {
  const { userData } = useUser();  // Access userData from context
  const userName = userData ? `${userData.FirstName} ${userData.LastName}` : 'Guest';
  const navigate = useNavigate();
  const [billNo, setBillNo] = useState('');
  const [cancellationReason, setCancellationReason] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'billNo') setBillNo(value);
    if (name === 'cancellationReason') setCancellationReason(value);
  };

  // Handle form submission
  const handleCancelBill = async (e) => {
    e.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post('http://localhost/POS/api/BillCancellation/CancelBill', {
        billNo: billNo,
        cancellationReason: cancellationReason,
        cancelledBy: userName,
      });

      setSuccessMessage(response.data);  // Success message from API
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.Message || 'An error occurred');
      } else {
        setErrorMessage('Network error. Please try again later.');
      }
    }
  };

  return (
    <div style={{ backgroundColor: '#101820', minHeight: '100vh', padding: '20px' }}>
      <div className="container mt-5" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <div
          className="card shadow p-4"
          style={{ maxWidth: '1500px', margin: '0 auto', backgroundColor: '#FEE715' }}
        >
          {/* Header */}
          <div className="d-flex align-items-center mb-4">
            <FaArrowLeft
              onClick={() => navigate(-1)}
              style={{ cursor: 'pointer', marginRight: '10px', color: '#101820' }}
              size={24}
            />
            <h2
              className="mb-0"
              style={{
                textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 'bold',
                color: '#101820',
                textAlign: 'center',
                flex: 1,
              }}
            >
              Cancel Bill
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleCancelBill}>
            <div className="mb-3">
              <label htmlFor="billNo" className="form-label">Bill No</label>
              <input
                type="text"
                className="form-control"
                id="billNo"
                name="billNo"
                placeholder="Enter Bill No"
                value={billNo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="cancellationReason" className="form-label">Cancellation Reason</label>
              <textarea
                className="form-control"
                id="cancellationReason"
                name="cancellationReason"
                rows="3"
                placeholder="Enter reason for cancellation"
                value={cancellationReason}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="cancelledBy" className="form-label">Cancelled By</label>
              <input
                type="text"
                className="form-control"
                id="cancelledBy"
                name="cancelledBy"
                value={userName}
                readOnly
                disabled
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn w-100"
              style={{
                backgroundColor: '#101820',
                borderColor: '#101820',
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              Cancel Bill
            </button>

            {/* Success and Error Messages */}
            {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}
            {successMessage && <Alert variant="success" className="mt-3">{successMessage}</Alert>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CancelBill;
