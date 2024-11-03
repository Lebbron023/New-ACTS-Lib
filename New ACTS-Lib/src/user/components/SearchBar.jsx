import React, { useState, useEffect } from 'react';

function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!searchTerm) {
                setData([]);
                return;
            }

            try {
                const response = await fetch(`http://localhost/acts/api.php?search=${encodeURIComponent(searchTerm)}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                console.log('Fetched data:', result);

                // Filter based on both Title_Name and Author_Name
                const filteredData = result.filter((item) =>
                    item.Title_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.Author_Name.toLowerCase().includes(searchTerm.toLowerCase()) 

        );
                setData(filteredData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [searchTerm]);

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleInputChange}
            />
            {data.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Author ID</th>
              <th>Author Name</th>
              <th>Title Name</th>
              <th>Academic Year</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.Author_ID}>
                <td>{item.Author_ID}</td>
                <td>{item.Author_Name}</td>
                <td>{item.Title_Name}</td>
                <td>{item.Academic_Year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No data available</div>
      )}
        </div>
    );
}

export default SearchBar;