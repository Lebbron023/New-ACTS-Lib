import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Spinner from '../assets/spinner/Spinner';

function Login() {
    const [formData, setFormData] = useState({ name: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const { name, password } = formData;

        try {
            const response = await fetch('http://localhost/acts/api.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'login', name, password }),
            });

            const data = await response.json();
            console.log('API Response:', data); // Log API response

            if (!response.ok) {
                throw new Error(data.error || 'Login failed.');
            }

            if (!data.userData) {
                throw new Error('User data not found.');
            }

            // Save user data to local storage
            localStorage.setItem('userData', JSON.stringify(data.userData));
            login(); // Update authentication state

            setLoading(true);

            // Add setTimeout before navigation
            setTimeout(() => {
                setLoading(false);
                // Check the account type and redirect accordingly
                console.log("qwe");
                if (data.accountType === 'admin') {
                    navigate('/adminHome'); // Redirect to admin home page
                } else {
                    navigate('/home'); // Redirect to user home page
                }
            }, 1160); // Adjust the timeout duration as needed

        } catch (err) {
            setError(err.message.includes('NetworkError') ? 'Network error. Please try again.' : err.message);
            setLoading(false); // Reset loading state on error
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-green-600">
            <div className="login-container w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-center text-2xl font-semibold mb-6">Login</h2>
                {error && <div className="text-red-500 mb-4 flex items-center justify-center">{error}</div>}

                {loading ? (
                    <Spinner />
                ) : (
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-gray-700 mb-2">Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-gray-700 mb-2">Password:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500"
                            />
                        </div>
                        <div className="flex justify-between">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full px-4 py-2 ${loading ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-800'} text-white rounded transition`}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </div>
                    </form>
                )}

                <div className="text-center mt-2 text-xs">
                    <Link to="/forgot-password" className="text-blue-600 underline">Forgot Password?</Link>
                </div>
                <div className="text-center mt-4 text-xs">
                    <span className="text-gray-600">Don't have an account? </span>
                    <Link to="/register" className="text-blue-600 underline">Register here</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
