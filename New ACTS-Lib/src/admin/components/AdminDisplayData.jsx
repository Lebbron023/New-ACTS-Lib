import React, { useState, useEffect, useMemo } from 'react';
import AddNewRecordModal from './modals/AddNewRecordModal';
import EditDeleteModal from './modals/EditDeleteModal';
import ToastNotifications from './ToasterNotification';
import { toast } from 'react-toastify';


function AdminDisplayData() {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTypes, setSelectedTypes] = useState(new Set());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const [bookCheckboxes, setBookCheckboxes] = useState([]); // State for distinct book types
    const [paperCheckboxes, setPaperCheckboxes] = useState([]); // State for distinct paper types

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost/acts/api.php');
            if (!response.ok) throw new Error('Network response was not ok');
            const result = await response.json();

            // Set distinct types for books and academic papers
            setBookCheckboxes(result.types_books);
            setPaperCheckboxes(result.types_academic_papers);

            const combinedData = [...result.books, ...result.academic_papers];
            const countedBooks = combinedData.reduce((acc, book) => {
                const key = `${book.Title_Name}|${book.Author_Name}|${book.Type}`;
                if (!acc[key]) {
                    acc[key] = { ...book, Available_Copies: book.Status === 'Available' ? 1 : 0, copies: [{ id: book.ID, status: book.Status }] };
                } else {
                    if (book.Status === 'Available') {
                        acc[key].Available_Copies += 1;
                    }
                    acc[key].copies.push({ id: book.ID, status: book.Status });
                }
                return acc;
            }, {});

            setData(Object.values(countedBooks));
        } catch (error) {
            console.error('Fetch error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleTypeChange = (e) => {
        const type = e.target.value;
        if (e.target.type === 'radio') {
            setSelectedTypes(new Set([type]));
        } else {
            setSelectedTypes((prev) => {
                const newSelectedTypes = new Set(prev);
                newSelectedTypes.has(type) ? newSelectedTypes.delete(type) : newSelectedTypes.add(type);
                return newSelectedTypes;
            });
        }
    };

    const filteredData = useMemo(() => {
        return data.filter(item => {
            const title = item.Title_Name || '';
            const author = item.Author_Name || '';
            const id = item.ID ? item.ID.toString() : ''; // Ensure ID is a string
            const matchesSearch =
                title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                id.includes(searchTerm); // Check for ID as well
            const matchesType = selectedTypes.size === 0 || selectedTypes.has(item.Type);
            return matchesSearch && matchesType;
        });
    }, [data, searchTerm, selectedTypes]);

    let displayData = filteredData;

    if (selectedTypes.size === 1 && !Array.from(selectedTypes).some(type => bookCheckboxes.includes(type) || paperCheckboxes.includes(type))) {
        displayData = filteredData.slice(0, 10);
    }

    const sortedData = displayData.sort((a, b) => {
        const aIndex = Array.from(selectedTypes).indexOf(a.Type);
        const bIndex = Array.from(selectedTypes).indexOf(b.Type);
        if (aIndex === -1 && bIndex === -1) return 0;
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
    });

    if (loading) return <div className="text-center py-4">Loading...</div>;
    if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;

    const handleAddNewRecord = (newRecord) => {
        setData((prevData) => [...prevData, newRecord]);
        toast.success('Record successfully added!');
        setIsModalOpen(false);
    };

    const handleView = (item) => {
        setSelectedItem(item);
        setIsViewModalOpen(true);
    };

    return (
        <div className="flex container mx-auto mt-4 mb-10">
            <div className="flex flex-col w-1/5 bg-green-400 p-4 max-h-screen">
                <h3 className="text-black font-semibold mb-2">Select Category Types:</h3>
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

            <div className="flex-1 ml-4">
                <div className="flex items-center mb-4">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded p-2 w-full mr-2"
                        aria-label="Search Books"
                    />
                    <input
                        type='button'
                        value="Add New Record"
                        onClick={() => setIsModalOpen(true)}
                        className="bg-yellow-400 text-white rounded px-4 py-2 hover:bg-yellow-800"
                    />
                </div>

                {sortedData.length > 0 ? (
                    <div className="overflow-auto h-screen">
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md" aria-labelledby="book-table">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="w-12 py-2 px-4 border-b sticky top-0 bg-gray-200 text-center">No.</th>
                                    <th className="w-96 py-2 px-4 border-b sticky top-0 bg-gray-200 text-center">Title</th>
                                    <th className="w-72 py-2 px-4 border-b sticky top-0 bg-gray-200 text-center">Author</th>
                                    {selectedTypes.has("Academic Papers") && (
                                        <>
                                            <th className="w-32 py-2 px-4 border-b sticky top-0 bg-gray-200 text-center">Academic Year</th>
                                            <th className="w-48 py-2 px-4 border-b sticky top-0 bg-gray-200 text-center">Course</th>
                                        </>
                                    )}
                                    <th className="w-56 py-2 px-4 border-b sticky top-0 bg-gray-200 text-center">Type</th>
                                    <th className="w-60 py-2 border-b sticky top-0 bg-gray-200 text-center">Availability</th>
                                    <th className="w-auto border-b sticky top-0 bg-gray-200 py-2 px-4"></th>
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
                                        <td className="py-2 border-b text-sm">
                                            {item.Available_Copies}/{item.copies ? item.copies.length : 0} Copies Available
                                        </td>
                                        <td className="py-2 border-b text-sm">
                                            <button
                                                onClick={() => handleView(item)}
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
                    <div className="text-center py-4">No records found.</div>
                )}
            </div>

            {/* Add New Record Modal */}
            <AddNewRecordModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddNewRecord}
            />

            {/* View/Edit Item Modal */}
            {isViewModalOpen && selectedItem && (
                <EditDeleteModal
                    item={selectedItem}
                    isOpen={isViewModalOpen}
                    onClose={() => setIsViewModalOpen(false)}
                // onFetchData={fetchData}   // Uncomment if needed for data refresh
                />
            )}

            {/* Include Toast Notifications Component */}
            <ToastNotifications />
        </div>
    );
}

export default AdminDisplayData;
