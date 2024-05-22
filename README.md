# DevSwarm

## Introduction

This is a MERN stack application that provides developers with a technical hub where they can ask questions, provide answers, add comments, and manage tags. The app is built using MongoDB, Express.js, React, and Node.js.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Features](#features)
4. [Dependencies](#dependencies)
5. [Configuration](#configuration)
6. [Database Initialization](#database-initialization)
7. [Running the Application](#running-the-application)
8. [Troubleshooting](#troubleshooting)
9. [Contributors](#contributors)
10. [License](#license)

## Installation

To run this application on your local machine, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/DevSwarm.git
   cd DevSwarm
Install server dependencies:

bash
Copy code
cd server
npm install
Install client dependencies:

bash
Copy code
cd ../client
npm install
Usage
Starting the Server
To start the server, navigate to the root directory of the project and run:

bash
Copy code
nodemon server/server.js
Starting the Client
To start the client, navigate to the client directory and run:

bash
Copy code
cd client
npm start
Features
User authentication and authorization
Question and answer posting
Commenting on questions and answers
Tagging system
Admin privileges for managing the platform
Dependencies
Server
express
mongoose
dotenv
cors
cookie-parser
body-parser
bcrypt
Client
react
react-dom
axios
react-router-dom
Configuration
Create a .env file in the server directory with the following content:

makefile
Copy code
MONGO_URI=mongodb://127.0.0.1:27017/fake_so
PORT=8000
Database Initialization
To populate the database with initial data and create an admin user, run the following command from the root directory of the project:

bash
Copy code
node server/init.js admin@gmail.com:secretAdmin mongodb://127.0.0.1:27017/fake_so
To delete all data from the database, run:

bash
Copy code
node server/deleteData.js
Running the Application
Development Mode
Start the server:

bash
Copy code
nodemon server/server.js
Start the client:

bash
Copy code
cd client
npm start
Production Mode
For production, you would typically set up a build process for the React app and configure your server to serve the static files. This setup guide focuses on development mode.

Troubleshooting
Ensure MongoDB is running on your machine.
Verify the .env file contains the correct MongoDB URI.
Check for any errors in the terminal and resolve dependencies issues if any.
Contributors
Your Name (your-email@example.com)
License
This project is licensed under the MIT License. See the LICENSE file for details.

