const express = require('express');
const bodyparser = require('body-parser');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const morgan = require('morgan');


const app = express();

// if in dev eviroment print the logs
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
};


// body parser
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());


app.use('/tours', tourRouter);
app.use('/users', userRouter);
app.use('/reviews', reviewRouter);


// if any route not defined send a message
app.all('/{*any}', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
});

app.use(globalErrorHandler);

module.exports = app;



