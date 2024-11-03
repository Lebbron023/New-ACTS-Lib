import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterAccount() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        studentNumber: '',
        password: '',
        confirmPassword: '',
        email: '',
        course: '',
        yearAndSection: '',
    });

    const [message, setMessage] = useState({ error: '', success: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ error: '', success: '' });

        if (formData.password !== formData.confirmPassword) {
            setMessage({ error: 'Passwords do not match.', success: '' });
            return;
        }

        setLoading(true);
        const formDataWithAction = { ...formData, action: 'register' };

        try {
            const response = await fetch('http://localhost/acts/api.php', {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formDataWithAction),
            });

            const result = await response.json();
            if (result.error) {
                setMessage({ error: result.error, success: '' });
            } else {
                setMessage({ error: '', success: result.success });
                setFormData({
                    name: '',
                    studentNumber: '',
                    password: '',
                    confirmPassword: '',
                    email: '',
                    course: '',
                    yearAndSection: ''
                });
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (error) {
            setMessage({ error: 'An error occurred. Please try again.', success: '' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-green-600">
            <div className="register-container w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
                {message.error && <div className="flex justify-center text-red-500 mb-4">{message.error}</div>}
                {message.success && <div className="flex justify-center text-green-500 mb-4">{message.success}</div>}

                <h2 className="text-center text-2xl font-semibold mb-6">Register an Account</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                        <label htmlFor="studentNumber" className="block text-gray-700 mb-2">Student Number:</label>
                        <input
                            type="number"
                            id="studentNumber"
                            name="studentNumber"
                            value={formData.studentNumber}
                            onChange={handleChange}
                            required
                            min="1"
                            className="w-full p-2 border border-gray-300 rounded focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="course" className="block text-gray-700 mb-2">Course:</label>
                        <input
                            type="text"
                            id="course"
                            name="course"
                            value={formData.course}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="yearAndSection" className="block text-gray-700 mb-2">Year & Section:</label>
                        <input
                            type="text"
                            id="yearAndSection"
                            name="yearAndSection"
                            value={formData.yearAndSection}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-700 mb-2">Password:</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:border-blue-500"
                        />
                        <label className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                                className="mr-2"
                            />
                            <span className="text-gray-700 text-xs">Show Password</span>
                        </label>
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Confirm Password:</label>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:border-blue-500"
                        />
                        <label className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                checked={showConfirmPassword}
                                onChange={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="mr-2"
                            />
                            <span className="text-gray-700 text-xs">Show Password</span>
                        </label>
                    </div>
                    <div className="flex justify-center col-span-1 md:col-span-2">
                        <div className="w-full max-w-md">
                            <label htmlFor="email" className="block text-gray-700 mb-2">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-around col-span-1 mt-4 md:col-span-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-32 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800 transition"
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>

                        <button
                            type="button"
                            className="w-32 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800 transition"
                            onClick={() => navigate('/login')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>

                <label className="block text-center text-gray-600 mt-4">
                    Already have an account?{' '}
                    <span onClick={() => navigate('/login')} className="text-blue-600 underline cursor-pointer">Login here</span>
                </label>
            </div>
        </div>
    );
}

export default RegisterAccount;
