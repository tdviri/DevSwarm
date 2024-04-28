// Application server
// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const answerRoutes = require('./routes/answerRoutes');
const tagRoutes = require('./routes/tagRoutes');
const questionRoutes = require('./routes/questionRoutes');

const app = express();
const corsOptions = {
    origin: 'http://localhost:3000', 
    credentials: true, 
    optionsSuccessStatus: 200
};
  
app.use(cors(corsOptions));
// app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", function (req, res) {
    res.send("Hello World!");
});
// Define the port for the server to listen on
const PORT = 8000;

const server = app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
    

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/fake_so', { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Bind connection to open event (to get notification when connected)
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Handle server termination
process.on('SIGINT', () => {
    // Close the server
    server.close(() => {
        console.log('Server closed. Database instance disconnected.');
        // Disconnect from MongoDB
        mongoose.disconnect();
        process.exit(0); // Exit the process
    });
});

app.use('/', userRoutes);
app.use('/', answerRoutes);
app.use('/', tagRoutes);
app.use('/', questionRoutes);