const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/api/register', UserController.registerUser);
router.post('/api/login', UserController.loginUser);
router.post('/api/logout', auth, UserController.logoutUser);
router.get('/api/loggedIn', auth, UserController.getLoggedIn);
router.put('/api/addUser', auth, UserController.addUser);
router.get('/api/retrieveusers', auth, UserController.retrieveUsers);

module.exports = router;
