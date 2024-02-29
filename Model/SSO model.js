const mongoose = require('mongoose');

const User = mongoose.model('singlesignon', new mongoose.Schema({
  profileId: String,
  email: String,
  loginTime: Date,
  logoutTime: Date
}));

module.exports = User;
