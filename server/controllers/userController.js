const User = require('./models/users');

const UserController = {
  async registerUser(req, res) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
        firstName, lastName, email, username, passwordHash, reputation
    });
    const savedUser = await newUser.save();
    const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
    if (!passwordCorrect) {
        return res.status(401).json({errorMessage: "Wrong email or password."})
    }
  },

  loginUser(req, res) {
    const savedUser = req.body
    const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET);
    res.cookie("token", token, {
        httpOnly: true, secure: true, sameSite: "none"
    }).status(200).json({
    success: true,
    user: {
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        username: savedUser.username,
        passwordHash: savedUser.passwordHash,
        reputation: savedUser.reputation
    }}).send();
  },

  logoutUser(req, res) {
    res.cookie('token', '', { expires: new Date(0), httpOnly: true, secure: true, sameSite: 'none' });
    res.status(200).json({ success: true }).send();
  },

  async getLoggedIn(req, res) {
    
  },

  async retrieveUsers(req, res) {
    const users = await User.find();
    res.send(users);
  },

  async addUser(req, res) {
    const newData = req.body;
    await User.create(newData);
    res.send();
  }
};

module.exports = UserController;