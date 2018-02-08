let express = require('express');
let random = require('random-number');
let _ = require('lodash');
let Nexmo = require('nexmo');
let mongoose = require('mongoose');
let Router = express.Router();

let nexmo = new Nexmo({
    apiKey: process.env.NEXMO_APIKEY,
    apiSecret: process.env.NEXMO_APISECRET
  }, {debug: true});

let options = {
    min:1000,
    max:9999,
    integer: true
}
require('../models/User');
require('../models/Vehicle')
let users = mongoose.model('Users');
let vehicle = mongoose.model('Vehicles');
Router.post('/user/login', (req, res) => {
    let body = _.pick(req.body,['email','password']);
    users.findByCredentials(body.email, body.password).then((user) => { 
        console.log(user.verify);
        if(user.verify == false) {
            return res.status(401).send(`sorry ${user.email} is not verified User please Verify User and try again`);
        }
        console.log(user.role);
        if(user.role == 'admin') {
            res.status(401).send(`sorry ${user.role} are not allowed for api`);
        } else {
            res.header('x-auth', user.tokens[0].token);
            res.status(200).send(user);
        }
    
    }).catch((e) => {
        res.status(400).send('Username and password are incorrect');
    });
});

Router.post('/user/register', (req, res) => {
    console.log('done');
    let body = _.pick(req.body, ['name','email', 'password', 'role', 'phone', 'address', 'license_no', 'profile_url']);
    if(body.role == 'user') {
        let newUser = new users(body);
    newUser.save().then(() => {
        return newUser.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token);
        let otp = random(options);
        nexmo.message.sendSms(
            '918866295803', '918866295803', `Thanks for choosing us your otp is ${otp}`, { type: 'unicode' },
            (err, responseData) => {
              if(err) {
                console.log(err);
              } else {
                console.dir(responseData);
                // Get data from response
                const data = {
                  id: responseData.messages[0]['message-id'],
                  number: responseData.messages[0]['to']
                }
              }
            });
        res.status(201).json({"_id":newUser._id,"email":newUser.email,"otp": otp});
    }).catch((e) => {
        res.status(400).send(e);
    })
}   else {
        res.status(400).send(`sorry ${body.role} is not a valid role`);
    }
});

Router.post('/user/verifyemail', (req, res) => {
    let body = _.pick(req.body, ['email']);
    let otp = random(options);
    users.findByEmail(body.email).then((user) => {
        res.header('x-auth', user.tokens[0].token)
        res.json({"email":user.email,"otp":otp});
    }).catch((e) => {
        res.status(406).send(`sorry ${body.email} is not registered email id`);
    })
});

Router.post('/user/verify', (req, res) => {
    let body = _.pick(req.body,['email']);
    let query = {'email':body.email};
    users.findByEmail(body.email).then((user) => {
        users.findOneAndUpdate(query,{verify:true}, (err, user) => {
            return res.send(user);
        });
    }).catch((e) => {
        res.status(406).send(`sorry ${body.email} is not registered email id`);
    })
    
});

Router.get('/user/cars/:id', (req, res) => {
    let id = req.params.id;
    console.log('aaya api route req',id)
    vehicle.findByUserId(id).then((vehicle) => {
        res.json(vehicle);
     }).catch((e) => {
        res.send(`Sorry you are not registered user`).status(200);
     });
});


module.exports = Router;