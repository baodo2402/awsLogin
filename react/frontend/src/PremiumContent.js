import React, { useState } from 'react';
import { getUser, resetUserSession } from './service/AuthService';
import LocationFinder from './service/LocationFinderService';
import { useNavigate } from 'react-router-dom';
//import './index.css';
import './premiumContentStyle.css'
import { HiOutlineLogout } from 'react-icons/hi';
import { BsCalendarCheck } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import { PiQuestion } from "react-icons/pi";
import Logo from './image/cleanntidyLogo.png';
import { RiHome3Line } from "react-icons/ri";
import { Header } from './Header';
import maleCleanerImage from './image/male-cleaner.png';
import { PiSunDuotone } from "react-icons/pi";
import ColumTaskBar from './ColumnTaskBar';
import QuickAccessButton from './QuickAccessButton';


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
    const email = user !== 'undefined' && user ? user.email : '';

    //const loginUsername = user !== 'undefined' && user ? user.username : '';

    const staffsManagementHandler = () => {
        navigate('/staff-management')
    }

    const [isActive, setIsActive] = useState(false);


    
    return (
        <div>
        <div className='background'></div>
        <header className='account-layout'>
            <img src={Logo}
                style={{ width: '1.5em', height: '1.25em', objectFit: 'cover',
                 }} />
                  <h1 id='clean-n-tidy-tittle'>
                    Clean 'n' Tidy
                 </h1>

        </header>
        <ColumTaskBar />


        <div className='welcome-section'>
            <p>
            <span>
                <div id='sunWrapper'>
                    <PiSunDuotone id='sunIcon' />
                </div> Hello
            </span> {name.split(' ')[0]} <br /> Start your Shift here</p>
        </div>
        <img src={maleCleanerImage} id='male-cleaner-premium' />

        {/* <div style={{
            display: 'flex',
            flexWrap: 'wrap', // Allow items to wrap onto the next line
            maxWidth: '40em',
            margin: '0 auto',
            backgroundColor: "rgb(245, 230, 210)",
            justifyContent: "center",
            zIndex: '5',
            borderRadius: "15px"
        }}>
        <QuickAccessButton navigateTo="/location" title="Punch Clock" description="Start your shift here" />
        <QuickAccessButton title="Missed Punch Clock" description="Missed to clock in or out? Report it here" />
        <QuickAccessButton title="Report" description="Report any damange, incident, and more" />
        <QuickAccessButton  title="Test1" description="Start your shift here" />
        <QuickAccessButton title="Test" description="Missed to clock in or out? Report it here" />
        </div>          */}


        <LocationFinder />
        

        </div>
        

    )
}
export default PremiumContent;