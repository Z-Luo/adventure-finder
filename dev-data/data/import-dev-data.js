const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('./../../models/tourModel');
const { create } = require('./../../models/tourModel');
//environment config
dotenv.config({ path: `${__dirname}/../../config.env` });

const DB = process.env.DATABASE;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('success');
  });

const tourFile = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);
const createTour = async (req, res) => {
  try {
    await Tour.create(tourFile);
    console.log('successfully created tour');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteTour = async (req, res) => {
  try {
    await Tour.deleteMany();
    console.log('deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--create') {
  createTour();
}
if (process.argv[2] === '--delete') {
  deleteTour();
}
