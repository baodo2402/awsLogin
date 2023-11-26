import React, { useState } from 'react';
import { getUser, resetUserSession } from './AuthService';
import { useNavigate } from 'react-router-dom';

export default function CalendarOptions() {
    const navigate = useNavigate();

    const LindfieldHandler = () => {
        window.localStorage.setItem('jobControlTableName', 'Gladstone_Parade_Lindfield');
        navigate('/calendar');
    }
    const WycombeHandler = () => {
        window.localStorage.setItem('jobControlTableName', 'Lower_Wycombe_Road_Neutral_Bay')
        navigate('/calendar');
    }

    const WaterlooHandler = () => {
        window.localStorage.setItem('jobControlTableName', 'McEvoy_Street_Waterloo');
        navigate('/calendar')
    }

    const selectionStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '50% auto',
        textAlign: 'center',
    }
    const buttonStyle = {
        fontWeight: 600,
        backgroundColor: 'rgba(254, 233, 207, 0.787)',
        fontSize: '18px',
        textAlign: 'center',
        display: 'inline-block',
        width: '9em',
        height: '2.25em',
        border: 'none'
    }
      const accountHandler = () => {
    navigate('/premium-content');
}
  const backButton = {
    position: 'absolute',
    top: '5px',
    right: '15px',
    width: 'auto',
    height: '2em',
    fontWeight: '500',
    fontSize: '15px',
    borderRadius: '15px',
    backgroundColor: 'rgba(249, 193, 120, 0.4)'
}
    return (
        <div style={selectionStyle}>
                <header>
                    <button style={backButton}onClick={accountHandler}>Back</button>
                </header>
            <button id='Lindfield-button' onClick={LindfieldHandler} style={buttonStyle}>Lindfield</button> <br />
            <button id='Wycombe-button' onClick={WycombeHandler} style={buttonStyle}>Wycombe</button> <br /> 
            <button id='Waterllo-button' onClick={WaterlooHandler} style={buttonStyle}>Waterloo</button>
        </div>
    )
}