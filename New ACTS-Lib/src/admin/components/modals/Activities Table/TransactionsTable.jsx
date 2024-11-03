import { useEffect, useState } from "react";

function TransactionTable() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchTransactions = async () => {
        try {
            const response = await fetch('http://localhost/acts/api.php?table=transactions'); // Adjust the URL as needed
            if (!response.ok) throw new Error('Failed to fetch transactions');
            const data = await response.json();
            console.log(data); // Log the response to check its structure
            
            // Check if the response has the expected structure
            if (data.transactions) {
                setTransactions(data.transactions); // Set transactions from the data object
            } else {
                throw new Error('Unexpected data format'); // Handle unexpected format
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4">Transaction List</h2>
            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Transaction ID</th>
                        <th className="border border-gray-300 px-4 py-2">Student Number</th>
                        <th className="border border-gray-300 px-4 py-2">Record ID</th>
                        <th className="border border-gray-300 px-4 py-2">Borrowed Date</th>
                        <th className="border border-gray-300 px-4 py-2">Return Date</th>
                        <th className="border border-gray-300 px-4 py-2">State</th>
                        <th className="border border-gray-300 px-4 py-2">Note</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(transaction => (
                        <tr key={transaction.Transaction_ID}>
                            <td className="border border-gray-300 px-4 py-2">{transaction.Transaction_ID}</td>
                            <td className="border border-gray-300 px-4 py-2">{transaction.Student_Number}</td>
                            <td className="border border-gray-300 px-4 py-2">{transaction.Record_ID}</td>
                            <td className="border border-gray-300 px-4 py-2">{transaction.Borrowed_Date}</td>
                            <td className="border border-gray-300 px-4 py-2">{transaction.Return_Date}</td>
                            <td className="border border-gray-300 px-4 py-2">{transaction.State}</td>
                            <td className="border border-gray-300 px-4 py-2">{transaction.Note}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TransactionTable;
