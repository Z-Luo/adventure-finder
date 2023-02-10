// const express = require('express');
// const { response } = require('../app');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('./../utils/appErrors');

// exports.checkBody = (req, res, next) => {
//   if (!req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('price')) {
//     return res
//       .status(400)
//       .json({ status: 'failed', message: 'does not has a certain property' });
//   }
//   next();
// };

// Route handlers
// const toursData = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
// );

// exports.checkID = (req, res, next, val) => {
//   console.log(`the id is: ${val}`);
//   // returns if err, express is all about middleware
//   if (req.params.id * 1 > toursData.length) {
//     return res.status(404).json({ status: 'failed', message: 'Invalid ID' });
//   }

//   next();
// };
exports.aliasTopExpensiveTours = (req, res, next) => {
  req.query.sort = '-price';
  req.query.limit = 3;
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    //Build query
    //1, filtering
    // const { page, sort, limit, fields, ...queryObj } = req.query;
    // console.log(JSON.stringify(queryObj));
    // let query = Tour.find(queryObj);

    //3, sorting
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('-createdAt');
    // }

    //4, field limiting
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    //5, pagination
    // const pageNum = +req.query.page || 1;
    // const limitNum = +req.query.limit || 10;
    // const skip = (pageNum - 1) * limit;
    // query = query.skip(skip).limit(limitNum);

    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   console.log(numTours);
    //   if (skip >= numTours) throw new Error('not exist');
    // }

    //execute query
    const feature = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await feature.query;
    //send response
    res
      .status(200)
      .json({ status: 'success', results: tours.length, data: tours });
  } catch (err) {
    res.status(400).json({ status: 'failed', message: 'no good' });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'no good',
    });
  }
};

exports.updateTour = async (req, res, next) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tour) throw new AppError();
    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    next(new AppError(`Can't find ${req.originalUrl}, invalid ID`, 400));
  }
};

exports.deleteTour = async (req, res, next) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) throw new AppError();
    res.status(204).json({
      status: 'success',
    });
  } catch (err) {
    next(new AppError(`Can't find ${req.originalUrl}, invalid ID`, 400));
  }
};

exports.getTour = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) throw new AppError();

    res.status(200).json({ status: 'success', data: tour });
  } catch (err) {
    next(new AppError(`Can't find ${req.originalUrl}, invalid ID`, 400));
  }

  // const tour = toursData.find((el) => {
  //   return el.id === id;
  // });

  // res.status(200).json({ status: 'success', data: { tour } });
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.8 } },
      },
      {
        $group: {
          _id: null,
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
    ]);
    res.status(200).json({ status: 'success', data: stats });
  } catch (err) {
    res.status(400).json({ status: 'failed', message: 'no good' });
  }
};
