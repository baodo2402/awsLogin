import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { loginUsername } from '../PremiumContent';

const addressUrl = 'https://lyg1apc3wl.execute-api.ap-southeast-2.amazonaws.com/prod/csvAddress';
const timeInUrl = 'https://lyg1apc3wl.execute-api.ap-southeast-2.amazonaws.com/prod/timein';
const timeOutUrl = 'https://lyg1apc3wl.execute-api.ap-southeast-2.amazonaws.com/prod/timeout';

const LocationFinder = () => {
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [isWorking, setIsWorking] = useState(false);
  const [csvData, setCsvData] = useState([]); //to store csv address
  const requestConfig = {
    headers: {
        'x-api-key': 'EmYB7EcYzn2NK1dUkD2kK8MA18r5dp6tQ7wB7U1d'
    }
  }

  useEffect(() => {
    // Make a GET request to your Lambda function's endpoint
  axios.get(addressUrl, requestConfig)
    .then((response) => {
      setCsvData(response.data);
      console.log('CSV Data:', response.data);
    })
    .catch((error) => {
      console.error(error);
    });
  }, [isWorking]); // This will run once when the component mounts
  let watchId;
  const findMyLocation = (isWorking) => { 
    const success = (position) => {
      console.log(position);
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      //console.log(latitude + " " + longitude);

      const geoApiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      fetch(geoApiUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        let matchFound = false;
        for (let i = 0; i <= csvData.length; i++) {
          if(
            isWorking &&
            csvData[i].street  === data.address.road &&
            csvData[i].suburb === data.address.suburb
            ) {
            const timeIn = new Date().toLocaleString("en-AU", {
              timeZone: "Australia/Sydney",
            });
            const requestBodyTimeIn = {
              username: loginUsername,
              timeIn: timeIn
            }
            axios.post(timeInUrl, requestBodyTimeIn, requestConfig).then(response => {
              setStatus('You are working at: ' + csvData[i].street + ' ' + csvData[i].suburb + '\n at ' + timeIn);
              setIsWorking(true);
              matchFound = true;
            }).catch(error => {
              if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                  setMessage(error.response.data.message);
              }
              else {
                  setMessage('Sorry, backend server is down, please try again later')
              }
          })
            break;
          }
          else if (
            !isWorking &&
            csvData[i].street  === data.address.road &&
            csvData[i].suburb === data.address.suburb
          
          ) {
            const timeOut = new Date().toLocaleString("en-AU", {
              timeZone: "Australia/Sydney",
            });
            const requestBodyTimeOut = {
              username: loginUsername,
              timeOut: timeOut
            }
            axios.post(timeOutUrl, requestBodyTimeOut, requestConfig).then(response => {
              setStatus('You are finished at ' + timeOut);
              setIsWorking(false);
            }).catch(error => {
              if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                  setMessage(error.response.data.message);
              }
              else {
                  setMessage('Sorry, backend server is down, please try again later')
              }
          })
            
            break;
          }
          else if(!matchFound) {
            setMessage('Your GPS may be incorrectly tracked, please try again');
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      navigator.geolocation.clearWatch(watchId);
    }

    const errors = () => {
        status.textContent = 'Unble to retrieve your location, please unblock the location permission in your browser'
        navigator.geolocation.clearWatch(watchId);
      }
      navigator.geolocation.getCurrentPosition(success, errors);
    };


    const handleClockin = () => {
        findMyLocation(true);
        //setIsWorking(true);
        
      };
    const handleClockout = () => {
        findMyLocation(false);
        //setIsWorking(false);
        setMessage('You finished work, call it a day!');
        
    }

  return (
    <div>
      <p className="status">{status}</p>
      <button onClick={handleClockin}>Clock-in</button>
      <button onClick={handleClockout}>Clock-out</button>
    </div>
  );
};

export default LocationFinder;
