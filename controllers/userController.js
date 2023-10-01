const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, password: hashedPassword });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
  
      const validPassword = await bcrypt.compare(password, user.password);
  
      if (!validPassword) {
        return res.status(401).json({ error: 'Password mismatch' });
      }
  
      const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
        expiresIn: '1h',
      });
  
      res.status(200).json({ token : token  , Message : "Hurray You are Logged In" });
    } catch (error) {
      console.error('Error in login:', error); // Add this line to log the error
      res.status(500).json({ error: `Failed from catch block : ${error}` });
    }
  };
  