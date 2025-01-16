import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button,  Container, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ExpenseManagement = () => {
   const navigate = useNavigate();
  const [debitAccounts, setDebitAccounts] = useState([]);
  const [selectedDebitAccount, setSelectedDebitAccount] = useState("");
  const [credit, setCredit] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [debitAccountName, setDebitAccountName] = useState("");
  const [debitAccountDescription, setDebitAccountDescription] = useState("");

  // Fetch Debit Accounts
  useEffect(() => {
    axios
      .get("http://localhost/POS/api/Expense/GetDebitAccounts")
      .then((response) => {
        const accountNames = response.data.map((account) => ({
          accountName: account.AccountName,
          id: account.Id,
        }));
        setDebitAccounts(accountNames);
      })
      .catch((error) => {
        console.error("Error fetching Debit Accounts:", error);
      });
  }, []);

  // Create Debit Account
  const createDebitAccount = () => {
    if (!debitAccountName || !debitAccountDescription) {
      setErrorMessage("Please fill all fields to create a debit account.");
      return;
    }

    const newDebitAccount = {
      accountName: debitAccountName,
      AccountDescription: debitAccountDescription,
    };

    axios
      .post("http://localhost/POS/api/Expense/CreateDebitAccount", newDebitAccount)
      .then(() => {
        setSuccessMessage("Debit Account created successfully!");
        setErrorMessage("");
        clearForm();
      })
      .catch(() => {
        setErrorMessage("Error creating the debit account.");
      });
  };

  // Create Expense
  const createExpense = () => {
    if (!selectedDebitAccount || !credit || !expenseDescription || !paidAmount) {
      setErrorMessage("Please fill all fields.");
      return;
    }

    const expenseData = {
      DebitAccountId: selectedDebitAccount,
      Credit: credit,
      ExpenseDescription: expenseDescription,
      PaidAmount: parseFloat(paidAmount),
    };
    

    axios
      .post("http://localhost/POS/api/Expense/CreateExpense", expenseData)
      .then(() => {
        setSuccessMessage("Expense created successfully!");
        setErrorMessage("");
        clearForm();
      })
      .catch(() => {
        setErrorMessage("Error creating the expense.");
      });
  };

  // Clear Form
  const clearForm = () => {
    setSelectedDebitAccount("");
    setCredit("");
    setExpenseDescription("");
    setPaidAmount("");
    setDebitAccountName("");
    setDebitAccountDescription("");
  };

  return (
    <div style={{ backgroundColor: "#101820", minHeight: "100vh", padding: "20px" }}>
      <Container className="mt-5" style={{ fontFamily: "Poppins, sans-serif", color: "#FEE715" }}>
         <FaArrowLeft onClick={() => navigate(-1)} style={{ cursor: "pointer", marginRight: "10px", color: "#FEE715" }}size={24}/>
        <h2 className="text-center mb-4" style={{ textShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)", fontWeight: "bold" }}>
          Expense Management
        </h2>
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Form>
        <Form.Group className="mb-3">
  <Form.Label style={{ color: "#FEE715" }}>Debit Account</Form.Label>
  <Form.Control
    as="select"
    value={selectedDebitAccount || ""}
    onChange={(e) => setSelectedDebitAccount(e.target.value)}
    style={{
      backgroundColor: "#FEE715",
      color: "#101820",
      border: "1px solid #101820",
    }}
  >
    <option value="">Select Debit Account</option>
    {debitAccounts.map((account) => (
      <option key={account.id} value={account.id}>
        {account.accountName}
      </option>
    ))}
  </Form.Control>
</Form.Group>


<Form.Group className="mb-3">
  <Form.Label style={{ color: "#FEE715" }}>Credit</Form.Label>
  <Form.Control
    as="select"
    value={credit}
    onChange={(e) => setCredit(e.target.value)}
    style={{
      backgroundColor: "#FEE715",
      color: "#101820",
      border: "1px solid #101820",
    }}
  >
    <option value="">Select Credit Method</option>
    <option value="Cash">Cash</option>
    <option value="Online Transfer">Online Transfer</option>
  </Form.Control>
</Form.Group>


          <Form.Group className="mb-3">
            <Form.Label style={{ color: "#FEE715" }}>Expense Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={expenseDescription}
              onChange={(e) => setExpenseDescription(e.target.value)}
              style={{ backgroundColor: "#FEE715", color: "#101820" }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: "#FEE715" }}>Paid Amount</Form.Label>
            <Form.Control
              type="number"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              style={{ backgroundColor: "#FEE715", color: "#101820" }}
            />
          </Form.Group>

          <Button
            onClick={createExpense}
            style={{ backgroundColor: "#101820", borderColor: "#FEE715", color: "#FEE715" }}
          >
            Create Expense
          </Button>
        </Form>
        <h3 className="mt-5" style={{ color: "#FEE715", fontWeight: "bold" }}>
          Add New Debit Account
        </h3>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: "#FEE715" }}>Account Name</Form.Label>
            <Form.Control
              type="text"
              value={debitAccountName}
              onChange={(e) => setDebitAccountName(e.target.value)}
              style={{ backgroundColor: "#FEE715", color: "#101820" }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: "#FEE715" }}>Account Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={debitAccountDescription}
              onChange={(e) => setDebitAccountDescription(e.target.value)}
              style={{ backgroundColor: "#FEE715", color: "#101820" }}
            />
          </Form.Group>

          <Button
            onClick={createDebitAccount}
            style={{ backgroundColor: "#101820", borderColor: "#FEE715", color: "#FEE715" }}
          >
            Add Account
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default ExpenseManagement;
