import React, { useState } from 'react';
import '../stylesheets/App.css';

export default function Login(props) {
    const [unregisteredEmail, setUnregisteredEmail] = useState(false);
    const [incorrectPassword, setIncorrectPassword] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        const formValues = new FormData(e.target);
        const email = formValues.get('email');
        const password = formValues.get('password');
        setUnregisteredEmail(false);
        setIncorrectPassword(false);
        let valid = false;
        let emailNotFound = true;
        let loggedInUser;

        if (props.users) {
            for (const user of props.users){
                if (email === user.email){
                    emailNotFound = false;
                    if (password === user.password){
                        valid = true;
                        loggedInUser = user;
                    }
                    else{
                        valid = false;
                        setIncorrectPassword(true);
                    }
                    break;
                }
            }

            if (emailNotFound){
                setUnregisteredEmail(true);
                valid = false;
            }
        } 
        else {
            valid = false;
        }

        if (!valid){
            console.log("invalid form")
            return;
        }
        props.setIsLoggedIn(true);
        props.setLoggedInUser(loggedInUser);
        props.setShowLoginPage(false);
    }

    return (
            <form className="login-page-form" onSubmit={handleSubmit}>
                <h1 className="login-form-header">Login</h1>
                <div className="login-form-email-input-container">
                    <label className="login-form-input-header">Email</label>
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
                    {unregisteredEmail && <div className="register-error-message">Email is not registered.</div>}
                    {incorrectPassword && <div className="register-error-message">Password is incorrect.</div>}
                </div>
            </form>
    );
}