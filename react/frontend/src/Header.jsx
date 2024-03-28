import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import Logo from './image/cleanntidyLogo.png';
import { useLocation } from "react-router-dom";

export function Header({ onBackClick, title }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      // Default behavior: go back in the browser history
      if(location.pathname === '/staff-management') {
        navigate('/premium-content')
      } else {
        navigate(-1);
      }
    }
  };

  const returnHomeHandler = () => {
    navigate('/premium-content')
  }
  return (
    <div>
        <div className="header-component-container">
          <section id="back-button-container">
            <IoIosArrowBack id="back-icon" onClick={handleBackClick} />
          </section>
            <h4 className="header-title">{title}</h4>
            <img id='logo-img' src={Logo}
                onClick={returnHomeHandler} />
        </div>
    </div>

  );
}
