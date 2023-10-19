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

  const street = localStorage.getItem('userStreet');
  const underscoredStreet = street.replace(/ /g, '_');

  const suburb = localStorage.getItem('userSuburb');
  const underscoredSuburb = suburb.replace(/ /g, '_');

  const tableName = underscoredStreet + "_" + underscoredSuburb;
  const tableNameSub = tableName + "_sub";
  const startDate = '2023-10-3'
  const getTaskUrl = 'https://lyg1apc3wl.execute-api.ap-southeast-2.amazonaws.com/prod/gettask';
  
function fakeFetch(date, { signal }) {
    return new Promise((resolve, reject) => {
      const daysInMonth = date.daysInMonth();
      const daysToHighlight = [];
  
      const tuesday = 3; // 0 = Sunday, 1 = Monday, 2 = Tuesday, etc.
    
    // Initialize a variable to keep track of the week number
    let weekNumber = 2;

    // Loop through the days in the month and add the desired day of the week
    for (let day = 0; day <= daysInMonth; day++) {
      const dayOfWeek = dayjs(date).set('date', day).day();
      console.log(dayOfWeek)
      // Check if it's a Tuesday and part of the second week
      if (dayOfWeek === tuesday && weekNumber % 2 === 0) {
        daysToHighlight.push(day);
      }

      // Increment the week number after each Sunday
      if (dayOfWeek === 0) {
        weekNumber++;
      }
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
  


const initialValue = dayjs('2023-10-02');
//2022-04-17
function ServerDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected =
    !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;

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

export default function DateCalendarServerRequest() {
  const requestAbortController = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [highlightedDays, setHighlightedDays] = React.useState([1, 2, 15]);

  
  //const tableName = 'Waterloo';
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [tasks, setTasks] = useState({});


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


  const [selectedTask, setSelectedTask] = useState(null);

  async function getTasksForSelectedDate(date) {
    const selectedDateKey = selectedDate.format('YYYY-MM-DD');
    const selectedTasks = tasks[selectedDateKey] || [];

    let weekNumber = 2;
    let taskBody;
    let recurrencePattern;
    let dayOfWeek;
    let task;
    //console.log(initialValue)
    const startDate = new Date(2023, 2, 1);
    while (startDate.getDay() !== 1) {
      startDate.setDate(startDate.getDate() + 1);
    }

    // Calculate the last day of the month
    const lastDayOfMonth = new Date(2023, 8 + 1, 0);
    // Get the day of the month (total days in the month)
    const totalDays = lastDayOfMonth.getDate();
    console.log(totalDays);
      if (date === 'Tuesday' && weekNumber % 2 === 0) {
        try {
          taskBody = await getTask(tableNameSub, 'fortnightly')
          recurrencePattern = taskBody.recurrence_pattern;
          dayOfWeek = taskBody.dayOfWeek;
          task = taskBody.task;
          setSelectedTask({ recurrencePattern, dayOfWeek, task });
          console.log(date);
        } catch (error) {
            console.error(error);
        }
      }
      else if (date === 'Thursday') {
        try {
          taskBody = await getTask(tableNameSub, 'monthly')
          recurrencePattern = taskBody.recurrence_pattern;
          dayOfWeek = taskBody.dayOfWeek;
          task = taskBody.task;
          setSelectedTask({ recurrencePattern, dayOfWeek, task });
          console.log(date);
        } catch (error) {
            console.error(error);
        }
      }
      else {
        const noTask = 'No Task';
        setSelectedTask({ noTask, noTask, noTask });
      }

      // Increment the week number after each Sunday
      if (date === 0) {
        weekNumber++;
      }
    
      return (
        <div>
            <p>Table name: {tableName}</p>
            <p>recurrence_pattern: {selectedTask?.recurrencePattern}</p>
            <p>Task: {selectedTask?.task}</p>
            <p>Day of task: {selectedTask?.dayOfWeek}</p>
        </div>

      )
     
  };

  useEffect(() => {
    getTasksForSelectedDate(selectedDate.format('dddd'));
    console.log(selectedDate.format('dddd'))
  }, [selectedDate]);
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
      <div>
            <h2>Selected Date:</h2>
            <p>{selectedDate.format('dddd')}</p>
            <p>Table name: {tableName}</p>
            <p>recurrence_pattern: {selectedTask?.recurrencePattern}</p>
            <p>Task: {selectedTask?.task}</p>
            <p>Day of task: {selectedTask?.dayOfWeek}</p>
        </div>
    </LocalizationProvider>
  );
}
