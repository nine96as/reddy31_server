const Token = require('../models/token');

const authenticator = async (req, res, next) => {
  try {
    const userToken = req.headers['authorization'];

    if (userToken == 'null') {
      throw new Error('User not authenticated.');
    } else {
      const validToken = await Token.findOne({ token: userToken });

      next();
    }
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

module.exports = authenticator;
