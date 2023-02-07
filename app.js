const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const http = require('http');

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

app.all('*', (req, res, next) => {
  return res.status(404).json({
    status: 'fail',
    message: `Can's find ${req.originalUrl} on this server!`,
  });
});
//users

module.exports = app;
