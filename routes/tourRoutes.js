const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./reviewRoutes');


const router = express.Router();

// Nested route to post reviews for a specific tour
router.use('/:tourId/reviews', reviewRouter);

// to get tours statistics
router.route('/tour-stats')
    .get(tourController.getTourStats);

// to get the year report 
router.route('/monthly-plan/:year')
    .get(tourController.getMonthlyPlan);


router.route('/')
    .get(tourController.getAllTours) // retrieve all the tours
    .post(tourController.createTour); // to add a new tour


router.route('/:id')
    .get(tourController.getTour) // to retrieve a specific tour
    .patch(tourController.updateTour) // to update a specific tour
    .delete(authController.protect, authController.role('admin', 'lead-guide'), tourController.deleteTour); // to delete a specific tour


module.exports = router;