const User = require('../models/users');
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcrypt');

const UserController = {
  async registerUser(req, res) {
    const password = req.body.newUser.password;
    const verifyPassword = req.body.newUser.verifyPassword;
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
        firstName: req.body.firstName, 
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        passwordHash: passwordHash,
        reputation: 50
    });
    const emailID = newUser.email.split("@")[0];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    const isInvalidEmail = !emailRegex.test(newUser.email);
    const isDifferentPasswords = (password !== verifyPassword);
    const isPasswordContainsEmail = (password.indexOf(emailID) !== -1);
    const isPasswordContainsUsername = (password.indexOf(username) !== -1);
    const isPasswordContainsName = (password.indexOf(newUser.firstName) !== -1 || password.indexOf(newUser.lastName) !== -1);
    let user = User.findOne({ email: newUser.email });
    if (!user){
      return res.status(401).json({errorMessage: "Email is already registered."})
    }

    if (isInvalidEmail){
      return res.status(401).json({errorMessage: "Email is invalid."})
    }
    if (isDifferentPasswords){
      return res.status(401).json({errorMessage: "Passwords do not match."})
    }
    if (isPasswordContainsEmail){
      return res.status(401).json({errorMessage: "Password cannot contain your email."})
    }
    if (isPasswordContainsUsername){
      return res.status(401).json({errorMessage: "Password cannot contain your username."})
    }
    if (isPasswordContainsName){
      return res.status(401).json({errorMessage: "Password cannot contain your name."})
    }
    await newUser.save();
    res.send();
  },

  async loginUser(req, res) {
      let user = await User.findOne({ email: req.body.email });
      if (!user){
        return res.status(401).json({errorMessage: "Email is not registered."})
      }
      user = await User.findOne({password: req.body.password});
      if (!user){
        return res.status(401).json({errorMessage: "Password is incorrect."})
      }
      user = await User.findOne({email: req.body.email});
      if (!user){
        return res.status(401).json({errorMessage: "Account not found."})
      }

    const savedUser = await User.findOne({email: req.body.email});
    const token = jwt.sign({ userId: savedUser._id }, 'JWT$3cr3tKey!#2024');
    res.cookie("token", token, {
        httpOnly: true, secure: true, sameSite: "none"
    }).status(200).json({success: true}).send();

  },

  logoutUser(req, res) {
    res.cookie('token', '', { expires: new Date(0), httpOnly: true, secure: true, sameSite: 'none' });
    res.status(200).json({ success: true }).send();
  },

  async getLoggedIn(req, res) {
    
  },

  // async retrieveUsers(req, res) {
  //   const users = await User.find();
  //   res.send(users);
  // },

  async addUser(req, res) {
    const newData = req.body;
    await User.create(newData);
    res.send();
  }
};

module.exports = UserController;