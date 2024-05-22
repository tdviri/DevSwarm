import React, { useState } from "react";
import "../stylesheets/App.css";
import axios from "axios";
// axios.defaults.withCredentials = true;

export default function Login(props) {
  const [unregisteredEmail, setUnregisteredEmail] = useState(false);
  const [incorrectPassword, setIncorrectPassword] = useState(false);
  const [accountNotFound, setAccountNotFound] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const formValues = new FormData(e.target);
    const email = formValues.get("email");
    const password = formValues.get("password");
    setUnregisteredEmail(false);
    setIncorrectPassword(false);
    setAccountNotFound(false);
    let valid = true;

    try {
      await axios.post(
        "http://localhost:8000/api/login",
        { email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      if (
        error.response &&
        error.response.data.errorMessage === "Email is not registered."
      ) {
        setUnregisteredEmail(true);
        valid = false;
      }
      if (
        error.response &&
        error.response.data.errorMessage === "Password is incorrect."
      ) {
        setIncorrectPassword(true);
        valid = false;
      }
      if (
        error.response &&
        error.response.data.errorMessage === "Account not found."
      ) {
        setAccountNotFound(true);
        valid = false;
      } else if (valid && error.request) {
        alert(
          "Communication error: Unable to connect to the server. Please try again later.",
        );
        valid = false;
      } else if (valid) {
        alert("System error: Login failed");
        valid = false;
      }
    }
    if (!valid) {
      return;
    }
    props.setIsLoggedIn(true);
    props.setShowLoginPage(false);
  }

  return (
    <form className="login-page-form" onSubmit={handleSubmit}>
      <h1 className="login-form-header">Login</h1>
      <div className="login-form-email-input-container">
        <label className="login-form-input-header">Email</label>
        <input className="login-form-input" type="text" required name="email" />
      </div>
      <br />
      <br />
      <div className="login-form-password-input-container">
        <label className="login-form-input-header">Password</label>
        <input
          className="login-form-input"
          type="text"
          required
          name="password"
        />
      </div>
      <br />
      <br />
      <input className="login-submit-btn" type="submit" value="Submit" />
      <div className="register-form-error-messages">
        {unregisteredEmail && (
          <div className="register-error-message">Email is not registered.</div>
        )}
        {incorrectPassword && (
          <div className="register-error-message">Password is incorrect.</div>
        )}
        {accountNotFound && (
          <div className="register-error-message">Account not found.</div>
        )}
      </div>
    </form>
  );
}
