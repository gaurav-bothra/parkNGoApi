let express = require('express');
let Router = express.Router();

Router.get('/', (req, res) => {
    res.render('index');
});

Router.get('/about', (req, res) => {
    res.render('about');
});






module.exports = Router;