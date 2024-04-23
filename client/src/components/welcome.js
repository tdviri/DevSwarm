import React from 'react';
import '../stylesheets/App.css';
import { useState } from 'react';

export default function Welcome(props) {
    const [showLoginPage, setShowLoginPage] = useState(false);
    const [showRegisterPage, setShowRegisterPage] = useState(false);

    return (
        <div className="welcome-page-form">
            <h1 className="welcome-page-form-header" >Fake Stack Overflow</h1>
            <div className="welcome-page-register-option" onClick={props.set}>Register</div>
            <div className="welcome-page-login-option">Login</div>
            <div className="welcome-page-guest-option">Continue as Guest</div>
        </div>
    );
}