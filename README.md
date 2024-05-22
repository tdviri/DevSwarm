# DevSwarm

## Introduction

This is a MERN stack application that serves as a technical hub that allows developers to ask each other questions, provide answers, comment on posts, all while being part of an immersive developer community. The app is built using MongoDB, Express.js, React, and Node.js.

## Table of Contents

1. [Installation](#installation)
2. [Features](#features)
3. [Usage](#usage)
4. [Dependencies](#dependencies)
5. [Database Initialization](#database-initialization)
6. [Running the Application](#running-the-application)
7. [Troubleshooting](#troubleshooting)
8. [Admin Login Credentials](#admin-login-credentials)

## Installation

To get started with DevSwarm, follow these steps:

1. **Install Node.js** (if not already installed):
   Download and install Node.js from [nodejs.org](https://nodejs.org/).

2. **Install nodemon** globally:
   ```bash
   npm install -g nodemon

3. Clone the repository to your local machine:
    ```sh
    git clone https://github.com/tdviri/devswarm.git
    cd devswarm
    ```

4. Install server-side dependencies:
    ```sh
    cd server
    npm install
    ```

5. Install client-side dependencies:
    ```sh
    cd ../client
    npm install
    ```

## Features

- User authentication and authorization
- Question and answer posting
- Commenting on questions and answers
- Tagging system
- Voting for questions, answers, and comments
- User reputation scoring system
- Special admin privileges for managing the platform
- Seamless integrations including search, filter, question sorting, etc.

## Usage

Key Notes:
- Links (text/titles colored in blue) will glow when you hover over them before clicking.
- Can search for tag names, question title/text terms, or both. Search for tags by enclosing search term in brackets (e.g. '[android-studio]'). Seperate search terms by a single space.
- Three sort/filter options:
     - Newest: Sort questions by most recently asked
     - Active: Sort questions by most recently answered
     - Unanswered: Filter for unanswered questions
- User must have at least 50 reputation points to vote, comment, or create a new tag name.
- Downvoting results in -10 reputation points and upvoting results in +5 reputation points. However, comment voting does not affect reputation.
- The rest you will figure out as you use the app.

## Dependencies

### Server

- express
- mongoose
- dotenv
- cors
- cookie-parser
- jsonwebtoken
- body-parser
- bcrypt

### Client

- react
- react-dom
- axios
- react-router-dom
- moment
- prettier
- react-icons

## Database Initialization

To populate the database with initial test data and create an admin user, run the following command from the root directory of the project:

```sh
node server/init.js admin@gmail.com:secretAdmin mongodb://127.0.0.1:27017/fake_so
 ```

To delete all data from the database, run the following command:

```sh
node server/deleteData.js
 ```

## Running the Application

### Start the Server

From the root directory of the project, run:

```sh
nodemon server/server.js
 ```

### Start the Client

Navigate to the `client` directory and start the client:

```sh
cd client
npm start
 ```

## Troubleshooting

If you encounter any issues, ensure that:

- Ensure MongoDB is running on your machine.
- Check for any errors in the terminal and resolve dependencies issues if any.

## Admin Login Credentials

- Email: admin@gmail.com
- Password: secretAdmin

