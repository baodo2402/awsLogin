import React from 'react';
import { getUser, resetUserSession } from './service/AuthService';
import LocationFinder from './service/LocationFinderService';
import { useNavigate } from 'react-router-dom';
import './index.css';

const PremiumLayout = ({ children }) => {
    return (
      <div className="premium-layout">
        {/* You can add any additional layout elements here */}
        {children}
      </div>
    );
};

const PremiumContent = (props) => {
    const navigate = useNavigate();
    const user = getUser();
    const name = user !== 'undefined' && user ? user.name : '';
    //const loginUsername = user !== 'undefined' && user ? user.username : '';
    const logoutHandler = () => {
        resetUserSession();
        //props.history.push('/login');
        navigate('/login');
    }
    const profileHandler = () => {
        navigate('/profile');
    }
    const canlendarHandler = () => {
        navigate('/calendar');
    }
    const testCanlendarHandler = () => {
        navigate('/monthlycanlendar')
    }
    const button = {
        fontWeight: '600',
        fontSize: '15px',
        textAlign: 'center',
        paddingBottom: '5px',
        paddingTop: '5px',
        display: 'inline-block',
        alignItems: 'right',
        width: '9em',
        height: '2.25em'
    }
    
    return (
        <PremiumLayout>
        <div className='account-layout'>
            Hello {name}

            
                <input type='checkbox' id="menu-toggle" className='dropdown-input' />
                <label className='dropdown-button' htmlFor="menu-toggle">&#9776;</label>
                <section id='dropdown-content'>
                    <input style={button} type="button" value="Logout" onClick={logoutHandler} /><br />
                    <input style={button} type='button' value="Profile" onClick={profileHandler} /><br />
                    {/* <input style={button} type='button' value="Calendar" onClick={canlendarHandler} /><br /> */}
                    <input style={button} type='button' value="Test Calendar" onClick={testCanlendarHandler} />
                </section>
            
            
            
        </div>
        <LocationFinder />
        </PremiumLayout>
    )
}
// const user = getUser();
// const loginUsername = user !== 'undefined' && user ? user.username : '';
// export { loginUsername };
export default PremiumContent;