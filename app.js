let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let exphbs  = require('express-handlebars');
let flash = require('connect-flash');
let cors = require('cors')
let session = require('express-session');
let _ = require('lodash');
let http = require('http');
let path = require('path');
let socketIO = require('socket.io');
require('dotenv/config');
let homeRoute = require('./Routes/homeRoute');
let userRoute = require('./Routes/userRoute');
let adminRoute = require('./Routes/adminRoute');
let apisRoute = require('./Routes/apisRoute');
var NodeGeocoder = require('node-geocoder');

var options = {
    provider: 'google',
   
    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: 'AIzaSyChgkxmoEX_vqVlGpAqKgxd4qcAPQaKVHA', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
  };

  let geocoder = NodeGeocoder(options);

  

//DB_CONFIG 
require('./config/dbConfig');

//NEXMO CONFIG
// require('./config/nexmoConfig');

// MIDDLE WARE 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//EXPRESS STATIC FOLDER

//EXPRESS HANDLEBARS MIDDLEWARE
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, './public')));

// EXPRESS SESSION MIDDLEWARE
app.use(session({
    secret: 'keyboard is secret',
    resave: true,
    saveUninitialized: true
  }));

app.use(cors())


// FLASH MIDDLEWARE
app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.session.user || null;
    next();
});


//CALL SOCKET.IO
let server = http.createServer(app);
let IO = socketIO(server);

IO.on('connection', (socket) => {
    console.log('New User Connected');
    socket.on('newLocation', (data) => {
        console.log('new Location', data)
        IO.emit('newLocation', {
            user:data.token,
            lat:data.lat,
            lgn:data.lgn
        });
    });
    socket.on('newSpeed', (data) => {
        IO.emit('newSpeed', {
            speed : data.speed
        });
    })
})

//Using Routes
app.use('/', homeRoute);
app.use('/user', userRoute);
app.use('/admin', adminRoute);
app.use('/api', apisRoute);



app.post('/returnAddress' ,(req, res) => {
    let body = _.pick(req.body, ['lat', 'lgn']);
    console.log('body',body.lat);
    geocoder.reverse({lat:body.lat, lon:body.lgn}, function(err, result) {
        res.send(JSON.stringify(result[0].formattedAddress));
        console.log(JSON.stringify(result[0].formattedAddress));
      });

});

// geocoder.reverse({lat:23.0962362, lon:72.5966967}, function(err, res) {
    
//   });

server.listen(process.env.SERVER_PORT, () => {
    console.log(`App is running at port :  ${process.env.SERVER_PORT}`);
});
