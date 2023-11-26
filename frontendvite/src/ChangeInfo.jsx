import React, { useState } from 'react';
import { getUser, getToken } from './service/AuthService';
import LocationFinder from './service/LocationFinderService';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';

const triggerChangeInfoUrl = 'https://lyg1apc3wl.execute-api.ap-southeast-2.amazonaws.com/prod/changeinfo';

const Profile = () => {
    
    const user = getUser();
    const loginUsername = user !== 'undefined' && user ? user.username : '';
    const email = user !== 'undefined' && user ? user.email : '';

}
const ChangeInfo = () => {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newName, setNewName] = useState('');

    const token = getToken();
    const user = getUser();

    const username = user !== 'undefined' && user ? user.username : '';
    const email = user !== 'undefined' && user ? user.email : '';
    const name = user !== 'undefined' && user ? user.name : '';

    const [errorMessage, setErrorMessage] = useState(null);
    const [message, setMessage] = useState(null);

    const submitHandler = (event) => {
        event.preventDefault();
        if (newEmail === '', newName === '', newPassword === '') {
            setMessage('All field are required');
            return;
        }
        
        setErrorMessage(null);

        const requestConfig = {
            headers: {
                'x-api-key': 'EmYB7EcYzn2NK1dUkD2kK8MA18r5dp6tQ7wB7U1d'
            }
        }
        const requestBody = {
            newName: newName,
            newEmail: newEmail,
            newPassword: newPassword,
            username: username
        }

        axios.post(triggerChangeInfoUrl, requestBody, requestConfig).then((response) => {
            setMessage('Information changed successfully');
            
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

    const backButtonHandler = () => {
        navigate('/premium-content');
    }
    return (
        <>
        <div className='trigger-change-info'>
            <form onSubmit={submitHandler}>
                <h5>Update Information</h5>
                Name: <br />
                <input type='text' value={name} onChange={(event) => setNewName(event.target.value)} /> <br />
                Email: <br />
                <input type='text' value={email} onChange={(event) => setNewEmail(event.target.value)} /> <br />

                Password: <br/>
                <input type="password" placeholder='******' onChange={(event) => setNewPassword(event.target.value)} /> <br/>
                <input type="submit" value="Submit" />
            </form>
            {errorMessage && <p className="message">{errorMessage}</p>}
            <button onClick={backButtonHandler}>Back</button>
        </div>
        </>
    )
}
export default ChangeInfo;