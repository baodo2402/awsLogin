import React, { useState } from 'react';
import { getUser, getToken } from './service/AuthService';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CgProfile } from 'react-icons/cg';
import './profileStyle.css'
import { FaPenAlt } from 'react-icons/fa';
import { Header } from './Header';
import ColumTaskBar from './ColumnTaskBar';
import AccessInformation from './service/AccessInformation';

const { triggerChangeInfoUrl, requestConfig } = AccessInformation;

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
        
    return (
        <div className='profile-layout'>
            <Header title="Profile" />
            <ColumTaskBar columnDisplay='none' />
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
                        <p>{message}</p>
                    </form>
                 </div>
                 <div className='background'></div>
            
        </div>
    )
}
export default Profile;