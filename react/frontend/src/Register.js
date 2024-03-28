import React, { useState } from 'react';
import axios from 'axios';
import './registerStyle.css';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import maleCleanerImage from './image/male-cleaner.png'
import femaleCleanerImage from './image/female-cleaner.png';
import AccessInformation from './service/AccessInformation';

const { registerUrl, requestConfig } = AccessInformation;


const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const submitHandler = (event) => {
        event.preventDefault();
        setLoading(true)
        if (username.trim() === '' || email.trim() === '' || name.trim() ==='' || password.trim() ==='') {
            setMessage('All fields are required');
            setLoading(false)
            return;
        }
        else if (password.trim() !== confirmPassword.trim()) {
            setMessage('Confirm password does not match, please try again');
            setLoading(false)

            return;
        }
        setMessage(null);
        
        const requestBody = {
            username: username,
            email: email,
            name: name,
            phoneNumber: phoneNumber,
            password: password

        }

        axios.post(registerUrl, requestBody, requestConfig).then(response => {
            setMessage('Register Successfully');
            alert('Register Successfully')
            setLoading(false)

        }).catch(error => {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                setMessage(error.response.data.message);
                setLoading(false)
            }
            else {
                setMessage('Sorry, backend server is down, please try again later');
                setLoading(false)

            }
        })

        // console.log("submit button is pressed!")
    }

    const navigateToLogin = () => {
        navigate('/login')
    }

    return (
        <div className='register-frame'>
            <div className='register-container'>
                <img src={femaleCleanerImage} id='female-cleaner' />

                <div className='register-layout'>
                <section className='register-head'>
                    <h1>Create A New Account</h1>
                </section>

                <section>
                <form onSubmit={submitHandler}>
                    Name: <br /><input type="text" value={name} placeholder='Full Name' onChange={event => setName(event.target.value)} /> <br/>
                    Email: <br /><input type="email" value={email} placeholder='Confirmed Email Only' onChange={event => setEmail(event.target.value)} /> <br/>
                    Username:  <br /><input type="text" value={username} placeholder='username123' onChange={event => setUsername(event.target.value)} /> <br/>
                    Phone Number: <br /><input type="number" value={phoneNumber} placeholder='0123456789' onChange={event => setPhoneNumber(event.target.value)} /> <br />
                    Password: <br/><input type="password" value={password} placeholder='******' onChange={event => setPassword(event.target.value)} /> <br/>
                    Confirm Password: <br/><input type="password" placeholder='******' value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} /> <br/>
                    <input type="submit" value="Register" />

                    <div style={{ display: 'flex', alignItems: 'center', margin: '10px' }}>
                        <p style={{ margin: 0 }}>Already have an account?</p>
                        <button style={{ borderRadius: '25px', border: 'none', marginLeft: '20px', color: 'blue' }} onClick={navigateToLogin}>
                            Login
                        </button> <br />
                    </div>
                    {message && <p className='message'>{message}</p>}

                </form>

                </section>
            </div>

            {loading && (
                <Box sx={{ position: "fixed", top: "40%", left: "45%", zIndex: "1000" }}>
                <CircularProgress />
                </Box>
            )}
            <div className="background"></div>
        </div>
        </div>
        
    )
}

export default Register;