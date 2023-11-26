import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ForgetPasswordStyle.css';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Header } from './Header';

const requestConfig = {
    headers: {
        'x-api-key': 'EmYB7EcYzn2NK1dUkD2kK8MA18r5dp6tQ7wB7U1d'
    }
}
const sendemailUrl = 'https://lyg1apc3wl.execute-api.ap-southeast-2.amazonaws.com/prod/sendemail';
const compareCodeUrl = 'https://lyg1apc3wl.execute-api.ap-southeast-2.amazonaws.com/prod/comparecode';


export default function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [codeSent, setCodeSent] = useState(false);
    const [codeInputField, setCodeInputField] = useState(false);
    const [loading, setLoading] = useState(false);


    const [code, setCode] = useState();
    const [codeMessage, setCodeMessage] = useState('');

    const navigate = useNavigate();

    const submitHandler = (event) => {
        event.preventDefault();
        setLoading(true);
        const requestBody = {
            to: email
        }

        axios.post(sendemailUrl, requestBody, requestConfig).then(response => {
            setMessage(response.data.message);
            setCodeSent(true);
            setCodeInputField(true);
            setLoading(false)
    
        }).catch(error => {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                setMessage(error.response.data.message);
                setLoading(false)
            }
            else {
                setMessage('Sorry, backend server is down, please try again later');
                setLoading(false);
            }
        })
    }

    const codeSubmitHandler = (event) => {
        event.preventDefault();
        setLoading(true)
        const requestBody = {
            email: email,
            code: code
        }
        
        axios.post(compareCodeUrl, requestBody, requestConfig).then(response => {
            setCodeMessage(response.data.message);
            if (response.data.message === 'ok') {
                console.log('congrats');
                setLoading(false)
                navigate('/resetpassword', { state: { email } });
            }
        }).catch(error => {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                setCodeMessage(error.response.data.message);
                setLoading(false);
            }
            else {
                setCodeMessage('Sorry, backend server is down, please try again later');
                setLoading(false);
            }
        })
    }
    return (
        <div>
            <Header title="Forget Password" />
            <div className='email-zone' >
                <h3>To keep your account safe, enter your email to get the verification code</h3>
                <form onSubmit={submitHandler}>
                    Email: <br />
                    <input type="email" value={email} placeholder='Enter Your Email' onChange={event => setEmail(event.target.value)}/> <br/>
                    <input type="submit" value={codeSent ? "Resend" : "Send Code"} />
                </form>
                {message && <p>{message}</p>}   
            </div>

            <div className={`code-input-field ${codeInputField ? 'active' : 'inactive'}`}>
                <h5>A Confirmation Email has been sent to your email address</h5>
                <form onSubmit={codeSubmitHandler}>
                    Enter Code: <br />
                    <input type='number' value={code} onChange={event => setCode(parseInt(event.target.value))} /> <br />
                    <input type='submit' value='Submit'/>
                </form>
                {codeMessage && <p>{codeMessage}</p>}
            </div>
            {loading && (
                    <Box sx={{ position: "fixed", top: "40%", left: "45%", zIndex: "1000" }}>
                    <CircularProgress />
                    </Box>
                )}
                        <div className="background"></div>
        </div>
        
    )
}