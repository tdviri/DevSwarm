# DevSwarm

## Introduction

This is a MERN stack application that serves as a technical hub where developers can ask questions, provide answers, add comments, and manage tags. The app is built using MongoDB, Express.js, React, and Node.js.

## Table of Contents

1. [Installation](#installation)
2. [Features](#features)
3. [Dependencies](#dependencies)
4. [Database Initialization](#database-initialization)
5. [Running the Application](#running-the-application)
6. [Troubleshooting](#troubleshooting)

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
- Admin privileges for managing the platform

## Dependencies

### Server

- express
- mongoose
- dotenv
- cors
- cookie-parser
- body-parser
- bcrypt

### Client

- react
- react-dom
- axios
- react-router-dom

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

