const passport = require('passport'); //passport.js

module.exports = (app) =>{
        //login link
        app.get(
            '/auth/google', 
            passport.authenticate('google', {
                scope: ['profile', 'email']
            })
        );

        //login callback
        app.get(
            '/auth/google/callback',
            passport.authenticate('google'),
            (req, res) => {
                //redirect
                res.redirect('/surveys');
            }
        );

        app.get(
            '/api/logout', (req, res) => {
                req.logout();
                res.redirect('/');
            });

        app.get('/api/current_user', (req, res) => {
            res.send(req.user);
        });
};