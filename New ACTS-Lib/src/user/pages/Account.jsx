import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import Navbar from '../components/Navbar';

function Account() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/login'); 
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (!userData) {
                setError('User not found.');
                setLoading(false);
                return;
            }

            const studentNumber = userData.Student_Number; // Ensure this matches your API response

            try {
                const response = await fetch(`http://localhost/acts/api.php?studentNumber=${studentNumber}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch user details.');
                }

                setUserDetails(data); // Set user details from the API response
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div>
            <Navbar />
            <div className="shadow-md rounded-lg p-6 w-full max-w-lg mt-8">
                <h1 className="text-3xl font-normal text-center mb-4">My Account</h1>
                <h2 className="text-xl mb-2">Name: <span className="font-normal">{userDetails.Name}</span></h2>
                <h2 className="text-xl mb-2">Course: <span className="font-normal">{userDetails.Course}</span></h2>
                <h2 className="text-xl mb-2">Year & Section: <span className="font-normal">{userDetails.Year_And_Section}</span></h2>
                <h2 className="text-xl mb-2">Email: <span className="font-normal">{userDetails.Email}</span></h2>
                <h2 className="text-xl mb-4">Password:</h2> {/* Placeholder for password */}

                <button
                    onClick={handleLogout}
                    className="w-1/3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800 transition"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Account;
