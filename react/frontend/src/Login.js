import React, {useState} from 'react';
import axios from 'axios';
import { setUserSession } from './service/AuthService';
import './index.css';
import { useNavigate } from 'react-router-dom';
const loginUrl = 'https://lyg1apc3wl.execute-api.ap-southeast-2.amazonaws.com/prod/login';


const Login = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    const submitHandler = (event) => {
        event.preventDefault();
        if (username.trim() === '' || password.trim() === '') {
            setErrorMessage('Both username and password are required');
            return;
        }
        
        setErrorMessage(null);

        const requestConfig = {
            headers: {
                'x-api-key': 'EmYB7EcYzn2NK1dUkD2kK8MA18r5dp6tQ7wB7U1d'
            }
        }
        const requestBody = {
            username: username,
            password: password

        }

        axios.post(loginUrl, requestBody, requestConfig).then((response) => {
            setUserSession(response.data.user, response.data.token);
            //props.history.push('/premium-content');
            navigate('/premium-content');
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
        <div className='login-layout'>
            <form onSubmit={submitHandler}>
                <h5>Login</h5>
                Username: <br/><input type="text" value={username} placeholder='username' onChange={event => setUsername(event.target.value)} /> <br/>
                Password: <br/><input type="password" value={password} placeholder='abc'onChange={event => setPassword(event.target.value)} /> <br/>
                <input type="submit" value="Login" />
            </form>
            {errorMessage && <p className="message">{errorMessage}</p>}
        </div>
    )
}

export default Login;