const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongooseURI);

const app = express();

//middleware
app.use(bodyParser.json());
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
require('./routes/billingRoutes')(app);

//if running in production
if(process.env.NODE_ENV === 'production'){
    //express will serve up production assets
    //main.js
    app.use(express.statis('client/build'));

    //express will serve up index.html file if not recognized
    const path = require('path');
    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

//https://shielded-tundra-34868.herokuapp.com/
const PORT = process.env.PORT || 5000;
app.listen(PORT);