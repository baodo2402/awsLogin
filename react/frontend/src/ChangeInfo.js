import React, { useState } from 'react';
import { getUser, getToken } from './service/AuthService';
import LocationFinder from './service/LocationFinderService';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';
import './profileStyle.css'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Header } from './Header';
import ColumTaskBar from './ColumnTaskBar';
import AccessInformation from './service/AccessInformation';

const { requestConfig, triggerChangeInfoUrl} = AccessInformation;


const Profile = () => {
    
    const user = getUser();
    const loginEmail = user !== 'undefined' && user ? user.email : '';
    const email = user !== 'undefined' && user ? user.email : '';
    

}
const ChangeInfo = () => {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newName, setNewName] = useState('');
    const [newPhoneNumber, setNewPhoneNumber] = useState(null);
    const [loading, setLoading] = useState(false);

    const token = getToken();
    const user = getUser();

    const username = user !== 'undefined' && user ? user.username : '';
    const email = user !== 'undefined' && user ? user.email : '';
    const name = user !== 'undefined' && user ? user.name : '';
    const phoneNumber = user !== 'undefined' && user ? user.phoneNumber : '';

    const [errorMessage, setErrorMessage] = useState(null);
    const [message, setMessage] = useState(null);

    const submitHandler = (event) => {
        event.preventDefault();
        setLoading(true)
        if (newPassword === '') {
            setMessage('Password required');
            setLoading(false)
            return;
        }
        
        setErrorMessage(null);

        const requestBody = {
            newName: newName ? newName : name,
            newUsername: newUsername ? newUsername : username,
            newPhoneNumber: newPhoneNumber ? newPhoneNumber : phoneNumber,
            newPassword: newPassword,
            email: email
        }

        axios.post(triggerChangeInfoUrl, requestBody, requestConfig).then((response) => {
            setMessage('Information changed successfully');
            setLoading(false)
        }).catch((error) => {
            console.error(error);
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Sorry, backend server is down, please try again later!');
            }
        })
        //console.log('login button is pressed');
    }

    return (
        <div>
            <Header title='Change Information' />
            <ColumTaskBar columnDisplay='none' />
            <div className='trigger-change-info'>

            <form onSubmit={submitHandler}>
                <h5>Update Your Information</h5>
                Name: <br />
                <input type='text' defaultValue={name} onChange={(event) => setNewName(event.target.value)} /> <br />
                Username: <br />
                <input type='text' defaultValue={username} onChange={(event) => setNewUsername(event.target.value)} /> <br />
                Phone Number: <br />
                <input type='number' defaultValue={phoneNumber} onChange={(event) => setNewPhoneNumber(event.target.value)} /> <br />
                Password: <br/>
                <input type="password" placeholder='******' onChange={(event) => setNewPassword(event.target.value)} /> <br/>
                <input type="submit" value="Submit" />
                
            </form>
            {loading && (
                <Box sx={{ position: "fixed", top: "40%", left: "45%", zIndex: "1000" }}>
                <CircularProgress />
                </Box>
            )}
            {errorMessage && <p className="message">{errorMessage}</p>}
            {message && <p>{message}</p>}
            <div className='background'></div>
            </div>
        </div>
        
    )
}
export default ChangeInfo;