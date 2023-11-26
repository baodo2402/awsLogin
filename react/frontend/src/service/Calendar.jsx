import * as React from 'react';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUser } from '../service/AuthService';
import { jobTableNameFunction } from './LocationFinderService';
import { Header } from '../Header';

var weekOfYear = require('dayjs/plugin/weekOfYear')
dayjs.extend(weekOfYear);

const startingDate = '2023-09-26'

const getTasksUrl = 'https://lyg1apc3wl.execute-api.ap-southeast-2.amazonaws.com/prod/gettasks';
const getTaskStatusUrl = 'https://lyg1apc3wl.execute-api.ap-southeast-2.amazonaws.com/prod/gettaskstatus';
const calendarUrl = 'https://lyg1apc3wl.execute-api.ap-southeast-2.amazonaws.com/prod/calendar';
const requestConfig = {
  headers: {
    'x-api-key': 'EmYB7EcYzn2NK1dUkD2kK8MA18r5dp6tQ7wB7U1d'
  }
};
  
  //let testDay = dayjs('2023-1-1');
  
    //let weekDifference = testDay?.week();
let weekDifference = 1
  //console.log("iso week " + weekDifference)
 
//// info for obtaining data
const tuesday = 2; // 0 = Sunday, 1 = Monday, 2 = Tuesday, etc.

let testDay = dayjs('2023-1-1').locale({
  week: {
      dow: 1, // Monday is the first day of the week
      doy: 4  // The week that contains January 4th is the first week of the year
  }
});


function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}
let badgeType = '';

function fakeFetch(date, { signal }) {
  return new Promise((resolve, reject) => {
    const daysInMonth = date.daysInMonth();
    const daysToHighlight = [];
    const weekDifferences = date.diff(startingDate, 'week');
    const jobControlTableName = localStorage.getItem('jobControlTableName');
    console.log('fakeFetch year ' + date.format('YYYY') + "tableName " + jobControlTableName);


  //let testDay = dayjs('2023-10-1')

  // Loop through the days in the month and add the desired day of the week
  for (let day = 1; day <= daysInMonth; day++) {
    const dayOfWeek = dayjs(date).set('date', day).day();

    if (dayOfWeek === tuesday && weekDifference % 2 === 0) {
      daysToHighlight.push(day);
      const currentMonth = date.format('MMMM');
      console.log('current month is ' + currentMonth )
      badgeType = 'moon'
    }

    if (dayOfWeek === 4)
    {
      daysToHighlight.push(day);
      badgeType = 'sun';
    }
    if (dayOfWeek === tuesday) {
      weekDifference++;
    }

    
    //console.log("WEEK DIFF FAKE " +  weekDifference)
  }
  
    // Simulate the fetch operation
    const timeout = setTimeout(() => {
      resolve({ daysToHighlight });
    }, 500);

    signal.onabort = () => {
      clearTimeout(timeout);
      reject(new DOMException('aborted', 'AbortError'));
    };
  });
}

  
//getting tasks from s3 bucket (no status)
const getTasks = async (dayOfWeek, recurrence_pattern, suburb) => {
  return new Promise((resolve, reject) => {
    const requestBody = {
      dayOfWeek: dayOfWeek,
      recurrence_pattern: recurrence_pattern,
      suburb: suburb
    };

    axios
      .post(getTasksUrl, requestBody, requestConfig)
      .then((response) => {
          const task = response.data;
          resolve(task); // Resolve the promise with the data
      })
      .catch((error) => {
        console.error(error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          const errorMessage = 'error.response.data.message';
          reject(errorMessage); // Reject the promise with an error message
        } else {
          const errorMessage = 'Sorry, backend server is down, please try again later!';
          reject(errorMessage); // Reject the promise with an error message
        }
      });
  })
}

const initialValue = dayjs();
//2022-04-17 '2023-11-07'
function ServerDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, badgeType = [], ...other } = props;

  const isSelected =
    !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;
  //console.log('THE KEY IS: ' + props.day.toString())
    let badgeContent = '';
    const badgeTest = isSelected ? '🌚' : undefined;
    switch (badgeType) {
      case 'moon':
        badgeContent = isSelected ? '🌚' : undefined;
        break;
      case 'sun':
        badgeContent = isSelected ? '☀️' : undefined;
        break;
      case 'star':
        badgeContent = isSelected ? '⭐️' : undefined;
        break;
      default:
        badgeContent = undefined;
    }
    return (
      <div>
      <Badge
        key={props.day.toString()}
        overlap="circular"
        badgeContent={badgeContent}
      >
        <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
      </Badge>

      </div>

    );
}

// let jobControlTableName;
// if(window.localStorage.getItem('jobControlTableName')) {
//   // jobControlTableName = window.localStorage.getItem('jobControlTableName')
//   // console.log("first getIttem: " +  jobControlTableName)
//   console.log(getJobControlTableName())
// } else {

// }
console.log(jobTableNameFunction())
export default function DateCalendarServerRequest() {
  const location = useLocation();
  const currentPathname = location.pathname;
  //console.log("current path: " + currentPathname)
  const isCalendarRoute = location.pathname === '/calendar';
  //console.log('useLocation')

  const [csvHeaders, setCsvHeaders] = useState([]);
  const requestAbortController = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [highlightedDays, setHighlightedDays] = React.useState();
  // const [jobControlTableName, setJobControlTableName] = useState('');
  const jobControlTableName = localStorage.getItem('jobControlTableName');
  //console.log(jobControlTableName)
  
  //const jobControlTableName = 'Lower_Wycombe_Road_Neutral_Bay';
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const fetchHighlightedDays = (date) => {
    const controller = new AbortController();
    
    fakeFetch(date, {
      signal: controller.signal,
    })
      .then(({ daysToHighlight }) => {
        setHighlightedDays(daysToHighlight);
        setIsLoading(false);
      })
      .catch((error) => {
        // ignore the error if it's caused by `controller.abort`
        if (error.name !== 'AbortError') {
          throw error;
        }
      });

    requestAbortController.current = controller;
  };

  React.useEffect(() => {
    fetchHighlightedDays(initialValue);
    // abort request on unmount
    return () => requestAbortController.current?.abort();
  }, []);

  const handleMonthChange = (date) => {
    if (requestAbortController.current) {
      // make sure that you are aborting useless requests
      // because it is possible to switch between months pretty quickly
      requestAbortController.current.abort();
    }

    setIsLoading(true);
    setHighlightedDays([]);
    fetchHighlightedDays(date);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };


  //get headers
  async function gettingHeaders() {
    
      try {
        //console.log('gettigHeaders job table: ' + jobControlTableName)
        const requestBody = {
          dayOfWeek: "Tuesday",
          recurrence_pattern: "Fortnightly",
          suburb: jobControlTableName
        };
    
        const response = await axios.post(getTasksUrl, requestBody, requestConfig)
        const getData = await response.data.csvHeaders;
        setCsvHeaders(getData)
      } catch(error) {
            console.error(error);
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
              console.error('error.response.data.message');
            } else {
              console.error('Sorry, backend server is down, please try again later!');
            }
          };

  }

  useEffect(() => {
    if(jobControlTableName) {
      gettingHeaders();
    }

  
}, []);

useEffect(() => {

  console.log('csvHeaders:', csvHeaders);
}, [csvHeaders]);
  //-------------

  const [taskAndStatus, setTaskAndStatus] = useState({});
  const [weeklyTaskAndStatus, setWeeklyTaskAndStatus] = useState({});
  const [fortnightlyTaskAndStatus, setFortnightlyTaskAndStatus] = useState({});
  const [monthlyTaskAndStatus, setMonthlyTaskAndStatus] = useState({});
  const [isTaskAndStatusReady, setIsTaskAndStatusReady] = useState(false);

  let weeklyStatus = {};
  let fortnightlyStatus = {};
  let monthlyStatus = {};

  const [csvHeaderOrder, setCsvHeaderOrder] = useState('');

  const [weeklyTask, setWeeklyTask] = useState(null);
  const [fortnightlyTask, setFortnightlyTask] = useState([]);
  const [monthlyTask, setMonthlyTask] = useState([]);

  async function GetTaskStatus(date) {
    if(date && (jobControlTableName !== null || jobControlTableName || jobControlTableName !== '')) {
      try {
    const requestBody = {
      Date: date, //csvHeaderOrder,
      tableName: jobControlTableName
    };

    //console.log(csvHeaderOrder);
      if(date?.includes('Weekly')) {
      const response = await axios.post(getTaskStatusUrl, requestBody, requestConfig);
      const getData = await response.data;
      setWeeklyTaskAndStatus(getData);
      weeklyStatus = getData;
      //console.log('weekly:')
      //console.log(getData)
      setIsTaskAndStatusReady(true);

    } else if(date?.includes('Fortnightly')) {
      const response = await axios.post(getTaskStatusUrl, requestBody, requestConfig);
      const getData = await response.data;
      setFortnightlyTaskAndStatus(getData);
      fortnightlyStatus = getData;
      //console.log('fortnightly:')
      //console.log(getData)
      setIsTaskAndStatusReady(true);

    } else if (date?.includes('Monthly')) {
      const response = await axios.post(getTaskStatusUrl, requestBody, requestConfig);
      const getData = await response.data;
      setMonthlyTaskAndStatus(getData)
      monthlyStatus = getData;
      //console.log('monthlyly')
      //console.log(getData)
      setIsTaskAndStatusReady(true);
    }
  } catch(error) {
        console.error(error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.error('error.response.data.message');
        } else {
          console.error('Sorry, backend server is down, please try again later!');
        }
      };
    }
  }
  async function getTasksForSelectedDate(date) {
    let weekNumber = 2;
    let taskBody;
    let task;
    const weekDifference = selectedDate.diff(startingDate, 'week');
    //const dayFormat = selectedDate.format('DD');
    
    // console.log("starting date is " + weekDifference)
    // console.log("selected date is " + selectedDate)
    // console.log('day format ' + dayFormat)

    //ADD THIS IF STATEMENT LATER!!!
    if(jobControlTableName !== null || jobControlTableName || jobControlTableName !== '') {
        //if (date === 'Tuesday' && weekDifference % 2 === 0)
        
        if (csvHeaders.length > 0) {
//calculate monthly (once 4 weeks)
      if ((csvHeaders[2]?.includes(date) && weekDifference % 4 === 0) ||
          (csvHeaders[2]?.includes(dayjs().format('dddd')) && weekDifference % 4 === 0)) {
        try {
          //setTaskAndStatus({});
          const statusDate = selectedDate.format('YYYY-MM-DD') + '-' + csvHeaders[2]
          setCsvHeaderOrder(date);
          taskBody = await getTasks(date, 'Monthly', jobControlTableName)
          task = taskBody.csvData.filter(item => item !== "");
          setMonthlyTask({ task });
          GetTaskStatus(statusDate);
          //console.log(task);
        } catch (error) {
            console.error(error);
        }
      } else {
        setMonthlyTask(null);
        setCsvHeaderOrder(null);
      }

//calculate fortnightly only
        if ((csvHeaders[1]?.includes(date) && weekDifference % 2 === 0) ||
            (csvHeaders[1]?.includes(dayjs().format('dddd')) && weekDifference % 2 === 0)) {
          try {
            //setTaskAndStatus({});
            const statusDate = selectedDate.format('YYYY-MM-DD') + '-' + csvHeaders[1]
            setCsvHeaderOrder(date);
            taskBody = await getTasks(date, 'Fortnightly', jobControlTableName)
            task = taskBody.csvData.filter(item => item !== "");
            setFortnightlyTask({ task });
            GetTaskStatus(statusDate)
            //console.log(task);
          } catch (error) {
              console.error(error);
          }
        } else {
          setFortnightlyTask(null);
          setCsvHeaderOrder(null)
        }

//calculate weekly  
        if ((csvHeaders[0]?.includes(date)) ||
            (csvHeaders[0]?.includes(dayjs().format('dddd'))) ) {
          try {
            //setTaskAndStatus({});
            const statusDate = selectedDate.format('YYYY-MM-DD') + '-' + csvHeaders[0];
            setCsvHeaderOrder(date);
            taskBody = await getTasks(date, 'Weekly', jobControlTableName)
            task = taskBody.csvData.filter(item => item !== "");
            setWeeklyTask({ task });
            GetTaskStatus(statusDate)
            task = null;
            //console.log(task);
          } catch (error) {
              console.error(error);
          }
        } else {
          setWeeklyTask(null);
          setCsvHeaderOrder(null)
          //setTaskAndStatus({});
          setFortnightlyTask(null);
        }


        if(!csvHeaders[0]?.includes(date) || !csvHeaders[1]?.includes(date) || !csvHeaders[2]?.includes(date)) {
          setCsvHeaderOrder(null);
          //setTaskAndStatus({})
          setWeeklyTask(null);
          setFortnightlyTask(null);
          setMonthlyTask(null);
        }

        // Increment the week number after each Sunday
        if (date === 0) {
          weekNumber++;
        }
      }
    }
    //else {
    //   const noTask = 'No Task';
    //   setSelectedTask({ noTask, noTask, noTask });
    // }
     
  };

  useEffect(() => {
    getTasksForSelectedDate(selectedDate?.format('dddd'));
    //console.log(selectedDate.format('dddd'))
  }, [selectedDate, csvHeaders]);




  // React.useEffect(() => {
  //   GetTaskStatus().then(() => {
  //     setIsTaskAndStatusReady(true);
  //   })
  //   console.log('task and status');
  //   //console.log(taskAndStatus);

  // }, [csvHeaderOrder])

  const submitWeeklyTasks = () => {
    const user = getUser();
    const name = user !== 'undefined' && user ? user.name : '';
    const underscoredName = name?.split(' ').join('_');
    if (weeklyTask && isTaskAndStatusReady && (jobControlTableName !== null || jobControlTableName || jobControlTableName !== '')) {
      const updatedTaskAndStatus = { ...weeklyTaskAndStatus };
  
      weeklyTask.task.forEach((task, index) => {
        const checkboxId = `task-${task}`;
        const checkbox = document.getElementById(checkboxId);
        
        if(checkbox) {
          updatedTaskAndStatus[task] = checkbox ? checkbox.checked : false;
          
        }
        
          
        
      });
  ///////
      console.log(updatedTaskAndStatus);
      console.log(jobControlTableName)
      const requestBody = {
        tableName: jobControlTableName,
        Date: selectedDate.format('YYYY-MM-DD') + '-' + csvHeaders[0],//csvHeaderOrder,
        name: name,
        task: updatedTaskAndStatus
      };
      
      axios
        .post(calendarUrl, requestBody, requestConfig)
        .then((response) => {
            const user = response.data;
            console.log("tasks are done by " + user);
        })
        .catch((error) => {
          console.error(error);
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            const errorMessage = 'error.response.data.message';
            console.log(errorMessage)
          } else {
            console.log('Sorry, backend server is down, please try again later!');
          }
        });
    }
    alert("tasks submitted")
  };

  const submitFortnightlyTasks = () => {
    const user = getUser();
    const name = user !== 'undefined' && user ? user.name : '';
    const underscoredName = name?.split(' ').join('_');

    if (fortnightlyTask && isTaskAndStatusReady && (jobControlTableName !== null || jobControlTableName || jobControlTableName !== '')) {
      const updatedTaskAndStatus = { ...fortnightlyTaskAndStatus };
  
      fortnightlyTask.task.forEach((task, index) => {
        const checkboxId = `task-${task}`;
        const checkbox = document.getElementById(checkboxId);
  
        if (checkbox) {
          updatedTaskAndStatus[task] = checkbox.checked;

        }
      });
  ///////
      console.log(updatedTaskAndStatus);
      
      const requestBody = {
        tableName: jobControlTableName,
        Date: selectedDate.format('YYYY-MM-DD') + '-' + csvHeaders[1],//csvHeaderOrder,
        name: name,
        task: updatedTaskAndStatus
      };
      
      axios
        .post(calendarUrl, requestBody, requestConfig)
        .then((response) => {
            const user = response.data;
            console.log("tasks are done by " + user);
        })
        .catch((error) => {
          console.error(error);
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            const errorMessage = 'error.response.data.message';
            console.log(errorMessage)
          } else {
            console.log('Sorry, backend server is down, please try again later!');
          }
        });
    }
    alert("tasks submitted")
  };

  const submitMonthlyTasks = () => {
    const user = getUser();
    const name = user !== 'undefined' && user ? user.name : '';
    const underscoredName = name?.split(' ').join('_');

    if (monthlyTask && isTaskAndStatusReady && (jobControlTableName !== null || jobControlTableName || jobControlTableName !== '')) {
      const updatedTaskAndStatus = { ...monthlyTaskAndStatus };
  
      monthlyTask.task.forEach((task, index) => {
        const checkboxId = `task-${task}`;
        const checkbox = document.getElementById(checkboxId);
  
        if (checkbox) {
          updatedTaskAndStatus[task] = checkbox.checked;
  
        }
      });
  ///////
      console.log(updatedTaskAndStatus);
      console.log(csvHeaderOrder)
      const requestBody = {
        tableName: jobControlTableName,
        Date: selectedDate.format('YYYY-MM-DD') + '-' + csvHeaders[2],//csvHeaderOrder,
        name: name,
        task: updatedTaskAndStatus
      };
      
      axios
        .post(calendarUrl, requestBody, requestConfig)
        .then((response) => {
            const user = response.data;
            console.log("tasks are done by " + user);
        })
        .catch((error) => {
          console.error(error);
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            const errorMessage = 'error.response.data.message';
            console.log(errorMessage)
          } else {
            console.log('Sorry, backend server is down, please try again later!');
          }
        });
    }
    alert("tasks submitted")
  };
  
  const listWeeklyTasks = weeklyTask?.task && isTaskAndStatusReady ? (
    weeklyTask.task.map((task, index) => {
      const checkboxId = `task-${task}`;
      const isChecked = weeklyTaskAndStatus[task];
  
      const handleCheckboxChange = () => {
        // Update taskAndStatus map when the checkbox is changed
        const updatedTaskAndStatus = { ...weeklyTaskAndStatus };
        updatedTaskAndStatus[task] = !isChecked;
        // Set the updated map to your state
        setWeeklyTaskAndStatus(updatedTaskAndStatus);
      };
  
      return (
        <li key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label htmlFor={checkboxId} style={{ flex: 1 }}>{task}</label>
          <input
            type="checkbox"
            id={checkboxId}
            checked={isChecked}
            onChange={handleCheckboxChange}
            style={{ width: '20px', height: '20px', marginLeft: '10px' }}
          />
        </li>
      );
    })
  ) : (
    <li>No Weekly Tasks Today</li>
  );
  
  const listFortnightlyTasks = fortnightlyTask?.task && isTaskAndStatusReady ? (
    fortnightlyTask.task.map((task, index) => {
      const checkboxId = `task-${task}`;
      const isChecked = fortnightlyTaskAndStatus[task];
  
      const handleCheckboxChange = () => {
        // Update taskAndStatus map when the checkbox is changed
        const updatedTaskAndStatus = { ...fortnightlyTaskAndStatus };
        updatedTaskAndStatus[task] = !isChecked;
        // Set the updated map to your state
        setFortnightlyTaskAndStatus(updatedTaskAndStatus);
      };
  
      return (
        <li key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label htmlFor={checkboxId} style={{ flex: 1 }}>{task}</label>
          <input
            type="checkbox"
            id={checkboxId}
            checked={isChecked}
            onChange={handleCheckboxChange}
            style={{ width: '20px', height: '20px', marginLeft: '10px' }}
          />
        </li>
      );
    })
  ) : (
    <li>No Fortnightly Tasks Today</li>
  );

  const listMonthlyTasks = monthlyTask?.task && isTaskAndStatusReady ? (
    monthlyTask.task.map((task, index) => {
      const checkboxId = `task-${task}`;
      const isChecked = monthlyTaskAndStatus[task];
  
      const handleCheckboxChange = () => {
        // Update taskAndStatus map when the checkbox is changed
        const updatedTaskAndStatus = { ...monthlyTaskAndStatus };
        updatedTaskAndStatus[task] = !isChecked;
        // Set the updated map to your state
        setMonthlyTaskAndStatus(updatedTaskAndStatus);
      };
  
      return (
        <li key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label htmlFor={checkboxId} style={{ flex: 1 }}>{task}</label>
          <input
            type="checkbox"
            id={checkboxId}
            checked={isChecked}
            onChange={handleCheckboxChange}
            style={{ width: '20px', height: '20px', marginLeft: '10px' }}
          />
        </li>
      );
    })
  ) : (
    <li>No Monthly Tasks Today</li>
  );

  const navigate = useNavigate();
  const accountHandler = () => {
    navigate('/premium-content');
}

  return (
    // <div>
    //   {street === '' ? (
    //     <div>
    //     <h1>Please Clock in first to get the calendar Or your site does not have a calendar</h1>
    //     </div>
    //   ) : (
      isCalendarRoute && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Header title="Calendar" />
        <DateCalendar
          defaultValue={initialValue}
          loading={isLoading}
          value={selectedDate}
          onMonthChange={handleMonthChange}
          onChange={handleDateChange}
          renderLoading={() => <DayCalendarSkeleton />}
          // slots={{
          //   day: ServerDay,
          // }}
          style={{
            margin: "10px auto",
            marginTop: '2em',
            boxShadow: "5px 5px 20px rgba(0.5, 0.5, 0.5, 0.5)"
            
          }}
          slotProps={{
            day: {
              highlightedDays,
            },
          }}
        />
        <div style={{ padding: "10px", margin: "5px auto",
                      backgroundColor: "white", borderRadius: "5px",
                      maxWidth: "18.6em", boxShadow: "5px 5px 20px rgba(0.5, 0.5, 0.5, 0.5)",
                      height: "300px", overflowY: "auto" }}>
              <h4>{jobControlTableName} <br />Working Schedule:</h4>
              <p>{selectedDate.format('dddd')}</p>
                <ul>
                  <p style={{ fontWeight: "700"}}>Weekly tasks:</p>
                  {listWeeklyTasks}
                  <button style={{ position: 'relative', left:'15em', height: '2.5em' }} onClick={submitWeeklyTasks} >Submit</button>

                  <p style={{ fontWeight: "700"}}>Fortnightly tasks:</p>
                  {listFortnightlyTasks}
                  <button style={{ position: 'relative', left:'15em', height: '2.5em' }} onClick={submitFortnightlyTasks} >Submit</button>

                  <p style={{ fontWeight: "700"}}>Monthly tasks:</p>
                  {listMonthlyTasks}
                  <button style={{ position: 'relative', left:'15em', height: '2.5em' }}onClick={submitMonthlyTasks} >Submit</button>
                </ul>
          </div>
          <div className='background'></div>
      </LocalizationProvider>
    //   )}
      
    // </div>
      )
  );
}