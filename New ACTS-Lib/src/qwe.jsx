// Import necessary hooks and components from React
import React, { useState, useEffect, useMemo } from 'react';

function AdminDisplayData() {
    // State variables for managing search term, data, loading state, error, selected types, modal visibility, and editable items
    const [searchTerm, setSearchTerm] = useState(''); // Search term for filtering data
    const [data, setData] = useState([]); // Data to be displayed
    const [loading, setLoading] = useState(true); // Loading state for data fetching
    const [error, setError] = useState(null); // Error state for handling fetch errors
    const [selectedTypes, setSelectedTypes] = useState(new Set()); // Set to manage selected item types
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
    const [selectedItem, setSelectedItem] = useState(null); // Currently selected item for viewing/editing
    const [editableItem, setEditableItem] = useState(null); // Item data for editing
    const [editableCopies, setEditableCopies] = useState([]); // Copies of the selected item for editing

    // Arrays defining checkbox options for book and paper categories
    const bookCheckboxes = ['Computer Related', 'Business and Management', 'Social Science'];
    const paperCheckboxes = ['Thesis', 'Capstone', 'Practicum', 'Research Paper', 'Position Paper', 'Technical Research', 'Business Plan Implementation'];

    // Function to fetch data from the API
    const fetchData = async () => {
        setLoading(true); // Set loading state to true
        try {
            // Fetch data from the provided API endpoint
            const response = await fetch('http://localhost/acts/api.php');
            if (!response.ok) throw new Error('Network response was not ok'); // Handle network errors
            const result = await response.json(); // Parse JSON response

            // Combine book and paper data into a single array
            const combinedData = [...result.books, ...result.academic_papers];

            // Process the combined data to count available copies and organize it
            const countedBooks = combinedData.reduce((acc, book) => {
                const key = book.Title_Name; // Use title as key for uniqueness
                if (!acc[key]) {
                    // Initialize entry if it doesn't exist
                    acc[key] = { ...book, Available_Copies: book.Status === 'Available' ? 1 : 0, copies: [] };
                } else {
                    // Increment available copies if the book is available
                    if (book.Status === 'Available') {
                        acc[key].Available_Copies += 1;
                    }
                }
                // Add copy information
                acc[key].copies.push({ id: book.ID, status: book.Status });
                return acc;
            }, {});

            setData(Object.values(countedBooks)); // Update state with processed data
        } catch (error) {
            console.error('Fetch error:', error); // Log any fetch errors
            setError(error.message); // Update error state with error message
        } finally {
            setLoading(false); // Set loading state to false after data fetch attempt
        }
    };

    // useEffect hook to fetch data when the component mounts
    useEffect(() => {
        fetchData();
    }, []);

    // Handler for updating the search term from the input field
    const handleInputChange = (e) => {
        setSearchTerm(e.target.value); // Update search term state
    };

    // Handler for managing type selection (radio/checkbox)
    const handleTypeChange = (e) => {
        const type = e.target.value; // Get the value of the selected type
        if (e.target.type === 'radio') {
            // If it's a radio button, select only this type
            setSelectedTypes(new Set([type]));
        } else {
            // If it's a checkbox, toggle the selection
            setSelectedTypes((prev) => {
                const newSelectedTypes = new Set(prev);
                newSelectedTypes.has(type) ? newSelectedTypes.delete(type) : newSelectedTypes.add(type);
                return newSelectedTypes;
            });
        }
    };

    // Handler for viewing an item in the modal
    const handleView = (item) => {
        setSelectedItem(item); // Set the selected item for viewing
        setEditableItem({ ...item }); // Set editable item for editing
        setEditableCopies(item.copies.map(copy => ({ ...copy }))); // Prepare copies for editing
        setIsModalOpen(true); // Open the modal
    };

    // Handler for editing item fields
    const handleEditItem = (field, value) => {
        setEditableItem((prev) => ({
            ...prev,
            [field]: value, // Update specific field in editable item
        }));
    };

    // Handler for editing the status of item copies
    const handleEditCopy = (index, field, value) => {
        const updatedCopies = [...editableCopies]; // Create a copy of the editable copies
        updatedCopies[index][field] = value; // Update specific field for the copy
        setEditableCopies(updatedCopies); // Update state with modified copies
    };

    // Handler for saving changes made in the modal
    const handleSaveChanges = async () => {
        const updatedItem = { ...editableItem, copies: editableCopies }; // Prepare updated item

        try {
            // Send updated data to the API
            const response = await fetch(`http://localhost/acts/api.php?ID=${updatedItem.ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    Author_Name: updatedItem.Author_Name,
                    Title_Name: updatedItem.Title_Name,
                    Type: updatedItem.Type,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update item'); // Handle failed updates
            }

            const result = await response.json(); // Get updated item data
            console.log("Updated Item:", result);
            setSelectedItem(result); // Update selected item with new data
            setIsModalOpen(false); // Close the modal

            // Refetch data to refresh displayed information
            fetchData();

        } catch (error) {
            console.error("Error updating item:", error); // Log any update errors
            setErrorMessage("Failed to update item. Please try again."); // Update error message
        }
    };

    // Handler for canceling changes in the modal
    const handleCancelChanges = () => {
        setEditableItem({ ...selectedItem }); // Reset to original selected item
        setEditableCopies(selectedItem.copies.map(copy => ({ ...copy }))); // Reset copies
        setIsModalOpen(false); // Close the modal
    };

    // Memoized function to filter data based on search term and selected types
    const filteredData = useMemo(() => {
        return data.filter(item => {
            const matchesSearch = item.Title_Name.toLowerCase().includes(searchTerm.toLowerCase()) || item.Author_Name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = selectedTypes.size === 0 || selectedTypes.has(item.Type);
            return matchesSearch && matchesType; // Return true if matches search and type
        });
    }, [data, searchTerm, selectedTypes]);

    let displayData = filteredData; // Initialize display data with filtered data

    // Limit display data if only one type is selected and it's not in specified checkboxes
    if (selectedTypes.size === 1 && !Array.from(selectedTypes).some(type => bookCheckboxes.includes(type) || paperCheckboxes.includes(type))) {
        displayData = filteredData.slice(0, 10); // Limit results to 10
    }

    // Sort the displayed data based on selected types
    const sortedData = displayData.sort((a, b) => {
        const aIndex = Array.from(selectedTypes).indexOf(a.Type); // Get index of type in selected types
        const bIndex = Array.from(selectedTypes).indexOf(b.Type);
        if (aIndex === -1 && bIndex === -1) return 0; // If neither type is selected
        if (aIndex === -1) return 1; // If a is not selected, b comes first
        if (bIndex === -1) return -1; // If b is not selected, a comes first
        return aIndex - bIndex; // Sort by index
    });

    // Handle loading state
    if (loading) return <div className="text-center py-4">Loading...</div>;

    // Handle error state
    if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;

    // Render the component
    return (
        <div className="flex container mx-auto mt-4 mb-10">
            <div className="flex flex-col w-1/5 bg-green-400 p-4 border h-screen">
                <h3 className="text-black font-semibold mb-2">Select Category Types:</h3>

                {/* Radio button for selecting "Books" category */}
                <label className="flex items-center mb-2">
                    <input
                        type="radio"
                        name="category"
                        value="Books"
                        checked={selectedTypes.has("Books")}
                        onChange={handleTypeChange}
                        className="mr-2"
                    />
                    <span className="text-black">Books</span>
                </label>

                {/* Checkbox options for book types */}
                {selectedTypes.has("Books") && (
                    <div className="ml-4">
                        {bookCheckboxes.map(checkbox => (
                            <label key={checkbox} className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    value={checkbox}
                                    checked={selectedTypes.has(checkbox)}
                                    onChange={handleTypeChange}
                                    className="mr-2"
                                />
                                <span className="text-black">{checkbox}</span>
                            </label>
                        ))}
                    </div>
                )}

                {/* Radio button for selecting "Academic Papers" category */}
                <label className="flex items-center mb-2">
                    <input
                        type="radio"
                        name="category"
                        value="Academic Papers"
                        checked={selectedTypes.has("Academic Papers")}
                        onChange={handleTypeChange}
                        className="mr-2"
                    />
                    <span className="text-black">Academic Papers</span>
                </label>

                {/* Checkbox options for paper types */}
                {selectedTypes.has("Academic Papers") && (
                    <div className="ml-4">
                        {paperCheckboxes.map(checkbox => (
                            <label key={checkbox} className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    value={checkbox}
                                    checked={selectedTypes.has(checkbox)}
                                    onChange={handleTypeChange}
                                    className="mr-2"
                                />
                                <span className="text-black">{checkbox}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Search input and data display section */}
            <div className="flex-1 ml-4">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2 mb-4 w-full"
                    aria-label="Search Books"
                />
                {sortedData.length > 0 ? (
                    <div className="overflow-auto max-h-screen">
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md" aria-labelledby="book-table">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="w-12 py-2 px-4 border-b sticky top-0 bg-gray-200 z-10 text-center">No.</th>
                                    <th className="w-72 py-2 px-4 border-b sticky top-0 bg-gray-200 z-10 text-center">Author</th>
                                    <th className="w-96 py-2 px-4 border-b sticky top-0 bg-gray-200 z-10 text-center">Title</th>
                                    {selectedTypes.has("Academic Papers") && (
                                        <>
                                            <th className="w-32 py-2 px-4 border-b sticky top-0 bg-gray-200 z-10 text-center">Academic Year</th>
                                            <th className="w-48 py-2 px-4 border-b sticky top-0 bg-gray-200 z-10 text-center">Course</th>
                                        </>
                                    )}
                                    <th className="w-56 py-2 px-4 border-b sticky top-0 bg-gray-200 z-10 text-center">Type</th>
                                    <th className="w-60 py-2 border-b text-sm">Availability</th>
                                    <th className="w-auto border-b sticky top-0 bg-gray-200 z-10 py-2 px-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedData.map((item, index) => (
                                    <tr key={`${item.ID}-${index}`} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b text-sm">{index + 1}</td>
                                        <td className="py-2 px-4 border-b text-sm">{item.Author_Name}</td>
                                        <td className="py-2 px-4 border-b text-sm">{item.Title_Name}</td>
                                        {selectedTypes.has("Academic Papers") && (
                                            <>
                                                <td className="py-2 px-4 border-b text-sm">{item.Academic_Year}</td>
                                                <td className="py-2 px-4 border-b text-sm">{item.Course}</td>
                                            </>
                                        )}
                                        <td className="py-2 px-4 border-b text-sm">{item.Type}</td>
                                        <td className="py-2 border-b text-sm">
                                            {item.Available_Copies === 0
                                                ? "No Copy Available"
                                                : item.Available_Copies === 1
                                                    ? "1 Copy Available"
                                                    : `${item.Available_Copies} Copies Available`}
                                        </td>
                                        <td className="py-2 border-b text-sm">
                                            <button
                                                onClick={() => handleView(item)} // Open modal to view/edit item
                                                className="bg-blue-500 text-white rounded px-2 py-1 hover:bg-blue-900 mr-2"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-4">No data found</div> // Message for no results
                )}
            </div>

            {/* Modal for viewing and editing detailed info */}
            {isModalOpen && editableItem && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-75">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 h-3/4 flex relative">
                        <div className="flex-1 p-4">
                            <h2 className="text-xl font-semibold mb-4">Book Details</h2>

                            {/* Editable input for Title */}
                            <div className="mb-4">
                                <label className="block mb-1">Title:</label>
                                <input
                                    type="text"
                                    value={editableItem.Title_Name}
                                    onChange={(e) => handleEditItem('Title_Name', e.target.value)} // Update title
                                    className="border p-2 rounded w-full"
                                />
                            </div>

                            {/* Editable input for Author */}
                            <div className="mb-4">
                                <label className="block mb-1">Author:</label>
                                <input
                                    type="text"
                                    value={editableItem.Author_Name}
                                    onChange={(e) => handleEditItem('Author_Name', e.target.value)} // Update author
                                    className="border p-2 rounded w-full"
                                />
                            </div>

                            {/* Editable input for Type */}
                            <div className="mb-4">
                                <label className="block mb-1">Type:</label>
                                <input
                                    type="text"
                                    value={editableItem.Type}
                                    onChange={(e) => handleEditItem('Type', e.target.value)} // Update type
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                        </div>

                        <div className="flex-1 p-4">
                            <h3 className="mt-4 text-lg font-semibold">Copy Details:</h3>
                            {editableCopies.map((copy, index) => (
                                <div key={copy.id} className="mt-4 flex justify-between items-center border-b pb-4">
                                    <div className="flex-1">
                                        <p><strong>Copy {index + 1} </strong></p>
                                        <p>ID: {copy.id}</p>
                                        <div className="flex items-center">
                                            <label className="mr-2">Status:</label>
                                            <select
                                                value={copy.status} // Current status of the copy
                                                onChange={(e) => handleEditCopy(index, 'status', e.target.value)} // Update copy status
                                                className="border p-1 rounded"
                                            >
                                                <option value="Available">Available</option>
                                                <option value="Checked Out">Checked Out</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Delete Button for Each Copy */}
                                    <button
                                        onClick={() => handleDeleteCopy(copy.id)} // Handle deletion of the copy
                                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-500 transition-all"
                                    >
                                        Delete Copy
                                    </button>
                                </div>
                            ))}

                            {/* Save and Cancel Buttons at the bottom right */}
                            <div className="absolute bottom-4 right-4 flex space-x-2">
                                {/* Cancel Button with Red Background */}
                                <button
                                    onClick={handleCancelChanges} // Reset changes and close modal
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400"
                                >
                                    Cancel
                                </button>

                                {/* Save Button with Green Background */}
                                <button
                                    onClick={handleSaveChanges} // Save changes and close modal
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Export the component for use in other parts of the application
export default AdminDisplayData;
