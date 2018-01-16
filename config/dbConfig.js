let mongoose = require('mongoose');
require('dotenv/config');
mongoose.Promise = global.Promise;

module.exports = mongoose.connect(process.env.DB_NAME, {useMongoClient: true})
.then(() => console.log('MongoDB Connected....'))
.catch(e => console.log(e));