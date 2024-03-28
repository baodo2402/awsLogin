import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AccessInformation from './service/AccessInformation';
import EditableTable from './EditableTable';
import { Header } from './Header';
import SearchBar from './SearchBar';
import { useLocation } from 'react-router-dom';
import { IoIosSearch } from "react-icons/io";
import zIndex from '@mui/material/styles/zIndex';
import './AddOrEditJobsStyle.css';
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";


import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import './service/CalendarStyle.css';


const { requestConfig, getTasksUrl, listTablesUrl } = AccessInformation;

const getTasks = async (suburb) => {
  try {
    const requestBody = {
      dayOfWeek: "no-use",
      recurrence_pattern: "no-use", 
      suburb: suburb
    };

    const response = await axios.post(getTasksUrl, requestBody, requestConfig);
    return response.data;
  } catch (error) {
    console.error(error);
    if (error.response && (error.response.status === 401 || 403)) {
      throw new Error('Unauthorized or Forbidden');
    } else {
      throw new Error('Sorry, the backend server is down, please try again later!');
    }
  }
};

const sampleHeaderList = [
  "Column 1",
  "Column 2",
  "Column 3"
]

const samplejsonData = [
  {"Column 1": "Task 1"},
  {"Column 2": "Task 2"},
  {"Column 3": "Task 3"},
]

export default function AddOrEditJobs() {
  const location = useLocation();
  const [fileContent, setFileContent] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const tableName = location?.state?.table || ''
  const [visible, setVisible] = useState(false);
  const [isAddNewTable, setIsAddNewTable] = useState(false);
  const [showInformation, setShowInformation] = useState(false);
  const [startingDate, setStartingDate] = useState('');
  const [fortnightlyStartingDate, setFortnightlyStartingDate] = useState('');
  const containerRef = useRef();

  const weekDifferences = fortnightlyStartingDate ? fortnightlyStartingDate.diff(startingDate, 'week') : null;

  const oddOrEven = weekDifferences !== null ? (weekDifferences % 2 === 0 ? 'EvenFortnightlyTask' : 'OddFortnightlyTask') : '';
  console.log("tablename", tableName)

  const fetchData = async () => {
    try {
      const taskBody = await getTasks(tableName);
      setFileContent(taskBody?.fileContent);
      setCsvHeaders(taskBody?.csvHeaders);
      console.log('fetch data re-render')
    } catch (error) {
      console.error(error);
    }
  };

    useEffect(() => {
    fetchData();
    setIsAddNewTable(false)
  }, [tableName]);
  
  const handleExpand = () => {
    setVisible(!visible)
    
  }

  const handleAddNewJob = () => {
    window.localStorage.removeItem('TableName');
    setFileContent([]);
    setCsvHeaders([]);
    setIsAddNewTable(true)
  }

  const handleInformation = () => {
    setShowInformation(!showInformation)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        // Clicked outside the container, set visible to false
        setVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div style={{zIndex: '-99999'}}>
        <Header title='Add/Edit Jobs' />
        <div className='background'></div>
      </div>
      <div className='menu-button-job-edit'>
        <p className='job-edit-search-button' onClick={handleExpand}>{ visible === false ? <IoIosSearch /> : <MdOutlineKeyboardArrowLeft />}  <span>Search current job controls</span></p>
        <p className='job-edit-search-button' onClick={handleAddNewJob}><AiOutlinePlus /> <span>Add a new job control</span></p>
        <p className='job-edit-search-button' onClick={handleInformation}><HiOutlineQuestionMarkCircle /> <span>Information</span></p>
        </div>

      {showInformation === true && (<div className='information'>
        <div className="information-description">
          <h3>To determine whether your Fortnightly Task is Odd or Even:</h3>
          <p>Even Fortnightly Task starts on the same week of Starting Date that you set in the table, While Odd Fortnightly Task starts on the week after of Starting Date</p> <br />
          
          <p>Or you can use this tool below to determine your fortnightly tasks</p>
          <p>First, set your Starting Date, then set the date of your fortnightly tasks are on</p>
          <p>You will receive the results of "Odd" or "Even" accordingly</p>
        </div>

        <div className="date-picker-container">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
              <DatePicker
                  label="Set Starting Date (Monday only)"
                  format='DD/MM/YYYY'
                  value={startingDate}
                  onChange={(date) => setStartingDate(date)}
                  renderInput={(params) => <input {...params}/> }
                  />
          </DemoContainer>
          </LocalizationProvider>
          </div>

          <div  className="date-picker-container">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                  <DatePicker
                      label="Pick Fortnightly Starting Date"
                      format='DD/MM/YYYY'
                      value={fortnightlyStartingDate}
                      onChange={(date) => setFortnightlyStartingDate(date)}
                      renderInput={(params) => (
                          <div style={{position: 'relative'}}>
                              <input className='MUI-input' {...params} /> 
                          </div>
                      )}
                      />
                </DemoContainer>
              </LocalizationProvider>
              </div>
                            
              <div className='week-number'>
                  <h3 style={{margin: '5px'}}>Week Number: </h3> <br />
              <h3>
                  {oddOrEven}
              </h3>
              </div>
              <button className='cancel-button' onClick={() => setShowInformation(false)}>Cancel</button>

      </div>)}

      <div  className={`job-edit-search-bar-container ${visible === true ? 'active' : 'inactive'}`} ref={containerRef}>
        <SearchBar
          readOnly={false}
          returnItemNameOnly={true}
          url={listTablesUrl}
          pageNavigation='/add-or-edit-jobs'
          title='Search for a table'
         
        />
      </div>



        <EditableTable
          headerList={csvHeaders}
          jsonData={fileContent}
          tableName={tableName}
          isAddNewTable={isAddNewTable}
          setIsAddNewTable={setIsAddNewTable} // Pass setIsAddNewTable as a prop
          />
    </div>
  );
}