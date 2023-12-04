import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './SearchBarStyle.css'


const addressUrl = 'https://lyg1apc3wl.execute-api.ap-southeast-2.amazonaws.com/prod/csvAddress';

export default function SearchBar() {
    const [input, setInput] = useState('');
    const [results, setResults] = useState([]);
    const navigate = useNavigate();
    
    const requestConfig = {
        headers: {
            'x-api-key': 'EmYB7EcYzn2NK1dUkD2kK8MA18r5dp6tQ7wB7U1d'
        }
      }
    
      const fetchData = (value) => {
        axios.get(addressUrl, requestConfig)
          .then((response) => {
            const filteredResults = response.data.filter((item) => {
              return (
                value &&
                item &&
                item.suburb &&
                item.street &&
                (item.suburb.toLowerCase().includes(value.toLowerCase()) ||
                  item.street.toLowerCase().includes(value.toLowerCase()))
              );
            });
      
            // Create a map to track unique items using a combination of suburb and street as the key
            const uniqueResultsMap = new Map();
      
            filteredResults.forEach((item) => {
              const key = `${item.suburb?.split(' ').join('_')}_${item.street?.split(' ').join('_')}`;
              uniqueResultsMap.set(key, {
                formattedSuburb: item.suburb?.split(' ').join('_'),
                formattedStreet: item.street?.split(' ').join('_'),
              });
            });
      
            // Convert the map values back to an array
            const formattedResults = Array.from(uniqueResultsMap.values());
      
            setResults(formattedResults);
          })
          .catch((error) => {
            console.error(error);
          });
      }
      


    const handleChange = (value) => {
        setInput(value);
        fetchData(value)
    }

    const handleItemClick = (suburb, street) => {
        // Set localStorage with both suburb and formatted street
        window.localStorage.setItem('jobControlTableName', street + '_' + suburb);
        console.log("from search bar: " + street + '_' + suburb)
        navigate('/calendar');
    }

    return (
        <div>
            <h5 className='search-title'>Search For A Calendar</h5>
            <div className='search-container'>
                <div className='search-content'>
                    <input id='search-bar' placeholder='Search' value={input} onChange={e => handleChange(e.target.value)} />
                    <FaSearch id='search-icon'/>
                    <section id='list'>
                        {results.map((item) => (
                                <li
                                key={`${item.formattedSuburb} ${item.formattedStreet}`}
                                onClick={() => handleItemClick(item.formattedSuburb, item.formattedStreet)}
                                >
                                    {`${item.formattedStreet} ${item.formattedSuburb}`}
                                </li>
                        ))}
                    </section>

                </div>

            </div>
        </div>
        
    )
} 