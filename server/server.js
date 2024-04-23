// Application server
// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express');
const cors = require('cors'); 
const mongoose = require('mongoose');
const Question = require('./models/questions');
const Answer = require('./models/answers');
const Tag = require('./models/tags');
const User = require('./models/users');

const app = express();
app.use(cors());
app.use(express.json()); 

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


app.get('/retrievequestions', async(req, res)=>{
    const questions = await Question.find();
    res.send(questions);
})

app.get('/retrieveanswers', async(req, res)=>{
    const answers = await Answer.find();
    res.send(answers);
})

app.get('/retrievetags', async(req, res)=>{
    const tags = await Tag.find();
    res.send(tags);
})

app.get('/retrieveusers', async(req, res)=>{
    const users = await User.find();
    res.send(users);
})

app.put('/updatequestions', async(req, res)=> {
    const newData = req.body;
    await Question.deleteMany({}); 
    await Question.insertMany(newData); 
    res.send();
})

app.put('/updateanswers', async(req, res)=> {
    const newData = req.body;
    // await Answer.deleteMany({});
    const insertedAnswer = await Answer.create(newData);
    // const lastInsertedAnswer = insertedAnswer[insertedAnswer.length - 1]; 
    res.send(insertedAnswer); 
})

app.put('/updatetags', async(req, res)=> {
    const newData = req.body;
    const insertedTag = await Tag.create(newData);
    console.log(insertedTag)
    res.send(insertedTag); 
})

app.put('/addquestion', async(req, res)=>{
    const newData = req.body;
    const insertedQuestion = await Question.create(newData);
    res.send(insertedQuestion); 
})

app.put('/addUser', async(req, res)=>{
    const newData = req.body;
    await User.create(newData);
})