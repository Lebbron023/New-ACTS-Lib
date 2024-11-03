import { useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import BorrowModal from "../components/modals/transactionModals/borrowModal";
import TransactionTable from "../components/modals/Activities Table/TransactionsTable";
import ActivitiesTable from "../components/modals/Activities Table/ActivitiesTable";

function AdminActivities() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div>
            <AdminNavbar />

            <div className="container mx-auto mt-4">
                <h1 className="text-2xl font-bold text-center mb-6">Manage Transactions</h1>
                <div className="flex justify-center mt-4 space-x-4">
                    <button
                        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
                        onClick={openModal}
                        aria-label="Borrow Item"
                    >
                        Borrow Item
                    </button>

                    <button
                        className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 transition"
                        aria-label="Return Item"
                    >
                        Return Item
                    </button>
                </div>
            </div>


             <TransactionTable></TransactionTable> 


            <ActivitiesTable />

            <BorrowModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
}

export default AdminActivities;
