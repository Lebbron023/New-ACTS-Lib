import React, { useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import AdminDisplayData from '../components/AdminDisplayData'

function App() {
    const [selectedTypes, setSelectedTypes] = useState(new Set());

    return (
        <>
        <AdminNavbar />
            <div>
                <AdminDisplayData selectedTypes={selectedTypes} /> 
            </div>
        </>
    );
}

export default App;
