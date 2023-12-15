const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: [true, 'this username already exists in the system']
  },
  email: {
    type: String,
    required: true,
    unique: [true, 'this email already exists in the system']
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
