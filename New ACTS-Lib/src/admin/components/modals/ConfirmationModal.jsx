import React from 'react';

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded p-8 shadow-lg">
                <p>{message}</p>
                <div className="flex justify-end mt-4">
                    <button onClick={onConfirm} className="bg-green-500 hover:bg-green-700 transition duration-200 text-white rounded px-4 py-2 mr-2">Confirm</button>
                    <button onClick={onCancel} className="bg-red-500 hover:bg-red-700 transition duration-200 text-white rounded px-4 py-2">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
