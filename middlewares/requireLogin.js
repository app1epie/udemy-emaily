//check if session is authenticated, user is login
module.exports = (req, res, next) => {

    if (!req.user) {
        //return http unauthorized
        return res.status(401).send({ error: 'You must log in!' });
    }

    //continue to the next function
    next();
};