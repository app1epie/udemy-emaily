const mongoose = require('mongoose');
const { Schema } = mongoose;

// User model
const userShema = new Schema({
    googleId: String,
    Name: String,
    // Email: String
});

// Declare schema to MongoDB collections
mongoose.model('users', userShema);