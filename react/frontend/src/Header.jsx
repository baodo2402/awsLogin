import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import "./Header.css"

export function Header({ onBackClick, title }) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      // Default behavior: go back in the browser history
      navigate(-1);
    }
  };

  return (
    <div>
        <div className="header-component-container">
            <IoIosArrowBack id="back-icon" onClick={handleBackClick} />
            <h4 className="header-title">{title}</h4>

        </div>
    </div>

  );
}
