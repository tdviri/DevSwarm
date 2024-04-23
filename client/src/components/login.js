import React from 'react';
import '../stylesheets/App.css';
import axios from 'axios';
import { useState } from 'react';

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
        let valid = true;
        let usernameNotFound = false;
        const users = await axios.get('http://localhost:8000/retrieveusers');

        for (const user of users){
            if (username === user.username){
                if (password !== user.password){
                    setIncorrectPassword(true);
                    valid = false;
                }
                break;
            }
        }

        if (usernameNotFound){
            setUnregisteredEmail(true);
            valid = false;
        }

        if (!valid){
            return;
        }
        // let newUser = {
        //     firstName: firstName,
        //     lastName: lastName,
        //     username: username,
        //     password: password
        // }
        // await axios.put('http://localhost:8000/addUser', newUser);
      }
    

    return (
        <form className="login-page-form" onSubmit={handleSubmit}>
            <h1 className="login-form-header">Register</h1>
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
