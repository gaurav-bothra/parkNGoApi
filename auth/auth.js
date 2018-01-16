let mongoose = require('mongoose');
require('../models/User');

let user = mongoose.model('Users')
module.exports = (req, res, next) =>{
    let token = req.session.x_token;
    console.log('token', token);
    user.findByToken(token).then((user) => {
        if(!user) {
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        next();
    }).catch(e =>{
        res.status(401).redirect('/user/login');
    });
};