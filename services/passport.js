const passport = require('passport');
const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');

const Users = mongoose.model('users');

//convert user into cookie
passport.serializeUser((user, done) => {
    //using Mongo Users' collection id
    done(null, user.id);
});

//convert cookie to db user
passport.deserializeUser((id, done) => {
    Users.findById(id).then(user => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy({
        clientID:  keys.googleClientId,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
        Users.findOne({ googleId: profile.id })
            .then(existingUser =>{
                if(existingUser){

                    console.log('db user');

                    //serializeUser()
                    done(null, existingUser);
                } else{
                    new Users({ 
                        googleId: profile.id ,
                        Name: profile.displayName
                    }).save()
                    .then(user => done(null, user)); //serializeUser()
                }
            }
        );
    })
); 