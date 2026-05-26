const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // No two users can have the same email
    lowercase: true
  },
  password: {
    type: String,
    required: true // This will be a hashed string, never plain text!
  }
}, { timestamps: true }); // Automatically tracks 'createdAt' and 'updatedAt'

module.exports = mongoose.model('User', UserSchema);