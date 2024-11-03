import React, { useState } from 'react';
import DisplayData from '../components/DisplayData'
import Navbar from '../components/Navbar';


function App() {
    const [selectedTypes, setSelectedTypes] = useState(new Set());

    return (
        <>
        <Navbar />
            <div>
                <DisplayData selectedTypes={selectedTypes} />
            </div>
        </>
    );
}

export default App;
