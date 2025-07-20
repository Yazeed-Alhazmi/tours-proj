const express = require('express');
const bodyparser = require('body-parser');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');


const app = express();

// if in dev eviroment print the logs
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
};

// rate limiter
const limiter = rateLimit({
    max: 100,
    window: 60 * 60 * 1000,
    message: 'To many request, please try again in an hour!'
});
// rate limit to all routes
app.use('/',limiter);

// body parser
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

// middleware to save the request time
app.use((req, res, next) => {
    req.reqTime = new Date().toISOString();
    next();
});


app.use('/tours', tourRouter);
app.use('/users', userRouter);
app.use('/reviews', reviewRouter);

// if any route not defined send a message
app.all('/{*any}', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
});

app.use(globalErrorHandler);

module.exports = app;



