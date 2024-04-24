import React from 'react';
import '../stylesheets/App.css';
import { useAppContext } from './appContext';

export default function Welcome() {
    const {setIsGuest, setShowLoginPage, setShowRegisterPage} = useAppContext();

    return (
        <div className="welcome-page-form">
            <h1 className="welcome-page-form-header" >Fake Stack Overflow</h1>
            <div className="welcome-page-register-option" onClick={()=>setShowRegisterPage(true)}>Register</div>
            <div className="welcome-page-login-option" onClick={()=>setShowLoginPage(true)}>Login</div>
            <div className="welcome-page-guest-option" onClick={()=>setIsGuest(true)}>Continue as Guest</div>
        </div>
    );
}