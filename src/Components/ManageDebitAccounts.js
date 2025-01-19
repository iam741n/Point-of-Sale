import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Modal, Form ,Alert} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ManageDebitAccounts = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
const [errorMessage, setErrorMessage] = useState("");

  const [updatedAccount, setUpdatedAccount] = useState({
    account_name: "",
    account_description: "",
  });

  // Fetch accounts from the API
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get("http://localhost/POS/api/Expense/GetDebitAccounts");
        setAccounts(response.data);
      } catch (error) {
        console.error("Error fetching debit accounts", error);
      }
    };

    fetchAccounts();
  }, []);

  // Open the update modal
  const handleUpdateClick = (account) => {
    setSelectedAccount(account);
    setUpdatedAccount({
      account_name: account.AccountName,
      account_description: account.AccountDescription,
    });
    setShowUpdateModal(true);
  };
  
  const handleUpdateSubmit = async () => {
    if (!selectedAccount) {
      console.error("No selected account found.");
      return;
    }
  
    try {
      const updatedData = {
        AccountName: updatedAccount.account_name,
        AccountDescription: updatedAccount.account_description,
      };
  
      // Use the selected account's DebitAccountId for the PUT request
      await axios.put(`http://localhost/POS/api/Expense/UpdateDebitAccount/${selectedAccount.Id}`, updatedData);
      
      // Update the account in the state instead of filtering it out
      setAccounts((prevAccounts) => 
        prevAccounts.map((account) => 
          account.Id === selectedAccount.Id 
            ? { ...account, ...updatedData } 
            : account
        )
      );
  
      setSuccessMessage("Account updated successfully!");
      setErrorMessage(""); // Clear any previous error messages
      setShowUpdateModal(false);
      
      // Optionally clear the success message after a delay
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage("Error updating account. Please try again.");
      setSuccessMessage(""); // Clear any previous success messages
      console.error("Error updating account", error);
      
      // Optionally clear the error message after a delay
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };
  
  

  // Open the delete modal
  const handleDeleteClick = (account) => {
    setSelectedAccount(account);
    setShowDeleteModal(true);
  };

  // Handle delete confirmation
  const handleDeleteAccount = async () => {
    if (!selectedAccount) {
      console.error("No selected account found.");
      return;
    }

    try {
      // Use the selected account's DebitAccountId for the DELETE request
      await axios.delete(`http://localhost/POS/api/Expense/DeleteDebitAccount/${selectedAccount.Id}`);
      // Remove the deleted account from the list
      setAccounts((prevAccounts) => prevAccounts.filter((account) => account.Id !== selectedAccount.Id));
      setShowDeleteModal(false);


    setSuccessMessage("Account deleted successfully!");
    setErrorMessage(""); // Clear any previous error messages
    setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
        setErrorMessage("Error deleting account. Please try again.");
        setSuccessMessage(""); // Clear any previous success messages
        console.error("Error deleting account", error);
    
        // Optionally clear the error message after a delay
        setTimeout(() => setErrorMessage(""), 3000);
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
          }}>Manage Debit Accounts</h2>
        </div>
        <div className="row">
          {accounts.map((account) => (
            <div className="col-md-4 mb-4" key={account.Id}>
              <Card style={{ backgroundColor: "#FEE715" }}>
                <Card.Body>
                  <Card.Title style={{ color: "#101820" }}>{account.AccountName}</Card.Title>
                  <Card.Text style={{ color: "#101820" }}>{account.AccountDescription}</Card.Text>
                  <Button
                    variant="primary"
                    className="me-2"
                    style={{ backgroundColor: "#101820", borderColor: "#101820" }}
                    onClick={() => handleUpdateClick(account)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="danger"
                    style={{ backgroundColor: "#101820", borderColor: "#101820" }}
                    onClick={() => handleDeleteClick(account)}
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
            <Modal.Title style={{ color: "#101820" }}>Update Debit Account</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: "#FEE715" }}>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: "#101820" }}>Account Name</Form.Label>
                <Form.Control
                  type="text"
                  value={updatedAccount.account_name}
                  onChange={(e) => setUpdatedAccount({ ...updatedAccount, account_name: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: "#101820" }}>Account Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={updatedAccount.account_description}
                  onChange={(e) => setUpdatedAccount({ ...updatedAccount, account_description: e.target.value })}
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
            Are you sure you want to delete this debit account?
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: "#FEE715" }}>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)} style={{ backgroundColor: "#101820", borderColor: "#101820" }}>
              No
            </Button>
            <Button variant="danger" onClick={handleDeleteAccount} style={{ backgroundColor: "#101820", borderColor: "#101820" }}>
              Yes, Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <div>
    {/* Display success alert */}
    {successMessage && (
      <Alert variant="success">
        {successMessage}
      </Alert>
    )}

    {/* Display error alert */}
    {errorMessage && (
      <Alert variant="danger">
        {errorMessage}
      </Alert>
    )}

    {/* Your modal and other components go here */}
  </div>
    </div>
  );
};

export default ManageDebitAccounts;
