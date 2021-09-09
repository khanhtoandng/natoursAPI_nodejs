const fs  = require('fs');
const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARES
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(express.json());

// ROUTES
app.use('/api/tours', tourRouter);
app.use('/api/users', userRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Cant find ${req.originalUrl} on the server!`, 404));
});
    
app.use(globalErrorHandler);

module.exports = app;