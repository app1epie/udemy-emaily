const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongooseURI);

const app = express();

//middleware
app.use(
    cookieSession({
        maxAge: 1*24*60*60*1000,
        keys: [ keys.cookieKey ]
    })
);

app.use(passport.initialize());
app.use(passport.session());

//Routes
require('./routes/authRoutes')(app);

//https://shielded-tundra-34868.herokuapp.com/
const PORT = process.env.PORT || 5000;
app.listen(PORT);