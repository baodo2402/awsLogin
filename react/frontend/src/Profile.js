import React, { useState } from 'react';
import { getUser, getToken } from './service/AuthService';
import LocationFinder from './service/LocationFinderService';
import { useNavigate } from 'react-router-dom';
import './index.css';
import axios from 'axios';

const triggerChangeInfoUrl = 'https://lyg1apc3wl.execute-api.ap-southeast-2.amazonaws.com/prod/triggerchangeinfo';

const Profile = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);
    const [password, setPassword] = useState('');
    const token = getToken();
    const user = getUser();
    const username = user !== 'undefined' && user ? user.username : '';
    const name = user !== 'undefined' && user ? user.name : '';
    const email = user !== 'undefined' && user ? user.email : '';

    const accountHandler = () => {
        navigate('/premium-content');
    }
    const submitHandler = (event) => {
        event.preventDefault();
        if (username.trim() === '' || token.trim() === '' || password.trim() ==='') {
            setMessage('password is empty or your session is out, please try again');
            return;
        }
        setMessage(null);
        const requestConfig = {
            headers: {
                'x-api-key': 'EmYB7EcYzn2NK1dUkD2kK8MA18r5dp6tQ7wB7U1d'
            }
        }
        const requestBody = {
            password: password,
            token: token,
            username: username
        }

        axios.post(triggerChangeInfoUrl, requestBody, requestConfig).then(response => {
            navigate('/changeInfo');
        }).catch(error => {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                setMessage(error.response.data.message);
            }
            else {
                setMessage('Sorry, backend server is down, please try again later')
            }
        })
    }
    const profile = {
        marginTop: '20%',
        fontSize: '22px',
        padding: '0 0 0 10px',
        backgroundColor: 'white',
        borderRadius: '10px'
    }

    const input = {
        marginTop: '10%',
        fontSize: '22px',
        padding: '0 0 0 10px',
        margin: '0 10px 0 10px',
        backgroundColor: 'white',
        borderRadius: '10px'
    }
    const backButton = {
        position: 'absolute',
        top: '10px',
        right: '15px',
        width: '7em',
        height: '2em',
        fontWeight: '500',
        fontSize: '15px'
    }

    return (
        <div className='profile-layout'>
            <header>
                <button style={backButton}onClick={accountHandler}>Back</button>
            </header>
            <div style={profile}>
                <h5>Employee Profile</h5>
                Name: {name} <br/>
                Email: {email}<br/>
                Username: {username}<br/>
            </div>
            <div style={input}>
            <p style={{fontSize: '14px', color: 'red'}}>For security, please type in your password to update your profile</p>
                Password: <br/>
                <form onSubmit={submitHandler}>
                    <input type="password" value={password} onChange={event => setPassword(event.target.value)} /> <br/>
                    <input type="submit" value="Submit" />
                </form>
                
            </div>
        </div>
    )
}
export default Profile;