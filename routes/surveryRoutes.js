const _ = require('lodash');
const { Path } = require('path-parser');
const { URL } = require('url');
const mongoose = require('mongoose');
const requiredLogin = require('../middlewares/requireLogin');
const requiredCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');
const Survey = mongoose.model('surveys');

module.exports = (app) => {

    //get surveys: return list of surveys by current_user
    app.get('/api/surveys', requiredLogin, async (req, res) => {
        // surverys without recipients propoerty/field
        const surverys = await Survey.find({ _user: req.user.id})
        .select({ recipients: false});
        res.send(surverys);
    });

    app.get('/api/surveys/:surveyId/:choice', (req, res) => {
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

    //post webhook: record feedback from user
    app.post('/api/surveys/webhook', (req, res) => {
        const p = new Path('/api/surveys/:surveyId/:choice');

        console.log(req.body);

        _.chain(req.body)
            .map(({ email, url }) => {
                //extraction
                const match = p.test(new URL(url).pathname);
                if (match) {
                    return {
                        email,
                        surveyId: match.surveyId,
                        choice: match.choice
                    };
                }
            })
            //array without undefined
            .compact()
            //remove duplication by 'email', and 'surveyId'
            .uniqBy('email', 'surveyId')
            .each(({ surveyId, email, choice }) => {

                console.log("exec db " + surveyId, email, choice);

                //run query
                Survey.updateOne(
                    {
                        _id: surveyId,
                        recipients: {
                            $elemMatch: {
                                email: email,
                                responded: false
                            }
                        }
                    },
                    {
                        $inc: { [choice]: 1 },
                        $set: { 'recipients.$.responded': true },
                        lastResponded: new Date()
                    }
                ).exec();
            })
            .value();

        res.send({});
    });
};