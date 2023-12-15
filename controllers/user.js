const bcrypt = require('bcrypt');
const User = require( '../models/user')
const Token = require('../models/token');

const register = async (req, res) => {
  try {
    const data = req.body;

    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
    data.password = await bcrypt.hash(data.password, salt);

    const result = await User.create(data);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  const data = req.body;
  try {
    const user = await User.findOne({ email: data.email });

    if (!user) {
      throw new Error('User not found');
    }

    const authenticated = await bcrypt.compare(data.password, user.password);

    if (!authenticated) {
      throw new Error('Incorrect credentials.');
    } else {
      const token = await Token.create({ userId: user._id });

      res.status(200).json({ authenticated: true, token: token.token });
    }
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

const logout = async (req, res) => {
  try {
    const userToken = req.headers['authorization'];
    const token = await Token.findOne({ token: userToken });

    if (!token) {
      throw new Error('Token not found');
    }

    const result = await token.remove();
    res.status(200).send(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

module.exports = {
  register,
  login,
  logout
};

