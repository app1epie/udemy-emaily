const mongoose = require('mongoose');
const { Schema } = mongoose;

// User model
const userShema = new Schema({
    googleId: String,
    Name: String,
    credits: { type: Number, default: 0 },
    Email: String
});

// Declare schema to MongoDB collections
mongoose.model('users', userShema);