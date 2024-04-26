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

  async loginUser(req, res) {
    const savedUser = req.body
    const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET);
    await res.cookie("token", token, {
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

  async logoutUser(req, res) {
    
  },

  async getLoggedIn(req, res) {
    
  }
};

module.exports = UserController;