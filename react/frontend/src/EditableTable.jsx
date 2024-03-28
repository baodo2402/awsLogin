import React, { useState, useEffect, useRef } from 'react';
import './EditableTableStyle.css';
import { HiOutlineTrash } from "react-icons/hi2";
import { GoPlusCircle } from "react-icons/go";
import { AiOutlineSave } from "react-icons/ai";
import AccessInformation from './service/AccessInformation';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { TextField } from '@mui/material';



const { deleteobjectUrl, addNewCsvFile, listSearchResultsUrl, requestConfig } = AccessInformation

function EditableTable({ headerList, jsonData, tableName, isAddNewTable, setIsAddNewTable }) {
  const [headers, setHeaders] = useState(headerList);
  const [data, setData] = useState(jsonData);
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState('');
  const [tableNameInput, setTableNameInput] = useState(tableName);
  const [message, setMessage] = useState('');
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  const [startingDate, setStartingDate] = useState(headerList[headerList.length -1]);
  const [quarterlyStartingDate, setQuarterlyStartingDate] = useState(headerList[headerList.length -2]);

  const [results, setResults] = useState([]);
  const containerRef = useRef(null);

  const [selectedHeaderIndex, setSelectedHeaderIndex] = useState('');
  const [selectedItem, setSelectedItem] = useState('');

  
  // Update state when props change
  useEffect(() => {
    setHeaders(headerList);
    setData(jsonData);

    //setting starting date for startingDate, and quarterlyStartingDate if needed
    const regexSecondToLastIndex = /^\d{4}-\d{2}-\d{2}$/;
    const regexLastIndex = /^\d{4}-\d{2}-\d{2}$/;

    regexSecondToLastIndex.test(headerList[headerList.length-2]?.slice(1, -1));
    regexLastIndex.test(headerList[headerList.length-1]?.slice(1, -1));

    if(regexSecondToLastIndex) {
      setStartingDate(dayjs(headerList[headerList.length -2]?.slice(1, -1)));
      setQuarterlyStartingDate(dayjs(headerList[headerList.length -1]?.slice(1, -1)))
    } else {
      setStartingDate(dayjs(headerList[headerList.length -1]?.slice(1, -1)));
    }
  }, [headerList, jsonData]);
  useEffect(() => {
    setTableNameInput(tableName)
  }, [tableName])

  //  useEffect(() => {
  //   setTableNameInput(tableName)
  //  }, [tableName])

  const addRow = () => {
    setData([...data, {}]);
  };

  const addColumn = () => {
    const newHeader = `New Column ${headers.length + 1}`;
    setHeaders([...headers, newHeader]);
    setData(data.map(row => ({ ...row, [newHeader]: '' })));
  };

  const deleteRow = rowIndex => {
    setData(prevData => prevData.filter((_, index) => index !== rowIndex));
  };

  const deleteColumn = columnIndex => {
    const deletedHeader = headers[columnIndex];
    setHeaders(prevHeaders =>
      prevHeaders.filter((_, index) => index !== columnIndex)
    );
    setData(prevData => {
      const newData = prevData.map(row => {
        delete row[deletedHeader];
        return row;
      });
      return newData;
    });
  };

  const editCell = (rowIndex, colName, value) => {
    setData(prevData => {
      const newData = [...prevData];
      newData[rowIndex][colName] = value;
      return newData;
    });
  };


  const editHeader = (index, newName) => {
    setHeaders(prevHeaders => {
      const newHeaders = [...prevHeaders];
      const oldHeader = prevHeaders[index]; // Store the original header name
      newHeaders[index] = newName;
      setData(prevData => {
        const newData = prevData.map(row => {
          // Rename the key in each row to match the new header name
          if (row.hasOwnProperty(oldHeader)) {
            row[newName] = row[oldHeader];
            delete row[oldHeader];
          }
          return row;
        });
        return newData;
      });
      fetchSearchData(newName)
      return newHeaders;
    });
  };
  
  const exportData = async () => {
    setLoading(true)
      for (let i = 0; i < data.length; i++) {
          const obj = data[i];
          for (let key in obj) {
              // Check if the value of an object is empty, except date format object
              if (obj[key] === "" && !/^"\d{4}-\d{2}-\d{2}"$/.test(key)) {
                  delete obj[key]; // if empty -> delete
              }
          }
      }

  

  
    try {
      const stringStartingDate = startingDate.format("YYYY-MM-DD");
      const stringQuarterlyStartingDate = quarterlyStartingDate.format("YYYY-MM-DD");
      const requestBody = {
        bucketName: 'client-addresses-clean-n-tidy',
        key: tableNameInput ? tableNameInput + '.csv' : '',
        jsonData: data,
        headersList: headers,
        startingDate: '"' + stringStartingDate + '"',
        quarterlyStartingDate: '"' + stringQuarterlyStartingDate + '"'
      };

      console.log('exported data: ', data)

  
      const response = await axios.post(addNewCsvFile, requestBody, requestConfig);
      console.log("Response:", response.data); // Assuming your server returns some data
      setLoading(false)
      setNotification('notify')
      setMessage(response.data.message)
      //window.location.reload();

  
    } catch (error) {
      console.error("Export Data Error:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setMessage(error.response.data.message);
        setNotification('notify');
        setLoading(false)
    } else {
        setMessage(error.message);
        setLoading(false)
    }

    }
  };

  const deleteObjects = () => {

    const deleteS3File = async () => {
      setLoading(true)
      const requestBody = {
        bucket: 'client-addresses-clean-n-tidy',
        key: tableNameInput + '.csv'
      }

      try {
    
        const response = await axios.post(deleteobjectUrl, requestBody, requestConfig);
        console.log("Response:", response.data); // Assuming your server returns some data
        setLoading(false)
        setNotification('notify')
        setMessage(response.data.message)
    
      } catch (error) {
        console.error("Delete Data Error:", error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          setMessage(error.response.data.message);
          setNotification('notify');
          setLoading(false)
      } else if (error.response && error.response.status === 404) {
        setMessage(error.message);
        setNotification('notify');
        setLoading(false)
      } else {
          setMessage(error.message);
          setLoading(false)
      }
      }
    }

    const deleteTable = async () => {
      setLoading(true)
      console.log('delete table')
      console.log(tableNameInput)

      try {
        const requestBody = {
          tableName: tableNameInput
        }
        const response = await axios.post(deleteobjectUrl, requestBody, requestConfig);
        console.log("Response:", response.data);
        setLoading(false)
        setNotification('notify')
        setMessage(response.data.message)
    
      } catch (error) {
        console.error("Delete Data Error:", error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          setMessage(error.response.data.message);
          setNotification('notify');
          setLoading(false)
      } else if (error.response && error.response.status === 404) {
        setMessage(error.message);
        setNotification('notify');
        setLoading(false)
      } else {
          setMessage(error.message);
          setLoading(false)
      }
      }
    }

    const confirmAction = async (action) => {
      const confirmed = window.confirm("This action cannot undo. Are you sure you want to proceed?");
      if (confirmed) {
        try {
          await action();
        } catch (error) {
          console.error("Error deleting file:", error);
          alert(error)
        }
      } else {
        console.log("Deletion cancelled by user.");
      }
    };

    return (
      <div className='delete-options-root'>
        <h3>Choose your delete options for {tableNameInput}</h3>
        <p>Since you delete an object, this action cannot be undo</p>
        
        <div className='delete-options-container'>
          <div
            className='delete-option'
            onClick={(e) => {
            e.stopPropagation(); // Prevent event propagation
            confirmAction(deleteS3File);
            }}>
            <h5>Delete this table Only (Job control table)</h5>
            <p>This will only delete this table, but won't delete the table for task status records</p>
          </div>

          <div
            className='delete-option'
            onClick={(e) => {
              e.stopPropagation(); // Prevent event propagation
              confirmAction(deleteTable);
              }}>
            <h5>Delete the task status table only</h5>
            <p>This will only delete the table for task status records, which the Calendar uses to display done and not-done tasks</p>
          </div>

          <div
            className='delete-option'
            onClick={(e) => {
              e.stopPropagation(); // Prevent event propagation
              confirmAction(deleteTable);
              confirmAction(deleteObjects);
              }}>
            <h5>Delete both tables</h5>
            <p>This will delete both job control table and task status record table</p>
          </div>
        </div>

        <button className='delete-cancel-button' onClick={() => setShowDeleteOptions(false)}>Cancel</button>
      </div>
    )
  }

  const handleTableNameChange = (e) => {
    setTableNameInput(e.target.value);
    setIsAddNewTable(false)
  }

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification('');
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, [notification]);



  const fetchSearchData = (value) => {
    axios.get(listSearchResultsUrl, requestConfig)
      .then((response) => {
        console.log("response: ")
        console.log(response.data)
        
        const filteredResults = response.data.message.filter((item) => {
          return (item && item.toLowerCase().includes(value.toLowerCase()))
        })
          console.log(filteredResults)
          setResults(filteredResults);
        

      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleItemClick = (item) => {
    setSelectedItem(item);
    editHeader(selectedHeaderIndex, item)
  };

  const selectHeaderIndex = (index) => {
    setSelectedItem('');
    setSelectedHeaderIndex(index)
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


  const binOutDay = (headerIndex) => {
    const binOptions = [
      { dot: '🔴', value: 'General Waste' },
      { dot: '🟢', value: 'FOGO' },
      { dot: '🟡', value: 'Recycling' },
      { dot: '🟣', value: 'Food Waste' }
    ];
  
    const handleOnClick = (headerIndex, binType) => {
      // Check if the binType already exists in any cell of the column
      const columnData = data.map(row => row[headers[headerIndex]]);
      const binTypeExists = columnData.includes(binType);

      if(!binTypeExists) {
        const emptyRowIndex = data.findIndex(row => !row[headers[headerIndex]]);

        if (emptyRowIndex !== -1) {
          // If an empty row is found, update the existing data with the new binType in that row
          const newData = [...data];
          newData[emptyRowIndex][headers[headerIndex]] = binType;
          setData(newData);
        } else {
          // If no empty row is found, add a new row at the end of the data with the new binType
          const newRow = { [headers[headerIndex]]: binType };
          setData(prevData => [...prevData, newRow]);
        }
      } else {
        const newData = data.map(row => {
          const newRow = { ...row };
          if (newRow[headers[headerIndex]] === binType) {
            delete newRow[headers[headerIndex]];
          }
          return newRow;
        });
        setData(newData);
      }

    };
  
    // const handleOnClick = (headerIndex, binType) => {
    //   // Check if the binType already exists in any cell of the column
    //   const columnData = data.map(row => row[headers[headerIndex]]);
    //   const binTypeExists = columnData.includes(binType);
    
    //   // If binType exists, remove it from the column; otherwise, add it
    //   const newData = binTypeExists
    //     ? data.map(row => ({ ...row, [headers[headerIndex]]: row[headers[headerIndex]] !== binType ? row[headers[headerIndex]] : '' }))
    //     : data.map(row => ({ ...row, [headers[headerIndex]]: binType }));
    
    //   setData(newData);
    //   console.log(binType);
    // };
    
    // Function to check if any cell in the column contains a specified value
    const hasValueInColumn = (columnName, value) => {
      return data.some(row => row[columnName] === value);
    };
  
    return (
      <div>
        <div className='bin-options'>
          <p id='select-bin-title'>Select bins: </p>

          {binOptions.map((option, index) => (
            <p
              id='bin'
              key={index}
              onClick={() => handleOnClick(headerIndex, option.value)}
              style={{
                backgroundColor: hasValueInColumn(headers[headerIndex], option.value) ? 'black' : 'transparent',
              }}
            >
              {option.dot}
            </p>
          ))}
        </div>
      </div>
    );
  };
  
  

  return (
    <div>
      {loading && (
          <Box sx={{ position: "fixed", top: "40%", left: "45%", zIndex: "1000" }}>
          <CircularProgress />
          </Box>
      )}
      {showDeleteOptions === true && deleteObjects()}


        {headerList && jsonData && (
                    <div className='table-container'>
                      Table Name: <input
                        className='table-name-input'
                        value={isAddNewTable === false ? tableNameInput : ''}
                        readOnly={false}
                        onChange={handleTableNameChange}
                        placeholder='Street_Name_Suburb_Job_Control'
                          /> <br />
                      
                      Starting Date: <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={['DatePicker']}>
                            <DatePicker
                              label="Set A Starting Date"
                              clearable
                              type="text"
                              value={startingDate}
                              format='DD/MM/YYYY'
                              className='date-picker'
                              // name={header}
                              renderInput={(params) => <TextField {...params} className='calendar-picker-input' />}
                              onChange={(date) => setStartingDate(date)}
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoContainer components={['DatePicker']}>
                                <DatePicker
                                  label="Set A Quaterly Starting Date"
                                  clearable
                                  type="text"
                                  value={quarterlyStartingDate}
                                  format='DD/MM/YYYY'
                                  className='date-picker'
                                  // name={header}
                                  renderInput={(params) => <TextField {...params} className='calendar-picker-input' />}
                                  onChange={(date) => setQuarterlyStartingDate(date)}
                                />
                              </DemoContainer>
                            </LocalizationProvider>                            
                    <div className='button-container'>
                        <button onClick={addRow}><GoPlusCircle /> New Row</button>
                        <button onClick={addColumn}><GoPlusCircle /> New Column</button>
                        <button onClick={() => setShowDeleteOptions(!showDeleteOptions)}><HiOutlineTrash /> Delete table</button>
                        <button onClick={exportData}><AiOutlineSave /> Save</button>
                        {notification && <p>{message}</p>}
                        
                    </div>
              <div className='table-scroll'>
                <table>
                      <thead className='header-table-head'>
                      <tr id='header-tr'>
                          {headers?.slice(0, -1).map((header, index) => (
                          <th id='header-th' key={index}>
                              <input
                              className='header-input'
                              type="text"
                              value={index === selectedHeaderIndex && selectedItem ? selectedItem : header}
                              onChange={e => editHeader(index, e.target.value)}
                              onClick={() => 
                                selectHeaderIndex(index)
                              } // Wrap in an arrow function
                              /> <br />
                              {binOutDay(index)}


                              {index === selectedHeaderIndex &&(
                              <section id='header-list' style={{width: '9em', listStyleType: "none"}} ref={containerRef}>
                              {(
                                results.map((item) => (
                                  <li key={item} onClick={() => handleItemClick(item)}>
                                    {item}
                                  </li>
                                ))
                              )}  
                              </section>
                              )}
                              <button id='delete-button' onClick={() => deleteColumn(index)}><HiOutlineTrash /></button>
                          </th>
                          
                          ))}
                          
                      </tr>
                      </thead>
                      <tbody className='data-table-body'>
                      {data?.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                          {headers.slice(0, -1).map((header, colIndex) => (
                              <td key={colIndex}>
                              <textarea
                                  className='data-input'
                                  type="text"
                                  value={row[header] || ''}
                                  onChange={e => editCell(rowIndex, header, e.target.value)}
                              />
                              </td>
                          ))}
                          <td>
                              <button id='delete-button' onClick={() => deleteRow(rowIndex)}><HiOutlineTrash /></button>
                          </td>
                          </tr>
                      ))}
                      </tbody>
                  </table>
              </div>

        </div>
    
        )}

    </div>
  );
}

export default EditableTable;
