var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mongoose = require('mongoose');

var indexRouter = require('./routes/index');

var app = express();


// ================= VIEW ENGINE =================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// ================= MIDDLEWARE =================
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// ================= ROUTES =================
app.use('/', indexRouter);
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/products', require('./routes/products'));
app.use('/api/v1/categories', require('./routes/categories'));
app.use('/api/v1/roles', require('./routes/roles'));
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/carts', require('./routes/carts'));
app.use('/api/v1/upload', require('./routes/upload'));

// ✅ MESSAGE ROUTER (THÊM MỚI)
app.use('/api/v1/messages', require('./routes/message'));

// ================= DATABASE =================
mongoose.connect('mongodb://localhost:27017/NNPTUD-C3');

mongoose.connection.on('connected', () => {
  console.log("MongoDB connected");
});

mongoose.connection.on('disconnected', () => {
  console.log("MongoDB disconnected");
});


// ================= ERROR HANDLER =================

// catch 404
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;