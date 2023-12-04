import React, { useState } from "react";
import SearchBar from "./SearchBar";
import { Header } from "./Header";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import './service/CalendarStyle.css'

const dayjs = require('dayjs');

const startingDate = '2023-01-02';
const inputDate = '2023-01-08';

const test = () => {
    const weekDifferences = dayjs(inputDate).diff(startingDate, 'week');
    console.log(weekDifferences);
};


export default function CalendarSearching() {
    const [startDate, setStartDate] = useState('');
    const [inputDate, setInputDate] = useState('');

    const [selectedDate, setSelectedDate] = useState(null);
    const [startingDate, setStartingDate] = useState('');
    const weekDifferences = selectedDate ? selectedDate.diff(startingDate, 'week') : null;

    const handleStartingDateChange = (date) => {
        setStartingDate(date);
        console.log('Starting Date: ', date);
      };

    const handleDateChange = (date) => {
      setSelectedDate(date);
      // You can do something with the selected date here
      console.log('Selected Date: ', date);
    };

    const MUIInputStyle = {
        borderRadius: "0",
        backgroundColor: 'white'
    }

    return (
        <div>
            <Header title="Calendar Search" />
            <SearchBar />

            <div className="date-picker-container">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
                <DatePicker
                    label="Set Starting Date (Monday only)"
                    value={startingDate}
                    onChange={handleStartingDateChange}
                    renderInput={(params) => <input {...params}/> }
                    />
            </DemoContainer>
            </LocalizationProvider>
            </div>




            <div  className="date-picker-container">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
                <DatePicker
                    label="Pick A Date"
                    value={selectedDate}
                    onChange={handleDateChange}
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
                {weekDifferences}
            </h3>
            </div>

                <div className='background-img'></div>
        </div>
    )
}