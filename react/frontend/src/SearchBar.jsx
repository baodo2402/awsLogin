import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './SearchBarStyle.css';
import { useRef } from 'react';
import AccessInformation from './service/AccessInformation';

const { requestConfig } = AccessInformation;

export default function SearchBar(props) {
    const { readOnly, suburb, url, pageNavigation, title, style, listWidth, searchBarWidth, isSearchIcon, placeHolder, initialInput } = props;
    const [input, setInput] = useState(suburb || '');
    const [results, setResults] = useState([]);
    const [visible, setVisible] = useState(true)
    const [isStringArray, setIsStringArray] = useState(false)
    const navigate = useNavigate();
    const containerRef = useRef(null);
  
    useEffect(() => {
      setInput(initialInput)
    }, [initialInput])

      const fetchData = (value) => {
        axios.get(url, requestConfig)
          .then((response) => {
            console.log("response: ")
            console.log(response.data)
            
            if(typeof response.data[0] === 'object') {
              const filteredResults = response.data.filter((item) => {
                return (
                  value === '' ||
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
              console.log("formattedResults:")
              console.log(formattedResults)
              setResults(formattedResults);
              setIsStringArray(false);
            } else {
              const filteredResults = response.data.message.filter((item) => {
                return item && item.toLowerCase().includes(value.toLowerCase())
              })
              console.log(filteredResults)
              setIsStringArray(true);
              setResults(filteredResults);
            }

          })
          .catch((error) => {
            console.error(error);
          });
      }
      


    const handleChange = (value) => {
      if (!suburb && readOnly) {
        setInput('Clock in to access calendar');
        fetchData('Clock in to access calendar')
      } else {
        setInput(initialInput)
        setInput(value);
        fetchData(value);
      }

    }

    const handleItemClick = (suburb, street) => {
      setInput(suburb ? suburb : "nothing");
        // Set localStorage with both suburb and formatted street
        if(suburb && street) {
          window.localStorage.setItem('TableName', street + '_' + suburb);
          navigate(pageNavigation);
        } else if (!street) {
          window.localStorage.setItem('TableName', suburb ? suburb : "nothing");
          const table = window.localStorage.getItem('TableName')
          console.log(table);
          if(table !== null) {
            navigate(pageNavigation, { state: { table } });
          } else {
            window.localStorage.setItem('TableName', 'we');
          }

        }
    }

  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          // Clicked outside the container (search bar or list), so clear the results
          setResults([]);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);


    return (
        <div>
            
          <div className={`search-container ${visible ? 'active' : 'inactive'}`} style={style} ref={containerRef}>
            <h5 className='search-title'>{title}</h5>
                <div className='search-content'>
                    <input id='search-bar'
                    placeholder={placeHolder}
                    value={input}
                    onChange={e => handleChange(e.target.value)}
                    onClick={e => handleChange(e.target.value)}
                    readOnly={readOnly || false}
                    style={{
                      width: searchBarWidth
                    }}
                    />
                    {isSearchIcon === true ? <FaSearch id='search-icon'/> : ''}
                    <section id='list' style={{width: listWidth}} ref={containerRef}>
                        {isStringArray === false ? (
                          results.map((item) => (
                            <li
                            key={`${item.formattedSuburb} ${item.formattedStreet}`}
                            onClick={() => handleItemClick(item.formattedSuburb, item.formattedStreet)}
                            >
                                {`${item.formattedStreet} ${item.formattedSuburb}`}
                            </li>
                        ))
                        ) : (
                          results.map((item) => (
                            <li key={item} onClick={() => handleItemClick(item, '')}>
                              {item}
                            </li>
                          ))
                        )

                        }
                    </section>

                </div>

          </div>
        </div>
        
    )
} 