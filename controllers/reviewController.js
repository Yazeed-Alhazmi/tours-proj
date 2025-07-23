const Review = require('./../models/reviewModel');
const User = require('./../models/userModel');
const Tour = require('./../models/tourModel');
const mongoose = require('mongoose');


// this is for useres to write reviews on tours
exports.createReview = async (req, res, next) => {
    try {
        const body = {}

        if(req.body.review){
            body.review = req.body.review;
        }

        if(req.body.rating){
            body.rating = req.body.rating;
        }

        body.tour = req.params.tourId;
        
        body.user = req.user.id;

        const review = await Review.create(body);

        res.status(201).json({
            status: 'success',
            data: {
                review
            }
        });
    }
    catch (err) {
        res.status(500).json({
            status:"failed",
            message: err
        });
    }
};


// to retrieve all the reviews with the user name (author) and the tour name
exports.getUserReviews = async (req, res) => {
    try {

       const userID = {}
       console.log("I'm inn get user reviews");
       userID.user = req.user._id;
       


        pipline = [

                {
                    $match: userID
                },
                {
                    $lookup: {
                        from: 'tours',
                        localField: 'tour',
                        foreignField: '_id',
                        as: 'tour'
                    }
                    
                },
                {$unwind: '$tour'},
                {
                    $project: {review:1, rating:1, "tour.name":1, _id:0}
                }];

        const reviews = await Review.aggregate(pipline);


        res.status(200).json({
        status: 'success',
        data: {
            reviews
        }
        });
    }
    catch (err) {
        res.status(500).json({
            status:"failed",
            message: err
        });
    }

};