import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getUser } from '../service/AuthService';
import '../index.css';
import './locationStyle.css';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { LuAlarmClock } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import AccessInformation from './AccessInformation';
const { requestConfig, addressUrl, compareCoordinatesUrl, timeInUrl, timeOutUrl } = AccessInformation;

localStorage.clear();
let jobControlTableName;
let suburb;
export default function LocationFinder() {
  const navigate = useNavigate();
  const user = getUser();
  const loginEmail = user !== 'undefined' && user ? user.email : '';
  const name = user !== 'undefined' && user ? user.name : '';

  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [isWorking, setIsWorking] = useState(false);
  const [csvData, setCsvData] = useState([]); //to store csv address
  const [callusername, setCallUsername] = useState(null);
  const [isClockin, setIsClockin] = useState(false);
  const [isClockout, setIsClockout] = useState(false);

  const [showClockButtons, setShowClockButtons] = useState(false);
  const [calendar, setCalendar] = useState(false);
  const [loading, setLoading] = useState(false); // New state for loading indicator
  const [isLocation, setIsLocation] = useState(false);

  useEffect(() => {
    axios.get(addressUrl, requestConfig)
    .then((response) => {
      setCsvData(response.data);
      console.log('CSV Data:', response.data);
    })
    .catch((error) => {
      console.error(error);
    });
  }, [isWorking]);
  let watchId;
  const findMyLocation = (isWorking) => { 
    const success = (position) => {
      
      const latitude = position.coords.latitude //'-33.89964447974515';
      const longitude = position.coords.longitude //'151.1779410467535'
      console.log(latitude + ' ' + longitude)


      const timeOptions = {
        timeZone: "Australia/Sydney",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }

      const date = new Date();
      const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}, ${date.getHours()}:${date.getMinutes()}`;
        let matchFound = false;

          if(isWorking && latitude && longitude) {
            setStatus('');

            // const timeIn = new Date().toLocaleString("en-AU", timeOptions);
            const timeIn = formattedDate;

            const date = dayjs().format('YYYY-MM-DD')
            
            console.log(date)

            const requestBodyCompareCoordinates = {
              userLat: latitude,
              userLon: longitude,
              name: name,
              time: timeIn
            }

            axios.post(compareCoordinatesUrl, requestBodyCompareCoordinates, requestConfig)
            .then((response) => {
              setStatus('Clocked in successfully. \n You are working at' + '\n' + response.data.message + '\n' + timeIn);
              const splittedData = response.data.message.split(', ');
              suburb = splittedData[1];
              console.log(suburb);
              window.localStorage.setItem('suburb', suburb);
              console.log("local storage " + window.localStorage.getItem('suburb'));

              const requestBodyTimeIn = {
                email: loginEmail,
                timeIn: timeIn,
                date: date,
                address: response.data.message,
                lonAndLat: longitude + ', ' + latitude
              }

              axios.post(timeInUrl, requestBodyTimeIn, requestConfig)
              .then(response => {
                setIsWorking(true);
                setIsLocation(true);
                setLoading(false);
                setCalendar(true);
                matchFound = true;
                setIsClockin(true);
                setIsClockout(false);
                 console.log(isClockin)
                console.log('time ine saved')
              }).catch(error => {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    setMessage(error.response.data.message);
                    setStatus(error.response.data.message)
                }
                else {
                    setMessage('Sorry, backend server is down, please try again later')
                }
            })

            }).catch((error) => {
              console.log(error);
              setStatus(error.response.data.message);
              setLoading(false);
            })


          }
          else if (!isWorking) {
            const timeOut = new Date().toLocaleString("en-AU", timeOptions);
            setStatus('');
            setCalendar(false);
            const requestBodyCompareCoordinates = {
              userLat: latitude,
              userLon: longitude,
              name: name,
              time: timeOut
            }

            axios.post(compareCoordinatesUrl, requestBodyCompareCoordinates, requestConfig)
              .then((response) => {
                const address = response.data.message;

                const requestBodyTimeOut = {
                  email: loginEmail,
                  timeOut: timeOut,
                  address: address
                }

                axios.post(timeOutUrl, requestBodyTimeOut, requestConfig).then(response => {
                  setStatus('You have finished at:' + timeOut);
                  window.localStorage.removeItem('suburb');
                  setIsWorking(false);
                  setIsLocation(true);
                  setLoading(false);
                  setIsClockout(true);
                  matchFound = true;
                }).catch(error => {
                  if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                      setMessage(error.response.data.message);
                      setStatus(error.response.data.message);
                      setLoading(false);
                  }
                  else {
                      setMessage('Sorry, backend server is down, please try again later');
                      setLoading(false);
                  }
                })

              }).catch(error => {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    setMessage(error.response.data.message);
                    setStatus(error.response.data.message);
                    setLoading(false);
                }
                else {
                    setMessage('Sorry, backend server is down, please try again later');
                    setLoading(false);
                }
              })
          }

        
        if (!isLocation) {
          setLoading(false);
          setStatus('Your GPS may be incorrectly tracked, please try again. Your current location: ');
        }
    }

    const errors = () => {
        setStatus('Unble to retrieve your location, please unblock the location permission in your browser');
      }
      navigator.geolocation.getCurrentPosition(success, errors);
    };

    
    const handleClockin = () => {
        findMyLocation(true);
        setLoading(true);

      };
      
    const handleClockout = () => {
      
        findMyLocation(false);
        setLoading(true)
    
    }

    const punchClock = () => {
      setIsWorking(false);
      setCallUsername(loginEmail);

      console.log("Punch Clock clicked " + loginEmail);
      setShowClockButtons((prevShowClockButtons) => !prevShowClockButtons);
    }
   
    const handleCalendar = () => {
      navigate('/calendarsearching');
    }
  return (
    <div>
      
      <button className="punch-button" onClick={punchClock}><LuAlarmClock /> Punch Clock</button>
    
        <div className={`clockin-clockout ${showClockButtons ? 'active' : 'inactive'}`}>
          <button className='clockin' onClick={handleClockin}>Clock-in</button>
          <button className='clockout' onClick={handleClockout}>Clock-out</button>
          {loading && (
                <Box sx={{ position: "fixed", top: "40%", left: "45%", zIndex: "1000" }}>
                  <CircularProgress />
                </Box>
            )}
          <p className="status">{status}</p>

          <div className={`calendar-button ${calendar ? 'active' : 'inactive'}`}>
              <button className='go-to-calendar-button' onClick={handleCalendar}>Go to Calendar</button>
          </div>
        </div>

    </div>
  );
};

const jobTableNameFunction = () => {
  if(jobControlTableName){
    console.log('this is the export function')
    return jobControlTableName;
  }
  return "some error!!!!"
}
export { jobTableNameFunction }