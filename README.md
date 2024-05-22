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

To get started with DevSwarm, follow these steps:

1. Clone the repository to your local machine:
    ```sh
    git clone https://github.com/yourusername/devswarm.git
    cd devswarm
    ```

2. Install server-side dependencies:
    ```sh
    cd server
    npm install
    ```

3. Install client-side dependencies:
    ```sh
    cd ../client
    npm install
    ```

## Usage

### Features

- Ask questions
- Provide answers
- Add comments
- Manage tags
- Admin privileges

### Dependencies

- MongoDB
- Express.js
- React
- Node.js
- Other dependencies specified in `package.json`

## Database Initialization

To populate the database with initial test data and create an admin user, run the following command from the root directory of the project:

```sh
node server/init.js admin@gmail.com:secretAdmin mongodb://127.0.0.1:27017/fake_so


To populate the database with initial test data and create an admin user, run the following command from the root directory of the project:

```sh

To delete all data from the database, run the following command:

```sh
node server/deleteData.js

## Running the Application

### Start the Server

From the root directory of the project, run:

```sh
nodemon server/server.js

### Start the Client

Navigate to the `client` directory and start the client:

```sh
cd client
npm start

## Troubleshooting

If you encounter any issues, ensure that:

- MongoDB is running on your machine.
- You have the correct environment variables set up in your `.env` file.
- All dependencies are properly installed.

node server/init.js admin@gmail.com:secretAdmin mongodb://127.0.0.1:27017/fake_so

