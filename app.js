var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mongoose = require('mongoose'); // Gộp các require lại

// 1. Khai báo app trước
var app = express();

// 2. Require các router
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var rolesRouter = require('./routes/roles'); // Đã thêm

// 3. View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 4. Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 5. Đăng ký Routes (Nằm dưới app.use middleware)
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/roles', rolesRouter); // Đã thêm
app.use('/api/v1/products', require('./routes/products'));
app.use('/api/v1/categories', require('./routes/categories'));

mongoose.connect('mongodb://localhost:27017/NNPTUD-C5');
mongoose.connection.on('connected', function () {
  console.log("connected");
})
mongoose.connection.on('disconnecting', function () {
  console.log("disconnected");
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
