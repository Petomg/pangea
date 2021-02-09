var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
let mongoose = require('mongoose');
let cors = require('cors');
const jwt = require('jsonwebtoken');

require('dotenv').config();

require('./config.js');

let indexRouter = require('./routes/index');
let votingRouter = require('./routes/voting');
let topicRouter = require('./routes/topics');
let loginRouter = require('./routes/login');
let registerRouter = require('./routes/register');
let logoutRouter = require('./routes/logout');


var app = express();
app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var checkAuth = (req, res, next) => {
  console.log("Checking authentication");
  
  console.log(req.cookies);
  if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
    req.user = null;
    console.log("*********NO LOGUEADO***********");
  } else {
    var token = req.cookies.nToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
    console.log("*********LOGUEADO***********");
  }

  next();
};

app.use(checkAuth);

app.use('/', indexRouter);
app.use('/voting', votingRouter);
app.use('/topics', topicRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/logout', logoutRouter)





mongoose.connect('mongodb://localhost:27017/pange' , {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected successfuly");
});

module.exports = app;
