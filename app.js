const createError = require('http-errors');
const express = require('express');
const path = require('path');
const http = require('http');
const cookieParser = require('cookie-parser');
const mongo = require('mongodb');
const logger = require('morgan');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dogRouter = require('./routes/dogs');
const aboutRouter = require('./routes/about');
const postRouter = require('./routes/post');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const socketIO = require('socket.io');


const app = express();
const server = http.createServer(app);
const io= socketIO(server);

require('./socket/friend')(io);

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null
  next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./config/passport')(passport);
// DB Config
const db = require('./config/keys');

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
  
  app.use('/', indexRouter);
  app.use('/about', aboutRouter);
  app.use('/users', usersRouter);
  app.use('/dogs', dogRouter);
  app.use('/posts', postRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
