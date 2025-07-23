
const Tour = require('./../models/tourModel'); 
const AppError = require('../utils/appError');


// Retrieve all tours
exports.getAllTours = async (req, res) =>{
    try {

        // Query Build
        let matchQuery = {};

        if(req.query.duration){
            matchQuery.duration = req.query.duration * 1; // To convert it to a Number
        };

        if(req.query.maxGroupSize){
            matchQuery.maxGroupSize = req.query.maxGroupSize * 1;
        };

        if(req.query.difficulty){
            matchQuery.difficulty = req.query.difficulty;
        };

        if(req.query.minRating){
        
            matchQuery.ratingsAverage= {$gte: req.query.minRating*1};
        };

        if(req.query.minPrice || req.query.maxPrice){

            matchQuery.price = {};
            
            if(req.query.minPrice){
            matchQuery.price.$gte = req.query.minPrice*1;
            }
            if(req.query.maxPrice){
            matchQuery.price.$lte = req.query.maxPrice*1;
            }
        };

        if(req.query.startDates){
            matchQuery.startDates = req.query.startDates;
        };


        // For Pagination (By default each page has 2 documents)
        let {page, pageSize} = req.query;
        page = parseInt(page, 10) || 1;
        pageSize = parseInt(pageSize, 10) || 2;
        
        // Aggregation pipeline
        pipline = [

            {
                $match: matchQuery
            },

            {
                // To retrieve the Tour Guide name from the id
                $lookup: {
                    from: 'users',
                    localField: 'guides',
                    foreignField: '_id',
                    as: 'guidesInfo'
                }
            },


            {
                $project: {name:1, ratingsAverage:1, price:1, difficulty:1, guides:1, guidesInfo:1, _id:0}
            },


            {
                // Pagination
                $facet: {
                        metadata: [{ $count: 'totalCount' }],
                        data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
                        }
            }

        ]

        // Aggregation
        const tours = await Tour.aggregate(pipline);
        
        
        res.status(200).json({
            status:"succsess",
            data: tours
        });
    }

    catch (err) {
        res.status(500).json({
            status:"failed",
            message: err
        });
    }
};


// To get a specific tour using it's id as a parameter
exports.getTour = async (req, res, next) =>{
    try {

        const tourID = req.params.id;

        // populate the 'reviews' virtual field, that has all the reviews of the this specific tour
        const tour = await Tour.findById(tourID).populate({
        path: 'reviews',
        select: 'review rating user'
    });

        if(!tour){
            return next(new AppError('no tour found with that ID', 404));
        }


        res.status(200).json({
            status:"succsess",
            data: {
                tour
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


// To add a new tour
exports.createTour = async (req, res) =>{
    try {
        const body = {};

        if(req.body.name){
            body.name = req.body.name;
        }
        
        if(req.body.duration){
            body.duration = req.body.duration;
        }

        if(req.body.maxGroupSize){
            body.maxGroupSize = req.body.maxGroupSize;
        }

        if(req.body.difficulty){
            body.difficulty = req.body.difficulty;
        }

        if(req.body.price){
            body.price = req.body.price;
        }

        if(req.body.summary){
            body.summary = req.body.summary;
        }

        if(req.body.imageCover){
            body.imageCover = req.body.imageCover;
        }

        if(req.body.images){
            body.images = req.body.images;
        }

        if(req.body.startDates){
            body.startDates = req.body.startDates;
        }

        if(req.body.description){
            body.description = req.body.description;
        }

        const newTour = await Tour.create(body);

        res.status(201).json({
            status: "success",
            data: {tour: newTour}
        });
    }
    catch (err) {
        res.status(500).json({
            status:"failed",
            message: err
        });
    }
};

// Update an existing tour
exports.updateTour = async (req, res) => {
    try {

        const tourID = req.params.id;

        const body = {};

         if(req.body.name){
            body.name = req.body.name;
        }
        
        if(req.body.duration){
            body.duration = req.body.duration;
        }

        if(req.body.maxGroupSize){
            body.maxGroupSize = req.body.maxGroupSize;
        }

        if(req.body.difficulty){
            body.difficulty = req.body.difficulty;
        }

        if(req.body.price){
            body.price = req.body.price;
        }

        if(req.body.summary){
            body.summary = req.body.summary;
        }

        if(req.body.imageCover){
            body.imageCover = req.body.imageCover;
        }

        if(req.body.images){
            body.images = req.body.images;
        }

        if(req.body.startDates){
            body.startDates = req.body.startDates;
        }

        if(req.body.description){
            body.description = req.body.description;
        }  

        const tour = await Tour.findByIdAndUpdate(tourID, body, {
            new: true
        });

        res.status(200).json({
            status:"succsess",
            data: {
                tour
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

exports.deleteTour = async (req, res) => {
    try {

        const tourID = req.params.id;

        await Tour.findByIdAndDelete(tourID);

        res.status(204).json({
            status:"succsess",
            data: null
        });
    }
    catch (err) {
        res.status(500).json({
            status:"failed",
            message: err
        });
    }
};

// to get tours statistics based on difficulty
exports.getTourStats = async (req, res) => {
    try{

        const stats = await Tour.aggregate([

            {
                $group: {
                    _id: '$difficulty',
                    numTours: {$sum: 1},
                    numRatings: {$sum:'$ratingsQuantity'},
                    avgRateing: {$avg:'$ratingsAverage'},
                    avgPrice: {$avg:'$price'},
                    minPrice: {$min:'$price'},
                    maxPrice: {$max:'$price'},

                }
            },

            {
                $sort: {avgPrice: 1}
            }

        ]);

        res.status(200).json({
            status:"succsess",
            data: stats
        });

    }
    catch (err){
        res.status(500).json({
            status:"failed",
            message: err
        });
    }
};


// To get the year report
exports.getMonthlyPlan = async (req, res) => {
    try {

        const year = req.params.year * 1;

        const plan = await Tour.aggregate([

            {
                $unwind: '$startDates'
            },

            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },

            {
                $group: {
                    _id: {$month:'$startDates'},
                    numToursStarts: {$sum:1},
                    tours: {$push:'$name'}

                }
            },

            {
                $addFields: {month: '$_id'}
            },

            {
                $project: {
                    _id:0
                }
            },

            {
                $sort: {numToursStarts: -1}
            }

        ]);

        res.status(200).json({
            status:"succsess",
            data: {
                plan
            }
        });

    }
    catch (err){
        res.status(500).json({
            status:"failed",
            message: err
        });
    }
};