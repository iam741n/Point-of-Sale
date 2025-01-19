import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ExpenseTable = () => {
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [updatedExpense, setUpdatedExpense] = useState({});
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());

    const fetchExpenses = async (fromDate, toDate) => {
        try {
            const formattedFromDate = new Date(fromDate).toISOString().split('T')[0];
            const formattedToDate = new Date(toDate).toISOString().split('T')[0];

            const response = await axios.get('http://localhost/POS/api/Expense/GetExpenses', {
                params: {
                    fromDate: formattedFromDate,
                    toDate: formattedToDate,
                },
            });

            setExpenses(response.data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    useEffect(() => {
        fetchExpenses(fromDate, toDate);
    }, []); 

    const handleShowUpdateModal = (expense) => {
        setSelectedExpense(expense);
        setUpdatedExpense({
            Credit: expense.Credit,
            ExpenseDescription: expense.ExpenseDescription,
            PaidAmount: expense.PaidAmount,
        });
        setShowUpdateModal(true);
    };

    const handleUpdateExpense = async () => {
        try {
            await axios.put(`http://localhost/POS/api/Expense/UpdateExpense/${selectedExpense.Id}`, updatedExpense);
            setShowUpdateModal(false);
            fetchExpenses(fromDate, toDate);  
        } catch (error) {
            console.error('Error updating expense:', error);
        }
    };

    const handleShowDeleteModal = (expense) => {
        setSelectedExpense(expense);
        setShowDeleteModal(true);
    };

    const handleDeleteExpense = async () => {
        try {
            await axios.delete(`http://localhost/POS/api/Expense/DeleteExpense/${selectedExpense.Id}`);
            setShowDeleteModal(false);
            fetchExpenses(fromDate, toDate);  
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

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
                        <h2 className="mb-0" style={{ textShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)", fontFamily: "Poppins, sans-serif", fontWeight: "bold", color: "#101820", textAlign: "center", flex: 1 }}>
                            Expense List
                        </h2>
                    </div>

                    {/* Filter Section */}
                    <Row className="mb-3">
                        <Col md={3}>
                            <Form.Group controlId="fromDate">
                                <Form.Label style={{ fontWeight: "bold", color: "#101820" }}>From Date</Form.Label>
                                <DatePicker
                                    selected={fromDate}
                                    onChange={(date) => setFromDate(date)}
                                    className="form-control"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group controlId="toDate">
                                <Form.Label style={{ fontWeight: "bold", color: "#101820" }}>To Date</Form.Label>
                                <DatePicker
                                    selected={toDate}
                                    onChange={(date) => setToDate(date)}
                                    className="form-control"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3} className="d-flex align-items-end">
                            <Button
                                className="w-100"
                                style={{ backgroundColor: "#101820", borderColor: "#101820", fontWeight: "bold", color: "white" }}
                                onClick={() => fetchExpenses(fromDate, toDate)}
                            >
                                Apply Filters
                            </Button>
                        </Col>
                    </Row>

                    {/* Expense Table */}
                    <Table striped bordered hover responsive style={{ marginTop: "20px" }}>
                        <thead style={{ backgroundColor: "#101820", color: "#FEE715" }}>
                            <tr>
                                <th>#</th>
                                <th>Debit Account Name</th>
                                <th>Debit Account Description</th>
                                <th>Credit</th>
                                <th>Expense Description</th>
                                <th>Paid Amount</th>
                                <th>Created At</th>
                                <th>Last Updated At</th>
                                <th>Action</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.length === 0 ? (
                                <tr>
                                    <td colSpan="10" className="text-center" style={{ color: "#101820" }}>
                                        No data available
                                    </td>
                                </tr>
                            ) : (
                                expenses.map((expense, index) => (
                                    <tr key={expense.Id}>
                                        <td>{index + 1}</td>
                                        <td>{expense.DebitAccountName}</td>
                                        <td>{expense.DebitAccountDescription}</td>
                                        <td>{expense.Credit}</td>
                                        <td>{expense.ExpenseDescription}</td>
                                        <td>{expense.PaidAmount}</td>
                                        <td>{new Date(expense.CreatedAt).toLocaleDateString()}</td>
                                        <td>{new Date(expense.LastUpdatedAt).toLocaleDateString()}</td>
                                        <td>
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                onClick={() => handleShowUpdateModal(expense)}
                                                style={{ fontWeight: "bold" }}
                                            >
                                                Update
                                            </Button>
                                        </td>
                                        <td>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleShowDeleteModal(expense)}
                                                style={{ fontWeight: "bold" }}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>

            {/* Update Modal */}
            <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Expense</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="credit">
                            <Form.Label>Credit</Form.Label>
                            <Form.Control
                                type="text"
                                value={updatedExpense.Credit || ''}
                                onChange={(e) => setUpdatedExpense({ ...updatedExpense, Credit: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="expenseDescription">
                            <Form.Label>Expense Description</Form.Label>
                            <Form.Control
                                type="text"
                                value={updatedExpense.ExpenseDescription || ''}
                                onChange={(e) => setUpdatedExpense({ ...updatedExpense, ExpenseDescription: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="paidAmount">
                            <Form.Label>Paid Amount</Form.Label>
                            <Form.Control
                                type="number"
                                value={updatedExpense.PaidAmount || ''}
                                onChange={(e) => setUpdatedExpense({ ...updatedExpense, PaidAmount: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdateExpense}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Expense</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this expense?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteExpense}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ExpenseTable;
