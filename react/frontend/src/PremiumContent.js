import React, { useState } from 'react';
import { getUser, resetUserSession } from './service/AuthService';
import LocationFinder from './service/LocationFinderService';
import { useNavigate } from 'react-router-dom';
//import './index.css';
import './premiumContentStyle.css'
import { HiOutlineLogout } from 'react-icons/hi';
import { BsCalendarCheck } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import Logo from './image/cleanntidyLogo.png';
import { Header } from './Header';


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

    const admindCalendarhadler = () => {
        navigate('/calendaroption')
    }
    const canlendarHandler = () => {
        const userEmail = user && user ? user.email : '';
        if (userEmail === 'cleanntidy.au@outlook.com' || userEmail === 'thienbao1084@gmail.com' || userEmail === 'danghung0224@gmail.com') {
            navigate('/calendarsearching');
        } else {
            navigate('/calendar');
        }
        
    }
    
    const [isActive, setIsActive] = useState(false);

     const toggleMenu = () => {
        setIsActive(!isActive);
     };

    
    return (
        <div>

        <header className='account-layout'>
            <img src={Logo}
                style={{ width: '1.2em', height: '1.2em', objectFit: 'cover',
                 }} />   Hello {name}
                <input type='checkbox' id="menu-toggle" className='dropdown-input' />
                <label className={`hamburger ${isActive ? 'active' : ''}` } htmlFor="menu-toggle" onClick={toggleMenu}>
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                </label>

                <section id='dropdown-content'>
                    <button id="item" style={{'--i': 1}}  onClick={logoutHandler}>
                        Logout <HiOutlineLogout />
                    </button><br />
                    <button id="item" style={{'--i': 2}} onClick={profileHandler}>
                    Profile <CgProfile />
                    </button><br />
                    <button id="item" style={{'--i': 3}} onClick={canlendarHandler}>
                        Calendar <BsCalendarCheck />
                    </button>
                </section>
            
        </header>
                 <div className='blank'></div>
                <div className='background-img'></div>
        <LocationFinder />

        </div>
        

    )
}
// const user = getUser();
// const loginUsername = user !== 'undefined' && user ? user.username : '';
// export { loginUsername };
export default PremiumContent;