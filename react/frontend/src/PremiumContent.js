import React from 'react';
import { getUser, resetUserSession } from './service/AuthService';

const PremiunContent = (props) => {
    const user = getUser();
    const name = user !== 'undefined' && user ? user.name : '';
    
    const logoutHandler = () => {
        resetUserSession();
        props.history.push('/login');
    }
    return (
        <div>
            Hello {name}, you logged in.<br/>
            <input type="button" value="Logout" onClick={logoutHandler} />
        </div>
    )
}

export default PremiunContent;