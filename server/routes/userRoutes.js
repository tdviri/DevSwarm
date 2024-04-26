const express = require('express');
const router = express.Router();
const UserController = require('./controllers/userController');
const auth = require('../middleware/auth');

router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.post('/logout', auth.verify, UserController.logoutUser);
router.get('/loggedIn', auth.verify, UserController.getLoggedIn);
router.put('/addUser', auth.verify, UserController.addUser);
router.get('/retrieveusers', auth.verify, UserController.retrieveUsers);

module.exports = router;
