import React, { useState, useEffect, useRef } from 'react';
import './premiumContentStyle.css'
import { Header } from './Header';
import './StaffsManagementStyle.css'
import axios from 'axios';
import SearchBar from './SearchBar';
import { useLocation } from 'react-router-dom';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { MdOutlineFileDownload } from "react-icons/md";
import { IoRefresh } from "react-icons/io5";
import { MdContentCopy } from "react-icons/md";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column"
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { GoIssueClosed } from "react-icons/go";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { TextField } from '@mui/material';

import AccessInformation from './service/AccessInformation';

const { displayTableResultsUrl, listTablesUrl } = AccessInformation

const useTableData = (initialData) => {
    const [headers, setHeaders] = useState([]);

    useEffect(() => {
        // if (initialData && initialData.length > 0) {
            const headerSet = new Set();

            // Iterate through all rows to collect headers
            initialData?.forEach((row) => {
                Object.keys(row).forEach((header) => {
                    headerSet.add(header);
                });
            });

            setHeaders(Array.from(headerSet));
        // }
    }, [initialData]);

    return { headers };
};

const StaffsManagement = (props) => {
    const location = useLocation();
    const [data, setData] = useState();
    //const [tableName, setTableName] = useState();
    const tableName = location.state?.table || ''
    const { headers } = useTableData(data);
    const [inputValues, setInputValues] = useState({});
    const [isSubmitClick, setIsSubmitClick] = useState(false);
    const [isBackButtonClick, setIsBackButtontClick] = useState(false);
    const [loading, setLoading] = useState(false); // Added loading state


    console.log(headers)
    console.log(tableName)
    const requestConfig = {
        headers: {
            'x-api-key': 'EmYB7EcYzn2NK1dUkD2kK8MA18r5dp6tQ7wB7U1d'
        }
    }


    const requestBody = {
        tableName: tableName,
    }

    useEffect(() => {
        if(tableName) {
            console.log('working')
            axios.post(displayTableResultsUrl, requestBody, requestConfig).then((response) => {
                //const sortedData = response.data.items.map(({ name, username, email, phoneNumber, address, id }) => ({ name, username, email, phoneNumber, address, id }))
                setData(response.data.items);
                console.table(response.data.items);
                console.log(response.data.items)
            })
            setInputValues({})
        }  else {
            console.log('tableName is falsy, skipping request.');
        }
    }, [tableName, isBackButtonClick])



    const renderObjectValue = (obj) => {
        // Convert object properties to a list
        const propertiesList = Object.entries(obj).map(([key, val]) => (
            <li key={key}>
                {key}: <strong>{JSON.stringify(val)}</strong>
            </li>
        ));
        return <ul>{propertiesList}</ul>;
    };

    
    const renderTableHeader = () => {
        if (!headers || headers.length === 0) return null;

        return (
            <thead style={{position: "sticky", top: '0', backgroundColor: "#bcece9d4"}}>
                <tr>
                    {headers.map((header) => (
                        <th key={header}>{header}</th>
                    ))}
                </tr>
            </thead>
        );
    };

    const [copiedRowIndex, setCopiedRowIndex] = useState(null);


    const renderTableRows = () => {
        const copyText = (text) => {
            // Create a text area element to copy the text to the clipboard
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);

          };
        
          const renderObjectValue = (obj) => {
            // Render object properties as a list
            const propertiesList = Object.entries(obj).map(([key, val]) => (
              <li key={key}>
                {key}: <strong>{JSON.stringify(val)}</strong>
                <button onClick={() => copyText(JSON.stringify(val))}>Copy</button>
              </li>
            ));
            return <ul>{propertiesList}</ul>;
          };
        if (!data || data.length === 0) return (
            <div>
                <h4>No data available</h4>
                <p>Data might not yet be recorded in this table or in this date range</p>
                <button onClick={() => setIsBackButtontClick(!isBackButtonClick)}>Back</button>
            </div>
        );

        return (
            <tbody>
                {data.map((row, index) => (
                    <tr key={index}>
                        {headers.map((header, colIndex) => (
                            <td key={colIndex}>
                                {typeof row[header] === 'object' ? renderObjectValue(row[header]) : (
                  <React.Fragment>
                    
                    <button id='copy-button' onClick={() => copyText(row[header])}><MdContentCopy /></button>
                    {row[header]}
                  </React.Fragment>
                )}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        );
    };
    

    const handleInputChange = (header, value) => {
        console.log("header:" + header);
        console.log("value: " + value)
        setInputValues((prevInputValues) => ({
          ...prevInputValues,
          [header]: value,
        }));
      };
      

      const renderInputForm = () => {
        const clearInputs = () => {
          setInputValues({});
        };
      
        if (!headers || headers.length === 0) return (
            <>
            <p>No Table Selected</p>
            </>
        );
      
        return (
          <div>
            <form>
              <div className='filter-input-form'>
                {headers.map((header) => (
                  <div key={header}>
                    <label htmlFor={header}>{header}:</label> <br />
                    <input
                      type="text"
                      id={header}
                      className='filter-input'
                      name={header}
                      value={inputValues[header] || ''}
                      onChange={(e) => handleInputChange(header, e.target.value)}
                    />
      
                    {header === 'date' ? (
                      <div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={['DatePicker']}>
                            <DatePicker
                              label="Set A Starting Date"
                              format='DD/MM/YYYY'
                              clearable
                              type="text"
                              value={inputValues['startTime'] || ''} 
                              name={header}
                              renderInput={(params) => <TextField {...params} className='calendar-picker-input' />}
                              onChange={(date) => handleInputChange('startTime', dayjs(date).format('YYYY-MM-DD'))}

                            />
                          </DemoContainer>
                        </LocalizationProvider>
      
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={['DatePicker']}>
                            <DatePicker
                              label="Set An Ending Date"
                              format='DD/MM/YYYY'
                              clearable={true}
                              type="text"
                              value={inputValues['endTime'] || ''}
                              name={header}
                              renderInput={(params) => <TextField {...params} className='calendar-picker-input' />}
                              onChange={(date) => handleInputChange('endTime', dayjs(date).format('YYYY-MM-DD'))}
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                      </div>
                    ) : null}
                  </div>
                ))}
                <div className='filter-submit-button-container'>
                  <button id='clear-button' type="button" onClick={clearInputs}>
                    Clear
                  </button>
                  <button id='filter-submit-button' type="submit" onClick={(e) => handleSubmit(e)}>
                    Run
                  </button>

                </div>
              </div>
            </form>
          </div>
        );
      };
      

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitClick(!isSubmitClick)
    if(Object.keys(inputValues).length > 0) {
        const resendRequestBody = {
            tableName: tableName,
            filters: {
                ...inputValues
            }
        }
        console.log(resendRequestBody)
            console.log('resend working')
            axios.post(displayTableResultsUrl, resendRequestBody, requestConfig).then((response) => {
                if (response.data.items) {
                    setData(response.data.items)
                } else {
                    setData(response.data); // now only need to specify response.data, no need response.data.items  
                }
            })
        setInputValues({})
    }
  };


const downloadCSV = () => {
    if (!data || data.length === 0) {
      console.warn('No data to download.');
      return;
    }
  
    // Find all unique keys in the data
    const allKeys = Array.from(new Set(data.flatMap(obj => Object.keys(obj))));
  
    // Create a CSV header with all unique keys
    const csvHeader = allKeys.map(key => `"${key}"`).join(',');
  
    // Create a CSV content by mapping each row's values to the corresponding keys
    const csvContent = data
      .map(row => allKeys.map(key => `"${row[key] || ''}"`).join(','))
      .join('\n');
  
    // Combine the header and content
    const csv = `${csvHeader}\n${csvContent}`;
  
    const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csv}`);
    const link = document.createElement('a');
    link.href = encodedUri;
    link.setAttribute('download', 'data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  


  const testReactTable = () => {
    //copy function
    const copyText = (text) => {
        // Create a text area element to copy the text to the clipboard
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      };
      
  // Extract all unique keys from the data objects
  const allKeys = Array.from(
    new Set(data?.flatMap((item) => Object.keys(item)))
  );
  

  return (
    <DataTable
      value={data}
      style={{fontSize: "12px"}}
      scrollable scrollHeight='45em' >
      {allKeys.map((key) => (
        <Column
          key={key}
          field={key}
          header={key.toUpperCase()}
          style={{margin: "0", padding: "5px"}}
          sortable
          body={(rowData) =>
            rowData[key] && typeof rowData[key] === 'object' ? (
              <ul>
                {Object.entries(rowData[key]).map(([nestedKey, nestedValue]) => (
                  <li key={nestedKey}>
                    {nestedKey}: <strong>{
                                    nestedValue === true ?
                                    <GoIssueClosed style={{color: "green", fontSize: '14px'}} /> :
                                    <IoIosCloseCircleOutline style={{color: "red", fontSize: '14px'}} /> }
                                    </strong>
                  </li>
                ))}
              </ul>
            ) : (
                <>
                <button id='copy-button' onClick={() => copyText(rowData[key])}><MdContentCopy /></button>
                {rowData[key]}
                </>
            )
          }
        />
      ))}
    </DataTable>
  );
  }
  
    return (
        <div>
            <Header title="Staff Management" />
            <div className='management-container'>      
                <div className='table-search-container'>
                <SearchBar
                    readOnly={false}
                    returnItemNameOnly={false}
                    url={listTablesUrl}
                    pageNavigation='/staff-management'
                    title='Search for a table'
                    isSearchIcon={true}
                    style={{
                        margin: "10px 0 0 10px",
                    }}
                />
                <div className="filter-form" >
                    <div id='filter-title'>
                        <h2>Filter</h2>
                    </div>
                    {renderInputForm()}
                </div>

                </div>

                <div className='staff-management-container'>
                
                    <div id='table-name'>
                    <button id='refresh-button' onClick={() => setIsBackButtontClick(!isBackButtonClick)}><IoRefresh /></button>
                        <h3>{tableName}</h3>
                        <button id='download-button' onClick={downloadCSV}><span id='download-icon'><MdOutlineFileDownload /></span> Download</button>
                    </div>
                    <div id='table-content'>
                        {/* <table className='staff-table'>
                            {renderTableHeader()}
                            {renderTableRows()}
                        </table> */}
                        <div>
                            {testReactTable()}
        
                        </div>
                    </div>

                </div>
                <div className='background'></div>
            </div>
        </div>
    )
}

export default StaffsManagement;