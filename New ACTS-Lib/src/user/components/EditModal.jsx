import React, { useState, useEffect } from 'react';

function EditModal({ isOpen, closeModal, data, onUpdate }) {
    const [formData, setFormData] = useState({
        ID: '',
        Author_Name: '',
        Title_Name: '',
        Academic_Year: ''
    });

    useEffect(() => {
        if (data) {
            setFormData({
                ID: data.ID || '',
                Author_Name: data.Author_Name || '',
                Title_Name: data.Title_Name || '',
                Academic_Year: data.Academic_Year || ''
            });
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost/acts/api.php?ID=${formData.ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Author_Name: formData.Author_Name,
                    Title_Name: formData.Title_Name,
                    Academic_Year: formData.Academic_Year
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to update data');
            }

            // Call onUpdate with the updated data
            onUpdate({
                ID: formData.ID,
                Author_Name: formData.Author_Name,
                Title_Name: formData.Title_Name,
                Academic_Year: formData.Academic_Year
            });

            alert('Data updated successfully!');
            closeModal();

        } catch (error) {
            console.error('Error updating data:', error);
            alert('Error updating data: ' + error.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal fixed inset-0 flex items-center justify-center z-50">
            <div className="modal-content bg-gray-600 p-6 rounded shadow-lg w-1/3">
                <h2 className="text-lg font-bold mb-4 text-white">Edit Data</h2>
                <form onSubmit={handleSubmit} className="text-white">
                    <div className="mb-4">
                        <label className="block mb-2">Author Name</label>
                        <input
                            type="text"
                            name="Author_Name"
                            value={formData.Author_Name}
                            onChange={handleChange}
                            className="modal-input border rounded-md p-2 w-full bg-gray-200"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Title Name</label>
                        <input
                            type="text"
                            name="Title_Name"
                            value={formData.Title_Name}
                            onChange={handleChange}
                            className="modal-input border rounded-md p-2 w-full bg-gray-200"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Academic Year</label>
                        <input
                            type="text"
                            name="Academic_Year"
                            value={formData.Academic_Year}
                            onChange={handleChange}
                            className="modal-input border rounded-md p-2 w-full bg-gray-200"
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="mr-2 bg-gray-300 text-black rounded px-4 py-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white rounded px-4 py-2"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditModal;
