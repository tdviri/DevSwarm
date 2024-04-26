const express = require('express');
const router = express.Router();
const UserController = require('./controllers/userController');
const auth = require('./auth');

router.post('/register', auth.verify, UserController.registerUser);
router.post('/login', auth.verify, UserController.loginUser);
router.get('/logout', auth.verify, UserController.logoutUser);
router.get('/loggedIn', auth.verify, UserController.getLoggedIn);
router.put('/addUser', auth.verify, UserController.addUser);
router.get('/retrieveusers', auth.verify, UserController.retrieveUsers);

module.exports = router;