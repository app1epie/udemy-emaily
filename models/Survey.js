const mongoose = require('mongoose');
const { Schema } = mongoose;

//mongodb child model sub-document collection
//mongodb 1 single document is max: 4mb
const RecipientSchema = require('./Recipient');

const surveySchema = new Schema({
    title: String,
    body: String,
    subject: String,
    recipients: [RecipientSchema], //sub-document collection
    yes: { type: Number, default: 0 },
    no: { type: Number, default: 0 },
    _user: { type: Schema.Types.ObjectId, ref: 'User' }, //foreign-key to [User collection], relationship field
    dateSent: Date,
    lastResponded: Date
});

mongoose.model('surveys', surveySchema);