// Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.


// Run this script to test your schema
// Start the mongoDB service as a background process before running the script
// Pass URL of your mongoDB instance as first argument(e.g., mongodb://127.0.0.1:27017/fake_so)

//admin credentials: username: admin@gmail.com, password: secretAdmin
const bcrypt = require('bcrypt');
const saltRounds = 10; 
let userArgs = process.argv.slice(2);

let adminCredentials = userArgs[0].split(':');
const adminEmail = adminCredentials[0];
const adminPassword = adminCredentials[1];

if (!userArgs[1].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
let User = require('./models/users')
let Tag = require('./models/tags')
let Answer = require('./models/answers')
let Question = require('./models/questions')
let Comment = require('./models/comments')

let mongoose = require('mongoose');
let mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

function tagCreate(name) {
  let tag = new Tag({ name: name });
  return tag.save();
}

async function userCreate(firstName, lastName, email, username, password, reputation, votedQuestions, votedAnswers, votedComments, askedQuestions, answersAdded, tagsCreated, isAdmin){
  const salt = await bcrypt.genSalt(saltRounds);
  const passwordHash = await bcrypt.hash(password, salt);
  
  let user = {
    firstName: firstName,
    lastName: lastName,
    email: email, 
    username: username,
    passwordHash: passwordHash, 
    reputation: reputation,
    votedQuestions: votedQuestions,
    votedAnswers: votedAnswers,
    votedComments: votedComments, 
    askedQuestions: askedQuestions,
    answersAdded: answersAdded,
    tagsCreated: tagsCreated,
    isAdmin: isAdmin
  }

  let newUser = new User(user);
  return newUser.save();
}

function answerCreate(text, ans_by, ans_date_time, comments, votes) {
  let answerdetail = {
    text: text,
    ans_by: ans_by,
    ans_date_time: ans_date_time,
    comments: comments,
    votes: votes
  }

  let answer = new Answer(answerdetail);
  return answer.save();
}

function questionCreate(title, summary, text, tags, answers, comments, asked_by, ask_date_time, views, votes) {
  qstndetail = {
    title: title,
    summary: summary,
    text: text,
    tags: tags,
    answers: answers,
    comments: comments,
    asked_by: asked_by,
    ask_date_time: ask_date_time,
    views: views,
    votes: votes
  }

  let qstn = new Question(qstndetail);
  return qstn.save();
}

function commentCreate(text, comm_by, comm_date_time, votes){
  commentDetail = {
    text: text,
    comm_by: comm_by,
    comm_date_time: comm_date_time,
    votes: votes
  }

  let comment = new Comment(commentDetail)
  return comment.save()
}

const populate = async () => {
  let t1 = await tagCreate('react');
  let t2 = await tagCreate('javascript');
  let t3 = await tagCreate('android-studio');
  let t4 = await tagCreate('shared-preferences');

  let c1 = await commentCreate('comment1', 'mbern', Date.now(), 0);
  let c2 = await commentCreate('comment2', 'mgerj', Date.now(), 0);
  let c3 = await commentCreate('comment3', 'mbern', Date.now(), 0);
  
  let a1 = await answerCreate('React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.', 'jackd14', Date.now(), [c1, c2, c3], 0); 
  let a2 = await answerCreate('On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.', 'mgerj', Date.now(), [], 0 );
  let a3 = await answerCreate('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.', 'mbern', Date.now(), [], 0);
  let a4 = await answerCreate('YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);', 'mbern', Date.now(), [], 0);
  let a5 = await answerCreate('I just found all the above examples just too confusing, so I wrote my own. ', 'mbern', Date.now(), [], 0);

  let q1 = await questionCreate('Programmatically navigate using React router', 'need to understand how React router works', 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.', [t1, t2], [a1, a2], [], 'mbern', Date.now(), 32, 0); 
  let q2 = await questionCreate('android studio save string shared preference', 'having difficulty working with android studio', 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.', [t3, t4, t2], [a3, a4, a5], [], 'mgerj', Date.now(), 121, 0);
  
  let u1 = await userCreate("Mark", "Bern", "mbern@gmail.com", "mbern", "den43", 50, [], [], [], [q1], [a3, a4, a5], [t1, t2], false);
  let u2 = await userCreate("Mikayla", "Gerj", "mikaylagerj@stonybrook.edu", "mgerj", "mypassword123", 50, [], [], [], [q2], [a2], [t2, t3, t4], false)
  let u3 = await userCreate("Jack", "Don", "jackdon@gmail.com@", "jackd14", "myPwsrd", 50, [], [], [], [], [a1], [], false)
  let adminUser = await userCreate("administrator", "1", adminEmail, "admin", adminPassword, 50, [], [], [], [], [], [], true);
  if(db) db.close();
  console.log('done');
}

populate()
  .catch((err) => {
    console.log('ERROR: ' + err);
    if(db) db.close();
  });

console.log('processing ...');

