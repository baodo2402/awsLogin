import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import "./ForgetPasswordStyle.css";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import AccessInformation from './service/AccessInformation';

const { requestConfig, resetPasswordUrl } = AccessInformation

export default function ResetPassword() {
    const navigate = useNavigate()
    const location = useLocation();
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const email = location.state.email || ''
    console.log(email)

    const submitHandler = (event) => {
        event.preventDefault();
        setLoading(true);
        if (newPassword === '') {
            setMessage('Password required');
            setLoading(false);
            return;
        }

        const requestBody = {
            email: email,
            newPassword: newPassword
        }
        console.log(email)
        axios.post(resetPasswordUrl, requestBody, requestConfig).then((response) => {
            setMessage(response.data.message);
            setLoading(false);
            alert("password changed successfully");
            navigate('/login')

        }).catch((error) => {
            console.error(error);
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                setMessage(error.response.data.message);
                setLoading(false)
            } else {
                console.error('Error:', error);
                setLoading(false);
            }
        })
        //console.log('login button is pressed');
    }
    return (
        <div className='email-zone'>
             
            <h1>Reset your password</h1>
            <form onSubmit={submitHandler}>
            <div className="background"></div>
            Enter your new password: <br/>
                <input type="password" value={newPassword} placeholder='New Password' onChange={(event) => setNewPassword(event.target.value)} /> <br/>
                <input type="submit" value="Submit" />
            </form>
            {message && <p>{message}</p>}
            {loading && (
                    <Box sx={{ position: "fixed", top: "40%", left: "45%", zIndex: "1000" }}>
                    <CircularProgress />
                    </Box>
                )}
               
        </div>
    )
}