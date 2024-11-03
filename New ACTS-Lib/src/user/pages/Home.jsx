import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate(); // Initialize the useNavigate hook

    const RedirectToResources = () => {
        navigate('/resources'); // Redirect to the resources page
    };

    const RedirectToMyAccount = () => {
        navigate('/account'); // Redirect to the login page
    };

    const RedirectToUpComingEvents = () => {
        navigate('/events'); // Redirect to the login page
    };

    return (
        <div className="bg-gray-100 flex flex-col min-h-screen">
            <header className="bg-green-800 text-white text-center py-4">
                <h1 className="text-2xl font-bold">Welcome to Our Library</h1>
            </header>

            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 p-6 flex-grow">
                <section id="events">
                    <h2 className="text-lg font-semibold mb-2">Upcoming Events</h2>
                    <div className="cursor-pointer block no-underline text-black" onClick={RedirectToUpComingEvents} >
                        <div className="bg-gradient-to-br from-white to-green-600 p-4 rounded-lg shadow-lg h-40 transition-transform transform hover:scale-105 hover:shadow-2xl">
                            <h3 className="text-xl font-semibold">Story Time</h3>
                            <p>Every Saturday at 10 AM</p>
                        </div>
                    </div>
                </section>

                <section id="resources">
                    <h2 className="text-lg font-semibold mb-2">Resources and Catalogs</h2>
                    <div className="cursor-pointer block no-underline text-black" onClick={RedirectToResources} >
                        <div className="bg-gradient-to-br from-white to-green-600 p-4 rounded-lg shadow-lg h-40 transition-transform transform hover:scale-105 hover:shadow-2xl">
                            <p>Access online databases and research tools:</p>
                        </div>
                    </div>
                </section>

                <section id="library-hours">
                    <h2 className="text-lg font-semibold mb-2 ">Library Hours</h2>
                    <div className="cursor-pointer block no-underline text-black">
                        <div className="bg-gradient-to-br from-white to-green-600 p-4 rounded-lg shadow-lg h-40 transition-transform transform hover:scale-105 hover:shadow-2xl">
                            <p>Monday - Friday: 9 AM - 6 PM</p>
                            <p>Saturday: 10 AM - 4 PM</p>
                            <p>Sunday: Closed</p>
                        </div>
                    </div>
                </section>

                <section id="membership">
                    <h2 className="text-lg font-semibold mb-2 ">My Account</h2>
                    <div className="cursor-pointer block no-underline text-black" onClick={RedirectToMyAccount} >
                        <div className="bg-gradient-to-br from-white to-green-600 p-4 rounded-lg shadow-lg h-40 transition-transform transform hover:scale-105 hover:shadow-2xl">
                            <p>Sign up for a library card or login to your account here.</p>
                        </div>
                    </div>
                </section>
            </div>

            <footer className="text-center p-4 bg-green-800">
                <p>Follow us on social media:
                    <a href="#" aria-label="Facebook" className="text-white hover:underline">Facebook</a>  |
                    <a href="#" aria-label="Twitter" className="text-white hover:underline">Twitter</a>  |
                    <a href="#" aria-label="Instagram" className="text-white hover:underline">Instagram</a>
                </p>
                <p>&copy; 2024 Renn All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Home;
