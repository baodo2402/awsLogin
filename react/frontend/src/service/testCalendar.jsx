import React, { useState, useEffect } from 'react';

const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

function isTuesday(date) {
  return date.getDay() === 2; // Tuesday
}

function isThursday(date) {
  return date.getDay() === 4; // Thursday
}

function generateCalendar(year, month) {
  const totalDays = daysInMonth(year, month);
  const calendar = [];

  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(year, month, day);
    const isFortnightlyTuesday = isTuesday(date) && day % 14 === 1;
    const isWeeklyThursday = isThursday(date);

    calendar.push({
      date,
      isFortnightlyTuesday,
      isWeeklyThursday,
    });
  }

  return calendar;
}

function MonthlyCalendar() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [calendar, setCalendar] = useState(generateCalendar(year, month));

  useEffect(() => {
    setCalendar(generateCalendar(year, month));
  }, [year, month]);

  const previousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <div>
      <h1>Monthly Calendar</h1>
      <div>
        <button onClick={previousMonth}>Previous Month</button>
        <span>
          {new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        <button onClick={nextMonth}>Next Month</button>
      </div>
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'center' }}>Sun</th>
            <th style={{ textAlign: 'center' }}>Mon</th>
            <th style={{ textAlign: 'center' }}>Tue</th>
            <th style={{ textAlign: 'center' }}>Wed</th>
            <th style={{ textAlign: 'center' }}>Thu</th>
            <th style={{ textAlign: 'center' }}>Fri</th>
            <th style={{ textAlign: 'center' }}>Sat</th>
          </tr>
        </thead>
        <tbody>
          {calendar.map((day) => (
            <td
              key={day.date.getDate()}
              style={{
                textAlign: 'center',
                backgroundColor: day.isFortnightlyTuesday ? 'lightgreen' : day.isWeeklyThursday ? 'lightblue' : 'transparent',
              }}
            >
              {day.date.getDate()}
            </td>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MonthlyCalendar;
