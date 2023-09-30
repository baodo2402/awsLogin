import React, { useState } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { Badge } from '@mui/material';
import dayjs from 'dayjs';
import axios from "axios";
import { render } from "@testing-library/react";

const Calendar = () => {
    const street = localStorage.getItem('userStreet');
    const underscoredStreet = street.replace(/ /g, '_');
    const suburb = localStorage.getItem('userSuburb');

    const tableName = underscoredStreet + "_" + suburb;
    //const tableName = 'Waterloo';
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [tasks, setTasks] = useState({});

    const handleDateChange = (date) => {
        setSelectedDate(date);
      };

  //   const renderDay = (day, _value, dayPickerProps) => {
  //     const isTuesday = dayjs(day).day() === 2; // Tuesday is 2 in dayjs
  //     const isWednesday = dayjs(day).day() === 3; // Wed is 3
      
  //     if (tableName === "McEvoy_Street_Waterloo" && isTuesday) {
  //       return (
  //         <Badge
  //           badgeContent="hello"
  //           color="error"
  //           variant="dot"
  //           anchorOrigin={{
  //             vertical: "top",
  //             horizontal: "right",
  //           }}
  //         >
  //           {dayjs(day).format("D")}
  //         </Badge>
  //       );
  //     } else if (tableName === "Petershame" && isWednesday) {
  //       const weekNumber = dayjs(day).week();
  //       if (weekNumber % 2 === 0) {
  //         return (
  //           <Badge
  //             badgeContent="hello"
  //             color="success"
  //             variant="dot"
  //             anchorOrigin={{
  //               vertical: "top",
  //               horizontal: "right",
  //             }}
  //           >
  //             {dayjs(day).format("D")}
  //           </Badge>
  //         );
  //       }
  //     }
  
  //     //return dayjs(day).format("D");
  //  }
  const renderDay = (day) => {
    const isTuesday = dayjs(day).day() === 2; // Tuesday is 2 in dayjs

    return (
        <div>
            {isTuesday && (
                <Badge
                    badgeContent="Tuesday"
                    color="primary"
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                >
                    {dayjs(day).format("D")}
                </Badge>
            )}
            {!isTuesday && <span>{dayjs(day).format("D")}</span>}
        </div>
    );
    };

    
      const getTasksForSelectedDate = () => {
        const selectedDateKey = selectedDate.format('YYYY-MM-DD'); // Format the date as "YYYY-MM-DD"
        const selectedTasks = tasks[selectedDateKey] || [];
      
        // Render the tasks for the selected date
        return (
            <div>
                <h2>Selected Date:</h2>
                <p>{selectedDate.format('MMMM D, YYYY')}</p>
                <p>Table name: {tableName}</p>


            </div>
        
        );
      };
      
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StaticDatePicker
          orientation="portrait"
          value={selectedDate}
          onChange={handleDateChange}
          renderDay={renderDay}
          
          />
        {getTasksForSelectedDate()}
        </LocalizationProvider>
      );
}

export default Calendar;