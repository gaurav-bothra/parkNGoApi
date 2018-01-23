let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
let validator = require('validator');
let _ = require('lodash');
let jwt = require('jsonwebtoken');
require('dotenv/config');
let Schema = mongoose.Schema;
let UserSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: value => validator.isEmail(value),
            message: '{value} is not valid Email'
        },
    },
    password : {
        type: String,
        required: true
    },
    role : {
        type: String,
        required: true
    },
    phone : {
        type: Number,
        required: true,
        unique: true
    },
    address : {
        type: String,
        required: true
    },
    license_no : {
        type: String,
        required: true
    },
    profile_url : {
        type: String,
        required: true
    },
    verify : {
        type: Boolean,
        default: false
    },
    tokens : [{
        access : {
            type: String,
            required: true,
        },
        token : {
            type: String,
            required: true
        }
    }]
},{usePushEach: true });

UserSchema.methods.toJSON = function () {
    let User = this;
    let userObject = User.toObject();
    return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function() {
    let User = this;
    let access = process.env.JWT_ACCESS;
    let token = jwt.sign({_id: User._id.toHexString(), access}, process.env.JWT_SECRET).toString();
    User.tokens.push({access, token});
    return User.save().then(() => {
        return token;
    });
};



UserSchema.statics.findByToken = function(token) {
    let User = this;
    let decode;

    try{
        decode = jwt.verify(token,process.env.JWT_SECRET);
    } catch(e) {
        return Promise.reject();
    }

    return User.findOne({
       '_id' : decode._id,
       'tokens.token' : token,
       'tokens.access' : process.env.JWT_ACCESS
    });
};

UserSchema.statics.findByCredentials = function(email, password) {
    let User = this;
    return User.findOne({email}).then((user) => {
        if(!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, result) => {
                if(result) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    })
};


UserSchema.statics.findByEmail = function(email) {
    let User = this;
    return User.findOne({email}).then((user) => {
        if(!user) {
            return Promise.reject();
        }
        return Promise.resolve(user);
    })
};

UserSchema.pre('save', function(next) {
    let User = this;
    if(User.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(User.password, salt, (err, hash) => {
                User.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

let User = mongoose.model('Users', UserSchema);