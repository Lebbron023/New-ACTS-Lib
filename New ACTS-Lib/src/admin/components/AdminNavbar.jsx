import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/pictures/ACTSLogo.png';

function AdminNavbar() {
    const navigate = useNavigate(); // Get the navigate function

    const handleRedirectToHome = () => {
        navigate('/adminHome');
    };

    const handleRedirectToAcount = () => {
        navigate('/adminAccount');
    };

    const handleRedirectToResources = () => {
        navigate('/adminResources');
    };

    const handleRedirectToActivities = () => {
        navigate('/adminActivities');
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
                    <div className="nav-item cursor-pointer text-white hover:text-gray-300" onClick={handleRedirectToActivities}>
                        Library Activities
                    </div>
                    <div className="nav-item cursor-pointer text-white hover:text-gray-300" onClick={handleRedirectToAcount}>
                        My Account
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default AdminNavbar;
