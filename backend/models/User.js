const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatar: { type: String, default: '' }, // initials or image url
  color: { type: String, default: '#6c63ff' }, // avatar bg color
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
