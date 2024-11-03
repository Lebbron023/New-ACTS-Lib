import React from 'react';

function Sidebar({ checkedItems, onTypeChange }) {
    return (
        <div className="container mx-auto bg-green-700 p-6 h-screen">
            <div className="sidebar text-black">
                <h3 className="text-xl font-semibold mb-4">Resources</h3>
                <ul className="list-disc pl-5">
                    <li className="mb-2">Books
                        <ul className="sub-list list-disc pl-5 mt-2">
                            <li className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id="business"
                                    checked={checkedItems.has("business")}
                                    onChange={(e) => onTypeChange("business", e.target.checked)}
                                    className="mr-2"
                                />
                                <label htmlFor="business">Business and Management</label>
                            </li>
                            <li className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id="computer"
                                    checked={checkedItems.has("computer")}
                                    onChange={(e) => onTypeChange("computer", e.target.checked)}
                                    className="mr-2"
                                />
                                <label htmlFor="computer">Computer Related</label>
                            </li>
                            <li className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id="social_science"
                                    checked={checkedItems.has("social_science")}
                                    onChange={(e) => onTypeChange("social_science", e.target.checked)}
                                    className="mr-2"
                                />
                                <label htmlFor="social_science">Social Science</label>
                            </li>
                        </ul>
                    </li>
                  
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;
