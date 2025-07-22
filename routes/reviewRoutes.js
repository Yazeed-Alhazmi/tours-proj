const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');


const router = express.Router({ mergeParams:true }); // merge parameters for nested routes


router.route('/')
    .get(reviewController.getUserReviews)
    .post(authController.protect,
         authController.role('user', 'admin'),
          reviewController.createReview);


module.exports = router;