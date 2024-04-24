import React, { useState, useEffect } from 'react';
import '../stylesheets/App.css';

export default function Login(props) {
    const [unregisteredEmail, setUnregisteredEmail] = useState(false);
    const [incorrectPassword, setIncorrectPassword] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        const formValues = new FormData(e.target);
        const username = formValues.get('email');
        const password = formValues.get('password');
        setUnregisteredEmail(false);
        setIncorrectPassword(false);
        let valid = false;
        let usernameNotFound = true;

        if (props.users) {
            for (const user of props.users){
                if (username === user.username){
                    usernameNotFound = false;
                    if (password === user.password){
                        valid = true;
                    }
                    else{
                        valid = false;
                        setIncorrectPassword(true);
                    }
                    break;
                }
            }

            if (usernameNotFound){
                setUnregisteredEmail(true);
                valid = false;
            }
        } else {
            valid = false;
        }

        if (!valid){
            console.log("invalid form")
            return;
        }
        props.setIsLoggedIn(true);
        props.setLoggedInUser({username: username, password: password});
        props.setShowLoginPage(false);
    }

    return (
            <form className="login-page-form" onSubmit={handleSubmit}>
                <h1 className="login-form-header">Login</h1>
                <div className="login-form-email-input-container">
                    <label className="login-form-input-header">Email/Username</label>
                    <input className="login-form-input" type="text" required name="email" />
                </div>
                <br /><br />
                <div className="login-form-password-input-container">
                    <label className="login-form-input-header">Password</label>
                    <input className="login-form-input" type="text" required name="password" />
                </div>
                <br /><br />
                <input className="login-submit-btn" type="submit" value="Submit" />
                <div className="register-form-error-messages">
                    {unregisteredEmail && <div className="register-error-message">Email/username is not registered.</div>}
                    {incorrectPassword && <div className="register-error-message">Password is incorrect.</div>}
                </div>
            </form>
    );
}