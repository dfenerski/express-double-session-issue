var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
const Redis = require("ioredis");
const RedisStore = require("connect-redis").default

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const redisClient = new Redis({});
const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'DBG:',
  ttl: 3600,
});

const session1 = session({
  name: 'session',
  secret: 'keyboard cat',
  saveUninitialized: true,
  resave: true,
  cookie: { domain: 'localhost' },
  store: redisStore,
});
const session2 = session({
  name: 'session',
  secret: 'keyboard cat',
  saveUninitialized: true,
  resave: true,
  cookie: { domain: 'foo.bar' },
  store: redisStore,
});
session2;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session1)
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
