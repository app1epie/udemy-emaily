const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requiredLogin = require('../middlewares/requireLogin');

module.exports = (app) => {
    app.post('/api/stripe', requiredLogin, async (req, res) => {
        const charge = await stripe.charges.create({
            amount: 500,
            currency: 'usd',
            description: '$5 for 5 credits',
            source: req.body.id
        });

        //User profile tighed with the profile
        req.user.credits += 5;
        const user = await req.user.save();

        //send back User to the browser
        res.send(user);
    });
};