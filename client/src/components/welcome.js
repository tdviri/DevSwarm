import React from 'react';
import '../stylesheets/App.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Welcome(props) {
    const [showLoginPage, setShowLoginPage] = useState(false);
    const [showRegisterPage, setShowRegisterPage] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="welcome-page-form">
            <h1 className="welcome-page-form-header" >Fake Stack Overflow</h1>
            <div className="welcome-page-register-option" onClick={()=>navigate('/register')}>Register</div>
            <div className="welcome-page-login-option" onClick={()=>navigate('/login')}>Login</div>
            <div className="welcome-page-guest-option" onClick={navigate('/home')}>Continue as Guest</div>
        </div>
    );
}