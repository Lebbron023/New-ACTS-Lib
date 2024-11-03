import { useState } from "react";

function BorrowModal({ isOpen, onClose }) {
    const [borrowerName, setBorrowerName] = useState("");
    const [itemId, setItemId] = useState("");
    const [studentNumber, setStudentNumber] = useState("");
    const [borrowerDetails, setBorrowerDetails] = useState(null);
    const [itemDetails, setItemDetails] = useState(null);
    const [borrowerError, setBorrowerError] = useState(""); // State for borrower error
    const [itemError, setItemError] = useState(""); // State for item error

    const fetchBorrowerDetails = async (number) => {
        try {
            const response = await fetch(`http://localhost/acts/api.php?studentNumber=${number}`);
            if (!response.ok) throw new Error('Borrower not found');
            const data = await response.json();
            setBorrowerDetails(data);
            setBorrowerError(""); // Clear borrower error if valid response
        } catch (err) {
            setBorrowerError(err.message);
            setBorrowerDetails(null);
        }
    };

    const fetchItemDetails = async (id) => {
        try {
            const response = await fetch(`http://localhost/acts/api.php?ID=${id}`);
            if (!response.ok) throw new Error('Item not found');
            const data = await response.json();
            setItemDetails(data);
            setItemError(""); // Clear item error if valid response
        } catch (err) {
            setItemError(err.message);
            setItemDetails(null);
        }
    };

    const handleStudentNumberChange = (e) => {
        const number = e.target.value;
        setStudentNumber(number);
        if (number) {
            fetchBorrowerDetails(number);
        } else {
            setBorrowerDetails(null);
            setBorrowerError(""); // Clear error when input is empty
        }
    };

    const handleItemIdChange = (e) => {
        const id = e.target.value;
        setItemId(id);
        if (id) {
            fetchItemDetails(id);
        } else {
            setItemDetails(null);
            setItemError(""); // Clear error when input is empty
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const borrowData = {
            studentNumber: studentNumber,
            recordId: recordId,
            borrowedDate: getCurrentDate(), 
            returnDate: returnDate,
            state: state,
            note: note,
        };
    
        try {
            const response = await fetch('http://localhost/acts/api.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(borrowData),
            });
    
            if (!response.ok) {
                throw new Error('Failed to submit borrow request');
            }
    
            const result = await response.json();
            console.log('Borrow request successful:', result);
            onClose();
        } catch (err) {
            console.error(err.message);
        }
    };
    


    const handleClose = () => {
        // Reset all fields when closing the modal
        setBorrowerName("");
        setItemId("");
        setStudentNumber("");
        setBorrowerDetails(null);
        setItemDetails(null);
        setBorrowerError("");
        setItemError("");
        onClose(); // Call the original onClose
    };

    // Function to get the current date
    const getCurrentDate = () => {
        const date = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded shadow-lg p-6 w-11/12 md:w-1/2">
                <h2 className="text-xl font-semibold mb-4">Borrow Item</h2>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="flex justify-between mb-4">
                        <div className="w-1/2 mr-2">
                            {borrowerError && <p className="text-red-500">{borrowerError}</p>} {/* Borrower error display */}
                            <label className="block mb-2 font-semibold">Borrower's Student Number:</label>
                            <input
                                type="text"
                                className="border p-2 w-full mb-4"
                                placeholder="Enter Student Number"
                                value={studentNumber}
                                onChange={handleStudentNumberChange}
                            />
                            {borrowerDetails && (
                                <div>
                                    <h3 className="font-semibold">Borrower Details:</h3>
                                    <div className="mb-4 p-2 border rounded bg-gray-100">
                                        <p>Name: {borrowerDetails.Name}</p>
                                        <p>Course: {borrowerDetails.Course}</p>
                                        <p>Year & Section: {borrowerDetails.Year_And_Section}</p>
                                        <p>Email: {borrowerDetails.Email}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="w-1/2 ml-2">
                            {itemError && <p className="text-red-500">{itemError}</p>} {/* Item error display */}
                            <label className="block mb-2 font-semibold">Item ID:</label>
                            <input
                                type="text"
                                className="border p-2 w-full mb-4"
                                placeholder="Enter Item ID"
                                value={itemId}
                                onChange={handleItemIdChange}
                            />
                            {itemDetails && (
                                <div>
                                    <h3 className="font-semibold">Item Details:</h3>
                                    <div className="mb-4 p-2 border rounded bg-gray-100">
                                        <p>Title:  {itemDetails.Title_Name}</p>
                                        <p>Author:  {itemDetails.Author_Name}</p>
                                        <p>Type:  {itemDetails.Type}</p>
                                        <p>Category:  {itemDetails.Category}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <p>
                        <span className="font-semibold">Borrow Date: </span> {getCurrentDate()}
                    </p>
                    <p>
                        <span className="font-semibold">Return Date: </span> 
                    </p>
                    <div className="flex justify-end mt-auto">
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 mr-2"
                        >
                            Submit
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 mr-2"
                            onClick={handleClose}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BorrowModal;
