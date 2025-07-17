const Review = require('./../models/reviewModel');
const User = require('./../models/userModel');
const Tour = require('./../models/tourModel');
const mongoose = require('mongoose');


// this is for useres to write reviews on tours
exports.createReview = async (req, res, next) => {
    try {
        // adding the tour id to the request body
        if(!req.body.tour) {
            req.body.tour = req.params.tourId;
        }
        // adding the user id to the request body
        if(!req.body.user) {
            req.body.user = req.user.id;
        }

        const review = await Review.create(req.body);

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
exports.getAllReviews = async (req, res) => {
    try {
        let matchQuery = {};

        // retrieving all the reviews for a specific user from their name on the query
        if(req.query.userName){
            const user = await User.findOne({name:req.query.userName});
            matchQuery.user = user._id;
        };

        // retrieving all the reviews for a specific tour from it's id in the parameters
        if(req.params.tourId){
            matchQuery.tour = new mongoose.Types.ObjectId(req.params.tourId);
        }

        // retrieving all the reviews for a specific tour from it's name in the query
        if(req.query.tourName){
            const tourName = req.query.tourName.split('-').join(' ');
            const tour = await Tour.findOne({name:tourName});
            matchQuery.tour = tour._id;
        };


        pipline = [

                {
                    $match: matchQuery
                },



                {
                    $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: '_id',
                        as: 'author'
                    }
                    
                },

                {$unwind: '$author'},




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
                    $project: {review:1, rating:1, 'author.name':1,"tour.name":1, _id:0}
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