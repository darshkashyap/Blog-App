const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Blog Schema
const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String
});

// Export the models
const User = mongoose.model('Users', userSchema);
const Blog = mongoose.model('Blogs', blogSchema);

module.exports = { User, Blog };



