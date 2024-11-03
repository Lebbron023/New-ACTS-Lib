import React, { useState, useEffect } from 'react';

// Functional component to display data
function DisplayData() {
    // State variables to manage search term, data, loading state, error messages, and selected types
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTypes, setSelectedTypes] = useState(new Set());

    // Checkbox options for book categories and paper categories
    const bookCheckboxes = ['Computer Related', 'Business and Management', 'Social Science'];
    const paperCheckboxes = ['Thesis', 'Capstone', 'Practicum', 'Research Paper', 'Position Paper', 'Technical Research', 'Business Plan Implementation'];

    // useEffect hook to fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost/acts/api.php');
                if (!response.ok) throw new Error('Network response was not ok');
                const result = await response.json();

                // Combine book and academic paper data
                const combinedData = [...result.books, ...result.academic_papers];

                // Count available copies
                const countedBooks = combinedData.reduce((acc, book) => {
                    const key = `${book.Title_Name}|${book.Author_Name}|${book.Type}`;
                    if (!acc[key]) {
                        acc[key] = { ...book, Available_Copies: book.Status === 'Available' ? 1 : 0, copies: [] };
                    } else {
                        if (book.Status === 'Available') {
                            acc[key].Available_Copies += 1;
                        }
                    }
                    acc[key].copies.push({ id: book.ID, status: book.Status });
                    return acc;
                }, {});

                setData(Object.values(countedBooks)); // Convert back to array
            } catch (error) {
                console.error('Fetch error:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData(); // Call fetchData on component mount
    }, []);

    // Handle input change for search term
    const handleInputChange = (e) => {
        setSearchTerm(e.target.value); // Update search term state
    };

    // Handle changes in type selection (radio or checkbox)
    const handleTypeChange = (e) => {
        const type = e.target.value; // Get the value of the selected type
        if (e.target.type === 'radio') {
            // If it's a radio button, reset the selected types to only this one
            setSelectedTypes(new Set([type]));
        } else {
            // For checkboxes, toggle the selected type
            setSelectedTypes((prev) => {
                const newSelectedTypes = new Set(prev);
                newSelectedTypes.has(type) ? newSelectedTypes.delete(type) : newSelectedTypes.add(type);
                return newSelectedTypes; // Return the updated set of selected types
            });
        }
    };

    // Filter data based on search term and selected types
    const filteredData = data.filter(item => {
        const matchesSearch =
            item.Title_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.Author_Name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedTypes.size === 0 || selectedTypes.has(item.Type);
        return matchesSearch && matchesType; // Return true if both conditions match
    });

    // Determine what data to display
    let displayData = filteredData;

    // If only one type is selected that is not a checkbox type, show a maximum of 10 items
    if (selectedTypes.size === 1 && !Array.from(selectedTypes).some(type => bookCheckboxes.includes(type) || paperCheckboxes.includes(type))) {
        displayData = filteredData.slice(0, 10); // Get the first 10 items
    }

    // Sort data based on the order of selected types
    const sortedData = displayData.sort((a, b) => {
        const aIndex = Array.from(selectedTypes).indexOf(a.Type);
        const bIndex = Array.from(selectedTypes).indexOf(b.Type);
        if (aIndex === -1 && bIndex === -1) return 0; // If neither is selected, maintain order
        if (aIndex === -1) return 1; // Move unselected types to the end
        if (bIndex === -1) return -1;
        return aIndex - bIndex; // Sort by index of type
    });
    console.log(sortedData);

    // Loading state
    if (loading) return <div className="text-center py-4">Loading...</div>;

    // Error state
    if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;

    // Render the component UI
    return (
        <div className="flex container mx-auto mt-4 mb-10">
            {/* Sidebar for selecting categories */}
            <div className="flex flex-col w-1/5 bg-green-400 p-4 border h-[86vh]">
                <h3 className="text-black font-semibold mb-2">Select Category Types:</h3>

                {/* Radio button for "Books" */}
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
                {/* Conditional rendering of checkboxes for books */}
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

                {/* Radio button for "Academic Papers" */}
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
                {/* Conditional rendering of checkboxes for academic papers */}
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
            {/* Main content area for search and data display */}
            <div className="flex-1 ml-4">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2 mb-4 w-full"
                    aria-label="Search Books"
                />
                {/* Display sorted data or a message if no data is available */}
                {sortedData.length > 0 ? (
                    <div className="overflow-auto h-[77vh]">
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md" aria-labelledby="book-table">
                            <caption id="book-table" className="sr-only">
                                Table of {selectedTypes.has("Academic Papers") ? "Academic Papers" : "Books"}
                            </caption>
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="w-12 py-2 px-4 border-b sticky top-0 bg-gray-200 z-10">No.</th>
                                    <th className="w-64 py-2 px-4 border-b sticky top-0 bg-gray-200 z-10">Title</th>
                                    <th className="w-40 py-2 px-4 border-b sticky top-0 bg-gray-200 z-10">Author</th>
                                    {selectedTypes.has("Academic Papers") && (
                                        <>
                                            <th className="w-32 py-2 px-4 border-b sticky top-0 bg-gray-200 z-10">Academic Year</th>
                                            <th className="w-48 py-2 px-4 border-b sticky top-0 bg-gray-200 z-10">Course</th>
                                        </>
                                    )}
                                    <th className="w-48 py-2 px-4 border-b sticky top-0 bg-gray-200 z-10">Type</th>
                                    <th className="w-32 py-2 px-4 border-b sticky top-0 bg-gray-200 z-10">Avaliability</th>

                                </tr>
                            </thead>
                            <tbody>
                                {sortedData.map((item, index) => (
                                    <tr key={`${item.ID}-${index}`} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b text-sm">{index + 1}</td>
                                        <td className="py-2 px-4 border-b text-sm">{item.Title_Name}</td>
                                        <td className="py-2 px-4 border-b text-sm">{item.Author_Name}</td>
                                        {selectedTypes.has("Academic Papers") && (
                                            <>
                                                <td className="py-2 px-4 border-b text-sm">{item.Academic_Year}</td>
                                                <td className="py-2 px-4 border-b text-sm">{item.Course}</td>
                                            </>
                                        )}
                                        <td className="py-2 px-4 border-b text-sm">{item.Type}</td>
                                        <td className="py-2 px-4 border-b text-sm">
                                            {`${item.Available_Copies}/${item.copies.length} Copies Available`}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-4">No data available</div>
                )}
            </div>
        </div>
    );
}

export default DisplayData; // Export the DisplayData component for use in other files
