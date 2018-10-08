const mongoose = require('mongoose');
const requiredLogin = require('../middlewares/requireLogin');
const requiredCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');
const Survey = mongoose.model('surveys');

module.exports = (app) => {

    app.get('/api/surveys/thanks', (req, res) => {
        res.send('Thanks for voting!');
    });

    //post survey: create a new survey
    app.post('/api/surveys', requiredLogin, requiredCredits, async (req, res) => {
        const { title, subject, body, recipients } = req.body;

        const survey = new Survey({
            title,
            subject,
            body,
            recipients: recipients.split(',').map(email => ({ email: email.trim() })),
            _user: req.user.id,
            dateSent: Date.now()
        });

        // send an email
        const mailer = new Mailer(survey, surveyTemplate(survey));

        try {
            await mailer.send();

            //save survey to database
            await survey.save();

            //update user credit
            req.user.credits -= 1;
            const user = await req.user.save();

            res.send(user);
        } catch (err) {
            console.log(err);
            res.status(422).send(err);
        }
    });

    //get surverys: return list of surveys by current_user

    //post webhook: record feedback from user
    app.post('/api/surveys/webhook', (req, res) => {

        console.log(req.body);

        res.send({});
    });
};