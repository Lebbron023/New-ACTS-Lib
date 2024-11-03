import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import logo from '../../assets/pictures/ACTSLogo.png';

function Navbar() {
    const navigate = useNavigate(); // Get the navigate function

    const handleRedirectToHome = () => {
        navigate('/home');
    };

    const handleRedirectToAcount = () => {
        navigate('/account');
    };

    const handleRedirectToResources = () => {
        navigate('/resources');
    };

    return (
        <nav className="bg-green-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <img src={logo} alt="Logo" className="h-8 w-auto mr-2" />
                    <div className="text-white text-xl">ACTS-Library</div>
                </div>
                <div className="flex space-x-4">
                    <div className="nav-item cursor-pointer text-white hover:text-gray-300" onClick={handleRedirectToHome}>
                        Home
                    </div>
                    <div className="nav-item cursor-pointer text-white hover:text-gray-300" onClick={() => alert('Upcoming Events')}>
                        Upcoming Events
                    </div>
                    <div className="nav-item cursor-pointer text-white hover:text-gray-300" onClick={() => alert('Library Hours')}>
                        Library Hours
                    </div>
                    <div className="nav-item cursor-pointer text-white hover:text-gray-300" onClick={handleRedirectToResources}>
                        Resources and Catalogs
                    </div>
                    <div className="nav-item cursor-pointer text-white hover:text-gray-300" onClick={handleRedirectToAcount}>
                        My Account
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
