import React, { useState } from 'react';

const AddNewRecordModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        author: '',
        title: '',
        category: '',
        idNumber: '',
        status: '',
        academicYear: '',
        course: '',
        type: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const newRecord = {
            action: 'create',
            ID_Number: formData.idNumber,
            Author_Name: formData.author,
            Title_Name: formData.title,
            Type: formData.type,
            Status: "Available",
            Category: formData.category,
        };

        if (formData.category === "Academic Papers") {
            newRecord.Academic_Year = formData.academicYear;
            newRecord.Course = formData.course;
            newRecord.Paper_Type = formData.type;
        } else if (formData.category === "Books") {
            newRecord.Book_Type = formData.type;
        }

        console.log('Submitting:', newRecord); // Debugging log

        try {
            const response = await fetch('http://localhost/acts/api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRecord),
            });

            const result = await response.json();

            if (response.ok) {
                onAdd(result);
                resetForm();
            } else {
                setError(result.error || 'Failed to add record.');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            author: '',
            title: '',
            category: '',
            idNumber: '',
            status: '',
            academicYear: '',
            course: '',
            type: ''
        });
        onClose();
    };

    if (!isOpen) return null;

    const modalSizeClass = formData.category === "Academic Papers" ? "w-[900px]" : "w-[600px]";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className={`bg-white rounded p-6 ${modalSizeClass}`}>
                <h2 className="text-xl mb-4">Add New Record</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <div className="mb-4 col-span-2">
                        <label className="block mb-1">Category:</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="border border-gray-300 rounded p-2 w-full"
                            required
                        >
                            <option value="" disabled>Please select category of new record</option>
                            <option value="Books">Books</option>
                            <option value="Academic Papers">Academic Papers</option>
                        </select>
                    </div>

                    {formData.category && (
                        <>
                            <div className="mb-4">
                                <label className="block mb-1">ID Number:</label>
                                <input
                                    type="number"
                                    name="idNumber"
                                    value={formData.idNumber}
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-300 rounded p-2 w-full"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block mb-1">Title:</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-300 rounded p-2 w-full"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block mb-1">Author:</label>
                                <input
                                    type="text"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-300 rounded p-2 w-full"
                                />
                            </div>

                            {formData.category === "Academic Papers" && (
                                <>
                                    <div className="mb-4">
                                        <label className="block mb-1">Academic Year:</label>
                                        <input
                                            type="date"
                                            name="academicYear"
                                            value={formData.academicYear}
                                            onChange={handleChange}
                                            required
                                            className="border border-gray-300 rounded p-2 w-full"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-1">Course:</label>
                                        <input
                                            type="text"
                                            name="course"
                                            value={formData.course}
                                            onChange={handleChange}
                                            required
                                            className="border border-gray-300 rounded p-2 w-full"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-1">Type:</label>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleChange}
                                            required
                                            className="border border-gray-300 rounded p-2 w-full"
                                        >
                                            <option value="" disabled>Please select type</option>
                                            <option value="Thesis">Thesis</option>
                                            <option value="Capstone">Capstone</option>
                                            <option value="Practicum">Practicum</option>
                                            <option value="Research Paper">Research Paper</option>
                                            <option value="Position Paper">Position Paper</option>
                                            <option value="Technical Research">Technical Research</option>
                                            <option value="Business Plan Implementation">Business Plan Implementation</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            {formData.category === "Books" && (
                                <div className="mb-4">
                                    <label className="block mb-1">Type:</label>
                                    <input
                                        type="text"
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        required
                                        className="border border-gray-300 rounded p-2 w-full"
                                    />
                                </div>
                            )}
                        </>
                    )}

                    <div className="flex justify-end col-span-2 mt-4">
                        <button
                            type="submit"
                            className={`bg-blue-500 text-white rounded px-4 py-2 w-32 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Adding...' : 'Add'}
                        </button>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="bg-red-500 text-white rounded px-4 py-2 w-32 ml-2"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddNewRecordModal;
