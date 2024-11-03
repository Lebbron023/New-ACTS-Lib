import React, { useEffect, useState } from 'react';

function ActivitiesTable() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await fetch('http://localhost/acts/api.php?table=activities'); // Update with your actual endpoint
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error); // Handle API error
                }
                setActivities(data.transactions); // Adjust this based on your API response structure
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4">Activities</h2>
            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Act ID</th>
                        <th className="border border-gray-300 px-4 py-2">Student Number</th>
                        <th className="border border-gray-300 px-4 py-2">Activity</th>
                        <th className="border border-gray-300 px-4 py-2">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {activities.map(activity => (
                        <tr key={activity.Act_ID}>
                            <td className="border border-gray-300 px-4 py-2">{activity.Act_ID}</td>
                            <td className="border border-gray-300 px-4 py-2">{activity.Student_Number}</td>
                            <td className="border border-gray-300 px-4 py-2">{activity.Activity}</td>
                            <td className="border border-gray-300 px-4 py-2">{activity.Date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ActivitiesTable;
