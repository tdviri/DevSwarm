import React from 'react';
import '../stylesheets/App.css';
import axios from 'axios';
import { useState } from 'react';

export default function Register(props) {
    const [differentPasswords, setDifferentPasswords] = useState(false);
    const [passwordContainsName, setPasswordContainsName] = useState(false);
    const [passwordContainsEmail, setPasswordContainsEmail] = useState(false);
    const [passwordContainsUsername, setPasswordContainsUsername] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const [isInvalidEmail, setIsInvalidEmail] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        const formValues = new FormData(e.target);
        const firstName = formValues.get('firstName');
        const lastName = formValues.get('lastName');
        const email = formValues.get('email');
        const username = formValues.get('username')
        const password = formValues.get('password');
        const verifyPassword = formValues.get('verifyPassword');
        setDifferentPasswords(false);
        setPasswordContainsName(false);
        setPasswordContainsEmail(false);
        let valid = true;

        let newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            username: username,
            password: password,
            verifyPassword: verifyPassword,
            reputation: 0
        }
        try {
            await axios.post('/api/register', newUser);
        }
        catch(error){
            if (error.response.data.errorMessage === 'Email is invalid.') {
                setIsInvalidEmail(true);
                valid = false;
            }
            if (error.response.data.errorMessage === "Email is already registered."){
                setEmailExists(true);
                valid = false;
            }
            if (error.response.data.errorMessage === "Passwords do not match."){
                setDifferentPasswords(true);
                valid = false;
            }
            if (error.response.data.errorMessage === "Password cannot contain your email."){
                setPasswordContainsEmail(true);
                valid = false;
            }
            if (error.response.data.errorMessage === "Password cannot contain your username."){
                setPasswordContainsUsername(true);
                valid = false;
            }
            if (error.response.data.errorMessage === "Password cannot contain your name."){
                setPasswordContainsName(true);
                valid = false;
            }
            else{
                console.error('Registration failed:', error.message);
            }
        }

        if (!valid){
            return;
        }
        props.setShowRegisterPage(false);
        props.setShowLoginPage(true);
      }
    

  return (
    <form className="register-page-form" onSubmit={handleSubmit}>
        <h1 className="register-form-header">Register</h1>
        <div className="register-form-first-name-input-container">
            <label className="register-form-input-header">First Name</label>
            <input className="register-form-input" type="text" required name="firstName" />
        </div>
        <div className="register-form-last-name-input-container">
            <label className="register-form-input-header">Last Name</label>
            <input className="register-form-input" type="text" required name="lastName" />
        </div>
        <br /><br />
        <div className="register-form-email-input-container">
            <label className="register-form-input-header">Email</label>
            <input className="register-form-input" type="text" required name="email" />
        </div>
        <br /><br />
        <div className="register-form-username-input-container">
            <label className="register-form-input-header">Username</label>
            <input className="register-form-input" type="text" required name="username" />
        </div>
        <br /><br />
        <div className="register-form-password-input-container">
            <label className="register-form-input-header">Password</label>
            <input className="register-form-input" type="text" required name="password" />
        </div>
        <br /><br />
        <div className="register-form-verify-password-input-container">
            <label className="register-form-input-header">Verify Password</label>
            <input className="register-form-input" type="text" required name="verifyPassword" />
        </div>
        <br /><br />
        <input className="signup-btn" type="submit" value="Sign Up" />
        <div className="register-form-error-messages">
            {differentPasswords && <div className="register-error-message">Passwords do not match.</div>}
            {passwordContainsName && <div className="register-error-message">Password cannot contain your name.</div>}
            {passwordContainsEmail && <div className="register-error-message">Password cannot contain your email.</div>}
            {passwordContainsUsername && <div className="register-error-message">Password cannot contain your username.</div>}
            {emailExists && <div className="register-error-message">Email is already registered.</div>}
            {isInvalidEmail && <div className="register-error-message">Email is invalid.</div>}
      </div>
    </form>
  );
}