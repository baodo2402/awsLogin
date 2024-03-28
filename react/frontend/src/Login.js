import React, {useState} from 'react';
import axios from 'axios';
import { setUserSession } from './service/AuthService';
import './index.css';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import maleCleanerImage from './image/male-cleaner.png'
import femaleCleanerImage from './image/female-cleaner.png'
import AccessInformation from './service/AccessInformation';

const { loginUrl, requestConfig } = AccessInformation

const Login = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const submitHandler = (event) => {
        event.preventDefault();
        setLoading(true);
        if (email.trim() === '' || password.trim() === '') {
            setErrorMessage('Both email and password are required');
            setLoading(false)
            return;
        }
        
        setErrorMessage(null);

        const requestBody = {
            email: email,
            password: password

        }

        axios.post(loginUrl, requestBody, requestConfig).then((response) => {
            setUserSession(response.data.user, response.data.token);
            setLoading(false)
            //props.history.push('/premium-content');
            navigate('/premium-content');
        }).catch((error) => {
            console.error(error);
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                setErrorMessage(error.response.data.message);
                setLoading(false)
            } else {
                setErrorMessage('Sorry, backend server is down, please try again later!');
                setLoading(false)
            }
        })
        //console.log('login button is pressed');
    }

    const Contact = () => {
        navigate('/forgetpassword');
    }

    const navigateToRegister = () => {
        navigate('/register');
    }
    return (
        <div className='login-frame'>
        <div className='login-container'>
            <img src={maleCleanerImage} id='male-cleaner' />
            <div className='login-layout'>
                <section className='login-head'>
                    <h1>Login</h1>
                </section>
                
                <section>
                    <form onSubmit={submitHandler}>
                        Email: <br/><input type="text" value={email} placeholder='Email' onChange={event => setEmail(event.target.value)} /> <br/>
                        Password: <br/><input type="password" value={password} placeholder='*******'onChange={event => setPassword(event.target.value)} /> <br/>
                        
                        <input type="submit" value="Login" />
                        {errorMessage && <p style={{position: 'relative', top: '2em', zIndex: "999"}}>{errorMessage}</p>}
                    </form>
                    <button style={{ borderRadius: '25px', border: "none", margin: "5px", color: 'blue' }} onClick={Contact}>Forget Password?</button>
                    <button style={{ borderRadius: '25px', border: "none", marginLeft: "15px", color: 'blue' }} onClick={navigateToRegister}>Haven't created an account yet?</button>
                </section>
                

                {loading && (
                    <Box sx={{ position: "fixed", top: "40%", left: "45%", zIndex: "1000" }}>
                    <CircularProgress />
                    </Box>
                )}
                

                <div className="background"></div>
                
            </div>
        </div>
        
        
        </div>
    )
}

export default Login;