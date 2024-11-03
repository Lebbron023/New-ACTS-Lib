import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import ConfirmationModal from './ConfirmationModal';

const EditDeleteModal = ({ item, isOpen, onClose }) => {
    if (!isOpen) return null;

    const [title, setTitle] = useState(item.Title_Name);
    const [author, setAuthor] = useState(item.Author_Name);
    const [type, setType] = useState(item.Type);
    const [copies, setCopies] = useState(item.copies || []);
    const [category, setCategory] = useState(item.Category);
    const [academicYear, setAcademicYear] = useState(item.Academic_Year);
    const [course, setCourse] = useState(item.Course);
    const [isEditable, setIsEditable] = useState(false);
    const [selectedCopyId, setSelectedCopyId] = useState(null);
    const [originalValues, setOriginalValues] = useState({});
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const textareaRef = useRef(null);

    useEffect(() => {
        setTitle(item.Title_Name);
        setAuthor(item.Author_Name);
        setType(item.Type);
        setCopies(item.copies || []);
        setCategory(item.Category);
        setAcademicYear(item.Academic_Year);
        setCourse(item.Course);
    }, [item]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Reset the height
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [title]);

    const availableCopiesCount = copies.filter(copy => copy.status === "Available").length;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleEditClick = (copyId) => {
        setSelectedCopyId(copyId);
        setIsEditable(true);

        const selectedCopy = copies.find(copy => copy.id === copyId);
        setOriginalValues({
            title,
            author,
            type,
            academicYear,
            course,
            status: selectedCopy.status,
        });
    };

    const handleSave = () => {
        setIsConfirmationOpen(true);
    };

    const handleDelete = (copyId) => {
        setSelectedCopyId(copyId);
        setIsDeleting(true);
        setIsConfirmationOpen(true);
    };

    const confirmEdit = async () => {
        const updatedCopyData = {
            id: selectedCopyId,
            title,
            author,
            type,
            academicYear,
            course,
            status: copies.find(copy => copy.id === selectedCopyId).status,
        };

        try {
            const response = await fetch(`http://localhost/acts/api.php`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedCopyData),
            });

            if (!response.ok) throw new Error('Failed to update the copy');
            toast.success('Record successfully updated!');
            setCopies(prevCopies =>
                prevCopies.map(copy =>
                    copy.id === updatedCopyData.id ? { ...copy, ...updatedCopyData } : copy
                )
            );
        } catch (error) {
            console.error('Error updating copy:', error);
        }

        setIsConfirmationOpen(false);
        setIsEditable(false);
        setSelectedCopyId(null);
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(`http://localhost/acts/api.php`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: selectedCopyId }),
            });

            if (!response.ok) throw new Error('Failed to delete the copy');
            toast.success('Copy deleted successfully!');
            setCopies(prevCopies => prevCopies.filter(copy => copy.id !== selectedCopyId));
        } catch (error) {
            console.error('Error deleting copy:', error);
        }

        setIsConfirmationOpen(false);
        setIsDeleting(false);
        setSelectedCopyId(null);
    };

    const handleStatusChange = (newStatus) => {
        if (selectedCopyId) {
            const updatedCopies = copies.map(copy =>
                copy.id === selectedCopyId ? { ...copy, status: newStatus } : copy
            );
            setCopies(updatedCopies);
        }
    };

    const cancelAction = () => {
        setIsConfirmationOpen(false);
        setSelectedCopyId(null);
        setIsDeleting(false);
        setIsEditable(false);
        if (isEditable) {
            setTitle(originalValues.title);
            setAuthor(originalValues.author);
            setType(originalValues.type);
            setAcademicYear(originalValues.academicYear);
            setCourse(originalValues.course);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            onClick={handleOverlayClick}
        >
            <div className="bg-white rounded p-8 shadow-lg w-full max-w-4xl">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            {category === "Academic Papers" ? "Academic Paper Details" : "Book Details"}
                        </h3>
                        <div className="mb-4 flex items-center">
                            <label className="block text-gray-700 font-medium w-1/3">Title:</label>
                            <textarea
                                ref={textareaRef}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className={`border rounded p-2 w-2/3 resize-none focus:outline-none ${isEditable ? 'border-gray-300 focus:ring-2 focus:ring-blue-400' : 'border-transparent'}`}
                                rows="1"
                                style={{ minHeight: '3rem' }}
                                readOnly={!isEditable}
                            />
                        </div>
                        <div className="mb-4 flex items-center">
                            <label className="block text-gray-700 font-medium w-1/3">Author:</label>
                            <input
                                type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                className={`border rounded p-2 w-2/3 focus:outline-none ${isEditable ? 'border-gray-300 focus:ring-2 focus:ring-blue-400' : 'border-transparent'}`}
                                readOnly={!isEditable}
                            />
                        </div>
                        <div className="mb-4 flex items-center">
                            <label className="block text-gray-700 font-medium w-1/3">Type:</label>
                            <input
                                type="text"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className={`border rounded p-2 w-2/3 focus:outline-none ${isEditable ? 'border-gray-300 focus:ring-2 focus:ring-blue-400' : 'border-transparent'}`}
                                readOnly={!isEditable}
                            />
                        </div>

                        {category === "Academic Papers" && (
                            <>
                                <div className="mb-4 flex items-center">
                                    <label className="block text-gray-700 font-medium w-1/3">Academic Year:</label>
                                    <input
                                        type="date"
                                        value={academicYear}
                                        onChange={(e) => setAcademicYear(e.target.value)}
                                        className={`border rounded p-2 w-2/3 focus:outline-none ${isEditable ? 'border-gray-300 focus:ring-2 focus:ring-blue-400' : 'border-transparent'}`}
                                        readOnly={!isEditable}
                                    />
                                </div>
                                <div className="mb-4 flex items-center">
                                    <label className="block text-gray-700 font-medium w-1/3">Course:</label>
                                    <input
                                        type="text"
                                        value={course}
                                        onChange={(e) => setCourse(e.target.value)}
                                        className={`border rounded p-2 w-2/3 focus:outline-none ${isEditable ? 'border-gray-300 focus:ring-2 focus:ring-blue-400' : 'border-transparent'}`}
                                        readOnly={!isEditable}
                                    />
                                </div>
                            </>
                        )}

                        {isEditable && (
                            <div className="mb-4 flex items-center">
                                <label className="block text-gray-700 font-medium w-1/3">Status:</label>
                                <select
                                    value={copies.find(copy => copy.id === selectedCopyId)?.status || ""}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    className={`border rounded p-2 w-2/3 focus:outline-none ${isEditable ? 'border-gray-300 focus:ring-2 focus:ring-blue-400' : 'border-transparent'}`}
                                    disabled={!isEditable}
                                >
                                    <option value="Available">Available</option>
                                    <option value="Checked Out">Checked Out</option>
                                </select>
                            </div>
                        )}

                        <p className="mt-2 text-gray-600">
                            <strong>Available Copies:</strong> <span className="font-semibold">{availableCopiesCount}</span> / <span className="font-semibold">{copies.length}</span>
                        </p>
                    </div>
                    <div className="overflow-y-auto max-h-60 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                        <strong className="text-gray-700">Copy Details:</strong>
                        {copies && copies.length > 0 ? (
                            copies.map((copy, index) => (
                                selectedCopyId === copy.id ? (
                                    <div key={copy.id} className={`mb-4 flex items-center justify-between`}>
                                        <div>
                                            <p className="font-medium mt-4">Copy {index + 1}:</p>
                                            <p>
                                                <span>Book ID Number: <span className="font-semibold">{copy.id}</span></span><br />
                                                <span>Status: <span className="font-semibold">{copy.status}</span></span>
                                            </p>
                                        </div>
                                    </div>
                                ) : null
                            ))
                        ) : (
                            <p className="text-gray-500">No copies available.</p>
                        )}
                        {copies && copies.length > 0 && !isEditable && (
                            copies.map((copy, index) => (
                                <div key={copy.id} className={`mb-4 flex items-center justify-between`}>
                                    <div>
                                        <p className="font-medium mt-4">Copy {index + 1}:</p>
                                        <p>
                                            <span>Book ID Number: <span className="font-semibold">{copy.id}</span></span><br />
                                            <span>Status: <span className="font-semibold">{copy.status}</span></span>
                                        </p>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => handleEditClick(copy.id)}
                                            className="ml-4 bg-blue-500 text-white rounded w-20 px-2 py-1 text-sm hover:bg-blue-700 transition duration-200"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(copy.id)}
                                            className="ml-4 bg-red-500 text-white rounded w-20 px-2 py-1 text-sm hover:bg-red-700 transition duration-200"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                {isEditable && (
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleSave}
                            className="bg-green-500 text-white rounded w-20 px-2 py-1 text-sm hover:bg-green-700 transition duration-200 mr-2"
                        >
                            Save
                        </button>
                        <button
                            onClick={cancelAction}
                            className="bg-red-500 text-white rounded w-20 px-2 py-1 text-sm hover:bg-red-700 transition duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={isConfirmationOpen}
                onConfirm={isDeleting ? confirmDelete : confirmEdit}
                onCancel={cancelAction}
                message={`Are you sure you want to ${isDeleting ? 'delete' : 'edit'} this copy?`}
            />
        </div>
    );
};

export default EditDeleteModal;
