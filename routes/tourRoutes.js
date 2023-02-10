const express = require('express');

const tourController = require(`${__dirname}/../controllers/tourController`);

const router = express.Router();

// middleware only within this sub-app
// router.param('id', tourController.checkID);

router
  .route('/top-3-expensive')
  .get(tourController.aliasTopExpensiveTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router
  .route('/')
  .get(tourController.getAllTours)
  //chaining middleware functions
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
