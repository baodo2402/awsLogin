import React, { useState } from 'react';
import axios from 'axios';

const registerUrl = 'https://lyg1apc3wl.execute-api.ap-southeast-2.amazonaws.com/prod/register';


const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);

    const submitHandler = (event) => {
        event.preventDefault();
        if (username.trim() === '' || email.trim() === '' || name.trim() ==='' || password.trim() ==='') {
            setMessage('All fields are required');
            return;
        }
        setMessage(null);
        const requestConfig = {
            headers: {
                'x-api-key': 'EmYB7EcYzn2NK1dUkD2kK8MA18r5dp6tQ7wB7U1d'
            }
        }
        const requestBody = {
            username: username,
            email: email,
            name: name,
            password: password

        }

        axios.post(registerUrl, requestBody, requestConfig).then(response => {
            setMessage('Register Successful');
        }).catch(error => {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                setMessage(error.response.data.message);
            }
            else {
                setMessage('Sorry, backend server is down, please try again later')
            }
        })

        // console.log("submit button is pressed!")
    }



    return (
        <div>
            <form onSubmit={submitHandler}>
                <h5>Register</h5>
                name: <input type="text" value={name} onChange={event => setName(event.target.value)} /> <br/>
                email: <input type="text" value={email} onChange={event => setEmail(event.target.value)} /> <br/>
                username:  <input type="text" value={username} onChange={event => setUsername(event.target.value)} /> <br/>
                password: <input type="password" value={password} onChange={event => setPassword(event.target.value)} /> <br/>
                <input type="submit" value="Register" />
            </form>
            {message && <p className='message'>{message}</p>}
        </div>
    )
}

export default Register;