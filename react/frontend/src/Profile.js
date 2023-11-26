import React, { useState } from 'react';
import { getUser, getToken } from './service/AuthService';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CgProfile } from 'react-icons/cg';
import './profileStyle.css'
import { FaPenAlt } from 'react-icons/fa';
import { Header } from './Header';

const triggerChangeInfoUrl = 'https://lyg1apc3wl.execute-api.ap-southeast-2.amazonaws.com/prod/triggerchangeinfo';

const Profile = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);
    const [password, setPassword] = useState('');
    const [showPasswordField, setShowPasswordField] = useState(false);
    const [isPasswordInputDisabled, setIsPasswordInputDisabled] = useState(true);

    const token = getToken();
    const user = getUser();
    const username = user !== 'undefined' && user ? user.username : '';
    const name = user !== 'undefined' && user ? user.name : '';
    const email = user !== 'undefined' && user ? user.email : '';
    const phoneNumber = user !== 'undefined' && user ? user.phoneNumber : '';

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
            email: email
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
    

    const input = {
        marginTop: '10%',
        margin: '15px auto',
        fontSize: '22px',
        padding: '0 0 0 10px',
        backgroundColor: 'white',
        borderRadius: '10px',
        height: showPasswordField ? '10em' : '0',
        maxWidth: '90%',
        boxShadow: "3px 3px 5px rgba(0.5, 0.5, 0.5, 0.5)",
        fontWeight: '500',
        transition: 'height 0.5s'
    }
        
    return (
        <div className='profile-layout'>
            <Header title="Profile" />
            <div className='profile-info'>
                <div id='profile-content'>
                    <div  style={{
                    padding: '2px 20px 0 20px',         
                }}>
                    <h5><CgProfile /> My Profile</h5>

                    <p>Name: </p>
                    <p id='info-value'>{name}</p>
                    <p>Email: </p>
                    <p id='info-value'>{email}</p>
                    <p>Username: </p>
                    <p id='info-value'>{username}</p>
                    <p>Phone: </p>
                    <p id='info-value'>{phoneNumber}</p> <br />

                </div>

                    <button className='profile-button'
                style={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '0 0 10px 10px',
                    border: 'none',
                    fontSize: '17px',
                    fontWeight: '600',
                    color: 'white',
                    backgroundColor: '#e7a22b'
                 }}
                 onClick={() => setShowPasswordField(!showPasswordField)}
                 > <FaPenAlt /> Update Your Information</button>
                </div>
            </div>
            <div className={`password-field ${showPasswordField ? 'active' : 'inactive'}`}>
                    <p style={{fontSize: '14px', color: 'red'}}>Password required to continue</p>
                    Password: <br/>
                    <form onSubmit={submitHandler}>
                        <input type="password"
                        value={password}
                        onChange={event => setPassword(event.target.value)}/> <br/>
                        <input type="submit" value="Submit" />
                    </form>
                 </div>
                 <div className='background'></div>
            
        </div>
    )
}
export default Profile;