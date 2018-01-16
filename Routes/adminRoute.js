let express = require('express');
let _ = require('lodash');
let mongoose = require('mongoose');
let Router = express.Router();

let auth = require('../auth/auth');
let adminSessionHelper = require('../auth/adminSessionHelper');
require('../models/User');
let users = mongoose.model('Users');



Router.get('/dashboard', auth,adminSessionHelper, (req, res) => {
    return res.render('admin/dashboard');
});

Router.get('/trackUser', auth, adminSessionHelper, (req, res) => {
 
    return res.render('admin/trackUser');
});

Router.post('/trackUser', auth, adminSessionHelper, (req, res) => {
    let body = _.pick(req.body,['email']);
    console.log(body);
    users.findByEmail(body.email).then((user) => {
        if(user.role == 'admin'){
            return res.redirect('/admin/trackUser');
        }
        return res.redirect('/user/dashboard/'+user._id);
    }).catch((e)=>{
        res.status(403).redirect('/admin/trackUser');
    });
});

Router.get('/onlineUsers', auth, adminSessionHelper, (req, res) => {
  
    return res.render('admin/onlineUsers')
});

Router.get('/totalUsers', auth, adminSessionHelper, (req, res) => {
    return res.render('admin/totalUsers');
});

module.exports = Router;