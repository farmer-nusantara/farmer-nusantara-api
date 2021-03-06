var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
const multer = require('multer')

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
var app = express();
const mongoose = require('mongoose');
const cors = require('cors');

const { NODE_ENV, MONGO_DEV_URI, MONGO_PROD_URI } = process.env;
mongoose.connect(process.env.MONGO_PROD_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Database connected!"))
    .catch(err => console.log(err));

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
  fileSize: 5 * 1024 * 1024,
  },
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(multerMid.single('file'))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);

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
