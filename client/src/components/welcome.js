import React from 'react';
import '../stylesheets/App.css';

export default function Welcome(props) {
    return (
        <div className="welcome-page-form">
            <h1 className="welcome-page-form-header" >Fake Stack Overflow</h1>
            <div className="welcome-page-register-option" onClick={()=>props.setShowRegisterPage(true)}>Register</div>
            <div className="welcome-page-login-option" onClick={()=>props.setShowLoginPage(true)}>Login</div>
            <div className="welcome-page-guest-option" onClick={()=>props.setIsGuest(true)}>Continue as Guest</div>
        </div>
    );
}