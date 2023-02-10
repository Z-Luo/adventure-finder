const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const http = require('http');
const AppError = require('./utils/appErrors');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(morgan('dev'));
// app.use((req, res, next) => {
//   console.log('hello from the middleware');
//   next();
// });

// app.get('/', (req, res) => {
//   res.status(200).json({ text: `hello from the server` });
// });

// app.post('/', (req, res) => {
//   res.send('hello from the server');
// });

// tours
// get -- read
// http Post method -- create new
// http patch -- update
// http delete -- delete
// endpoint parameters

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
//error handler for wrong endpoint
app.all('*', (req, res, next) => {
  next(new AppError(`Can's find ${req.originalUrl} on this server!`, 404));
});
// centralized
app.use(globalErrorHandler);

//users

module.exports = app;
