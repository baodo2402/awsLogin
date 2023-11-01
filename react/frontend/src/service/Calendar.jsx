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

var weekOfYear = require('dayjs/plugin/weekOfYear')
dayjs.extend(weekOfYear);


  const street = localStorage.getItem('userStreet');
  const underscoredStreet = street.replace(/ /g, '_');

  const suburb = localStorage.getItem('userSuburb');
  const underscoredSuburb = suburb.replace(/ /g, '_');

  const tableName = underscoredStreet + "_" + underscoredSuburb;
  //const tableNameSub = tableName + "_sub";
  const startingDate = '2023-10-03'

  const getTaskUrl = 'https://lyg1apc3wl.execute-api.ap-southeast-2.amazonaws.com/prod/gettask';
  const getTasksUrl = 'https://lyg1apc3wl.execute-api.ap-southeast-2.amazonaws.com/prod/gettasks';


  let csvHeaders = [];

// function GetHeaders() {
//   const gettingHeaders = () => {
//     const requestConfig = {
//       headers: {
//         'x-api-key': 'EmYB7EcYzn2NK1dUkD2kK8MA18r5dp6tQ7wB7U1d'
//       }
//     }
//     const requestBody = {
//       dayOfWeek: "Tuesday",
//       recurrence_pattern: "Fortnightly",
//       suburb: "Wycombe" //must be suburb (using Wycombe for testing only)
//     };

//     axios
//       .post(getTasksUrl, requestBody, requestConfig)
//       .then((response) => {
//         csvHeaders = response.data.csvHeaders;
//         console.log(csvHeaders)
//         console.log(csvHeaders[0])
//       })
//       .catch((error) => {
//         console.error(error);
//         if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//           console.error('error.response.data.message');
//         } else {
//           console.error('Sorry, backend server is down, please try again later!');
//         }
//       });
//   }
//   useEffect(() => {
//       gettingHeaders()
//   }, []);
  
  
    
// }
  
  //let testDay = dayjs('2023-1-1');
  
    //let weekDifference = testDay?.week();
    let weekDifference = 1
  console.log("iso week " + weekDifference)
 
//// info for obtaining data
const tuesday = 2; // 0 = Sunday, 1 = Monday, 2 = Tuesday, etc.

let testDay = dayjs('2023-1-1').locale({
  week: {
      dow: 1, // Monday is the first day of the week
      doy: 4  // The week that contains January 4th is the first week of the year
  }
});

function fakeFetch(date, { signal }) {
    return new Promise((resolve, reject) => {
      const daysInMonth = testDay.daysInMonth();
      const daysToHighlight = [];

    //let testDay = dayjs('2023-10-1')
  
    // Loop through the days in the month and add the desired day of the week
    for (let day = 1; day <= daysInMonth; day++) {
      const dayOfWeek = dayjs(date).set('date', day).day();
      
      if (dayOfWeek === tuesday && weekDifference % 2 === 0) {
        daysToHighlight.push(day);
        const currentMonth = testDay.format('MMMM');
        console.log('current month is ' + currentMonth )
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
  


  const getTask = async (tableNameSub, recurrence_pattern) => {
    return new Promise((resolve, reject) => {
      const requestConfig = {
        headers: {
          'x-api-key': 'EmYB7EcYzn2NK1dUkD2kK8MA18r5dp6tQ7wB7U1d'
        }
      };
      const requestBody = {
        tableNameSub: tableNameSub,
        recurrence_pattern: recurrence_pattern
      };
  
      axios
        .post(getTaskUrl, requestBody, requestConfig)
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
    });
  };
  
const getTasks = async (dayOfWeek, recurrence_pattern, suburb) => {
  return new Promise((resolve, reject) => {
    const requestConfig = {
      headers: {
        'x-api-key': 'EmYB7EcYzn2NK1dUkD2kK8MA18r5dp6tQ7wB7U1d'
      }
    };
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

const initialValue = dayjs('2023-1-2');
//2022-04-17
function ServerDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected =
    !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;
  //console.log('THE KEY IS: ' + props.day.toString())
  if (tableName == 'McEvoy_Street_Waterloo') {
    return (
      <Badge
        key={props.day.toString()}
        overlap="circular"
        badgeContent={isSelected ? '🌚' : undefined}
      >
        <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
      </Badge>
    );
    }
}
//GetHeaders();
export default function DateCalendarServerRequest() {
  const [csvHeaders, setCsvHeaders] = useState([]);

  const requestAbortController = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [highlightedDays, setHighlightedDays] = React.useState();

  
  //const tableName = 'Waterloo';
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
  const gettingHeaders = () => {
    const requestConfig = {
      headers: {
        'x-api-key': 'EmYB7EcYzn2NK1dUkD2kK8MA18r5dp6tQ7wB7U1d'
      }
    }
    const requestBody = {
      dayOfWeek: "Tuesday",
      recurrence_pattern: "Fortnightly",
      suburb: "Wycombe" //must be suburb (using Wycombe for testing only)
    };

    axios
      .post(getTasksUrl, requestBody, requestConfig)
      .then((response) => {
        const getData = response.data.csvHeaders;
        setCsvHeaders(getData);
        console.log("csv headers are: " + csvHeaders);
        console.log("index csv headers: " + csvHeaders[0])
      })
      .catch((error) => {
        console.error(error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.error('error.response.data.message');
        } else {
          console.error('Sorry, backend server is down, please try again later!');
        }
      });
  }
  // useEffect(() => {
  //     gettingHeaders()
  // }, []);

  useEffect(() => {
    console.log('csvHeaders:', csvHeaders);
  }, [csvHeaders]);
  //-------------

  const [weeklyTask, setWeeklyTask] = useState(null);
  const [fortnightlyTask, setFortnightlyTask] = useState([]);
  const [monthlyTask, setMonthlyTask] = useState([]);

  async function getTasksForSelectedDate(date) {
    console.log("getTask function called!")
    let weekNumber = 2;
    let taskBody;
    let task;

    const weekDifference = selectedDate.diff(startingDate, 'week');
    const dayFormat = selectedDate.format('DD');
    
    // console.log("starting date is " + weekDifference)
    // console.log("selected date is " + selectedDate)
    // console.log('day format ' + dayFormat)

    //ADD THIS IF STATEMENT LATER!!!
    //if (tableName === "Gladstone_Parade_Lindfield" || tableName === 'Wycombe') {

      //calculate fortnightly
        //if (date === 'Tuesday' && weekDifference % 2 === 0)
        //calculate weekly
        if (csvHeaders[0]?.includes(date)) {
          try {
            taskBody = await getTasks(date, 'Weekly', "Wycombe")
            task = taskBody.csvData.filter(item => item !== "");
            setWeeklyTask({ task });
            console.log(task);
          } catch (error) {
              console.error(error);
          }
        } else {
          const noTask = 'No Task';
          setWeeklyTask({ noTask, noTask, noTask });
          setFortnightlyTask(null);
          console.log("success");
        }

        if ((csvHeaders[1]?.includes(date) && weekDifference % 2 === 0)
                  && csvHeaders[0].includes(date)) {
          try {
            taskBody = await getTasks(date, 'Fortnightly', "Wycombe")
            task = taskBody.csvData.filter(item => item !== "");
            setFortnightlyTask({ task });
            console.log(task);
          } catch (error) {
              console.error(error);
          }

          try {
            taskBody = await getTasks(date, 'Weekly', "Wycombe")
            task = taskBody.csvData.filter(item => item !== "");
            setWeeklyTask({ task });
            console.log(task);
          } catch (error) {
              console.error(error);
          }
        } else {
          const noTask = 'No Task';
          //setWeeklyTask({ noTask, noTask, noTask });
          setFortnightlyTask(null);
          console.log("success");
        }

        //calculate monthly (first week of the month)
        if (csvHeaders[2]?.includes(date) && dayFormat <=7) {
          try {
            taskBody = await getTasks(date, 'Monthly', "Wycombe")
            task = taskBody.csvData.filter(item => item !== "");
            setMonthlyTask({ task });
            console.log(task);
          } catch (error) {
              console.error(error);
          }
        } else {
          const noTask = 'No Task';
          setMonthlyTask(null)
          console.log("success");
        }
        if(!csvHeaders[0]?.includes(date) || !csvHeaders[1].includes(date) || !csvHeaders[2].includes(date)) {
          setWeeklyTask(null);
          setFortnightlyTask(null);
          setMonthlyTask(null);
          console.log("success");
        }

        // Increment the week number after each Sunday
        if (date === 0) {
          weekNumber++;
        }
    // } else {
    //   const noTask = 'No Task';
    //   setSelectedTask({ noTask, noTask, noTask });
    // }
     
  };

  useEffect(() => {
    getTasksForSelectedDate(selectedDate?.format('dddd'));
    console.log(selectedDate.format('dddd'))
  }, [selectedDate]);

  const listWeeklyTasks = weeklyTask?.task ? (
    weeklyTask.task.map((number) => (
    <li>{number}</li>
  ))
  ) : (
    <li>No Weekly Tasks Today</li>
  );

  const listFortnightlyTasks = fortnightlyTask?.task ? (
    fortnightlyTask.task.map((number) => (
    <li>{number}</li>
  ))
  ) : (
    <li>No Fortnightly Tasks Today</li>
  );

  const listMonthlyTasks = monthlyTask?.task ? (
    monthlyTask.task.map((number) => (
    <li>{number}</li>
  ))
  ) : (
    <li>No Monthly Tasks Today</li>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        defaultValue={initialValue}
        loading={isLoading}
        value={selectedDate}
        onMonthChange={handleMonthChange}
        onChange={handleDateChange}
        renderLoading={() => <DayCalendarSkeleton />}
        slots={{
          day: ServerDay,
        }}
        slotProps={{
          day: {
            highlightedDays,
          },
        }}
      />
      <div style={{ padding: "15px", margin: "30px auto",
                    backgroundColor: "white", borderRadius: "40px",
                    border: "1.5px solid #333",
                    maxWidth: "20em" }}>
            <h2>Working Schedule:</h2>
            <p>{selectedDate.format('dddd')}</p>
              <ul>
                <p style={{ fontWeight: "700"}}>Weekly tasks:</p>
                {listWeeklyTasks}
                <p style={{ fontWeight: "700"}}>Fortnightly tasks:</p>
                {listFortnightlyTasks}
                <p style={{ fontWeight: "700"}}>Monthly tasks:</p>
                {listMonthlyTasks}
              </ul>
        </div>
    </LocalizationProvider>
  );
}
