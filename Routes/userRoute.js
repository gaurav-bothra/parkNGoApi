let express = require('express');
let Router = express.Router();
let mongoose = require('mongoose');
let _ = require('lodash');

require('../models/User');
require('../models/Vehicle');
require('../models/Reservation');
let User = mongoose.model('Users');
let Vehicle = mongoose.model('Vehicles');
let Reservation = mongoose.model('Reservations');
let userSessionHelper = require('../auth/UserSession');
let adminSessionHelper = require('../auth/adminSessionHelper');
let auth = require('../auth/auth');

Router.get('/login', (req, res) => {
    if(req.session.user == 'admin'){
        res.redirect('/admin/dashboard');
    } else if(req.session.user == 'user') {
        res.redirect('/user/dashboard');
    } else {
        res.render('users/login');
    }
    
});

Router.post('/login', (req, res) => {
    let body = _.pick(req.body,['email','password']);
    console.log(body);
    User.findByCredentials(body.email, body.password).then((user) => {    
        if(user.role == 'user') {
            req.session.user = user.role;
            req.session.userInfo = user;
            res.header('x-auth', user.tokens[0].token);
            req.session.x_token = user.tokens[0].token;
            
            res.redirect('/user/dashboard');
        } else if(user.role == 'admin') {
            req.session.user = user.role;
            req.session.userInfo = user;
            res.header('x-auth', user.tokens[0].token);
            req.session.x_token = user.tokens[0].token;
            
            res.redirect('/admin/dashboard');
        } else {
            res.status(400).redirect('login');
        }
    }).catch((e) => {
        res.status(400).redirect('login');
    });
});

Router.post('/register', (req, res) => {
    let body = _.pick(req.body, ['email', 'name','password', 'role', 'phone', 'address', 'license_no', 'profile_url']);
    if(body.role == 'admin' || body.role == 'user') {
        let newUser = new User(body);
    newUser.save().then(() => {
        return newUser.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(newUser);
        if(newUser.role == 'user'){
            let vehicleObj = {
                UserId:newUser._id,
                vehicleInfo:[]
            };
            let newVehicle = new Vehicle(vehicleObj);
            newVehicle.save().then((vehicle)=>{
                let reservationObj = {
                    UserVehicleId:vehicle._id,
                    Reservation_Info:[]
                }
                let newReservation = new Reservation(reservationObj);
                newReservation.save().then((reservation) => {
                    console.log("Done Reservation")
                }).catch((e) => {

                });
            }).catch((e)=>{
                console.log(e)
            })
        }
    }).catch((e) => {
        res.status(400).send(e);
    })
}   else {
        res.status(400).send(`sorry ${body.role} is not a valid role`);
    }
});

Router.get('/forgotPassword', (req, res) => {
    res.render('forgotPassword');
});

Router.get('/dashboard', auth, userSessionHelper, (req, res) => {
    
    console.log(req.session.user);
    res.render('users/dashboard');
});

Router.get('/dashboard/:id', auth, adminSessionHelper, (req, res) => {
    console.log(req.session.user);
    res.render('users/dashboard');
});

Router.get('/currentLocation/:id', auth, adminSessionHelper, (req, res) => {
    res.render('users/currentLocation');
});

Router.get('/currentSpeed/:id', auth, adminSessionHelper, (req, res) => {
    res.render('users/currentSpeed');
});

Router.get('/travelDistance/:id', auth, adminSessionHelper, (req, res) => {
    res.render('users/travelDistance'); 
});

Router.get('/history/:id', auth, adminSessionHelper, (req, res) => {
    res.render('users/history');
});

Router.get('/car/:id', auth, adminSessionHelper, (req, res) => {
    res.render('users/car');
});

Router.get('/userLicense/:id', auth, adminSessionHelper, (req, res) => {
    res.render('users/userLicense');
});


Router.get('/currentLocation', auth, userSessionHelper, (req, res) => {
    res.render('users/currentLocation');
});

Router.get('/currentSpeed', auth, userSessionHelper, (req, res) => {
    res.render('users/currentSpeed');
});

Router.get('/travelDistance', auth, userSessionHelper, (req, res) => {
    console.log(req.user._id);
    res.render('users/travelDistance',{
        user:req.user._id
    }); 
});

Router.get('/history', auth, userSessionHelper, (req, res) => {
//     let uid = req.user._id;
//     let vid;
//     console.log(req.user.name , uid);
//     Vehicle.findByUserId(uid).then((vehicle) => {
//         if(!vehicle) {
            
//         }

//     }).catch((e) => {
//     });

//     Reservation.findByVehicleId(vid).then((reservation) => {
//         console.log('in reservartion');
//     if(!reservation) {
//         res.send('no reservartion');
//     }
//     // res.send(reservation);
//  }).catch((e) => {
//     console.log(e);
    res.render('users/history')
 });
Router.get('/car', auth, userSessionHelper, (req, res) => {
    let uid = req.user._id;
     Vehicle.findByUserId(uid).then((vehicle) => {
        let vehicles = vehicle.vehicleInfo;
        return res.render('users/car',{
            vehicle:vehicles,
            user:req.user.name
        });
     }).catch((e) => {
        res.render('users/car');
     });
    
});


Router.post('/car', auth, userSessionHelper, (req, res) => {
    let body = _.pick(req.body,['vehicleType','vehicleNo' ,'vehicleModel','vehicleCompany']);
    // res.send(body);
    let query = {'UserId':req.user._id};
        Vehicle.findOneAndUpdate(query,{$push: {vehicleInfo: body}}, (err, user) => {
            if(err) {
                return res.status(500).send('Please try later');
            }
            return res.redirect('/user/car');

        });
    
    
})

Router.get('/userLicense', auth, userSessionHelper, (req, res) => {
    res.render('users/userLicense');
});




Router.get('/logout', (req, res) => {
    req.session.user = null;
    req.session.x_token = null;
    res.redirect('/user/login');
});


module.exports = Router;