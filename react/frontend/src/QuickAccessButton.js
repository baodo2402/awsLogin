import React from "react";
import { useState, useEffect } from "react";
import './premiumContentStyle.css'
import { useNavigate } from "react-router-dom";

export default function QuickAccessButton({ title, description, navigateTo }) {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(navigateTo)
    }
    return (
        <>
        <div className="quick-access-button-container" onClick={handleClick}>
            <strong>{title}</strong>
            <p>{description}</p>
        </div>
        </>
    )
}