import * as React from 'react';
import dayjs from 'dayjs';
import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import axios from 'axios';



function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}


function fakeFetch(date, { signal }) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      const daysInMonth = date.daysInMonth();
      const daysToHighlight = [1, 2, 3].map(() => getRandomNumber(1, daysInMonth));

      resolve({ daysToHighlight });
    }, 500);

    signal.onabort = () => {
      clearTimeout(timeout);
      reject(new DOMException('aborted', 'AbortError'));
    };
  });
}

const initialValue = dayjs('2022-04-17');

function ServerDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected =
    !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;

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

export default function WorkingSchedule() {
  const requestAbortController = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [highlightedDays, setHighlightedDays] = React.useState([1, 2, 15]);
  const [csvHeaders, setCsvHeaders] = React.useState([]);

  const street = localStorage.getItem('userStreet').split(' ').join('_')
  const suburb = localStorage.getItem('userSuburb').split(' ').join('_')
  
  //const tableNameSub = tableName + "_sub";
  const startingDate = '2023-10-03'

  const getTasksUrl = 'https://lyg1apc3wl.execute-api.ap-southeast-2.amazonaws.com/prod/gettasks';


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
      //get headers
      const GetHeaders = () => {
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
      React.useEffect(() => {
          GetHeaders()
      }, []);


    const [weeklyTask, setWeeklyTask] = React.useState(null);
    const [fortnightlyTask, setFortnightlyTask] = React.useState([]);
    const [monthlyTask, setMonthlyTask] = React.useState([]);

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

