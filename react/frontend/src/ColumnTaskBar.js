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
import { BsGraphUpArrow } from "react-icons/bs";
import { Header } from './Header';
import AddOrEditJobs from './AddOrEditJobs';


const ColumTaskBar = ({ columnDisplay}) => {
    const navigate = useNavigate();
    const user = getUser();
    const name = user !== 'undefined' && user ? user.name : '';
    const email = user !== 'undefined' && user ? user.email : '';


    const logoutHandler = () => {
        resetUserSession();
        //props.history.push('/login');
        navigate('/login');
    }
    const profileHandler = () => {
        navigate('/profile');
    }

    const addOrEditJobsHandler = () => {
        navigate('/add-or-edit-jobs')
    }
    const canlendarHandler = () => {
        navigate('/calendarsearching');
    }

    const guidanceHandler = () => {
        window.location.href = 'https://docs.google.com/document/d/12tF2ZcDacsIM58oSXLhqEekfFSTCTY3Lt5UVdvGSNlM/edit?usp=sharing'
    }

    const homeHandler = () => {
        navigate('/premium-content')
    }
    
    const [isActive, setIsActive] = useState(false);

     const toggleMenu = () => {
        setIsActive(!isActive);
     };

    const staffManagementHandler = () => {
        navigate('/staff-management')
    }
    return (
        <div className='column-task-bar-container'>
        <input type='checkbox' id="menu-toggle" className='dropdown-input' />
        <label className={`hamburger ${isActive ? 'active' : ''}` }
                htmlFor="menu-toggle"
                onClick={toggleMenu}
                style={{display: columnDisplay}}>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
        </label>

        

        <section id='dropdown-content'>

            <button id="item" style={{'--i': 1}}  onClick={homeHandler}>
                Home <RiHome3Line />
            </button><br />

            {(email === 'thienbao1084@gmail.com' ||
              email === 'cleanntidy.au@outlook.com' ||
              email === 'test2@gmail.com') ? (
                <div>
                    <button id="item" style={{'--i': 1}}  onClick={staffManagementHandler}>
                        Staff Management <BsGraphUpArrow  />
                    </button>
                 <br />
                </div>
              ) : (
                null
              )}
              
            <button id="item" style={{'--i': 2}} onClick={profileHandler}>
            Profile <CgProfile />
            </button><br />
            <button id="item" style={{'--i': 3}} onClick={canlendarHandler}>
                Calendar <BsCalendarCheck />
            </button> <br />
            <button id="item" style={{'--i': 4}} onClick={guidanceHandler}>
                Guidance <PiQuestion />
            </button> <br />

            {(email === 'thienbao1084@gmail.com' ||
              email === 'cleanntidy.au@outlook.com' ||
              email === 'test2@gmail.com') ? (
                <div>
                    <button id="item" style={{'--i': 1}}  onClick={addOrEditJobsHandler}>
                        Add/Edit Jobs <HiOutlineLogout  />
                    </button>
                 <br />
                </div>
              ) : (
                null
              )}

            <button id="item" style={{'--i': 1}}  onClick={logoutHandler}>
                Logout <HiOutlineLogout />
            </button>
        </section>
    </div>
    )
}
export default ColumTaskBar;