
const Tour = require('./../models/tourModel'); 
const AppError = require('../utils/appError');


// Retrieve all tours
exports.getAllTours = async (req, res) =>{
    try {

        // Query Build
        let matchQuery = {};

        if(req.query.name){
            matchQuery.name = req.query.name;
        };

        if(req.query.duration){
            matchQuery.duration = req.query.duration * 1; // To convert it to a Number
        };

        if(req.query.maxGroupSize){
            matchQuery.maxGroupSize = req.query.maxGroupSize * 1;
        };

        if(req.query.difficulty){
            matchQuery.difficulty = req.query.difficulty;
        };

        if(req.query.ratingsAverage){
            matchQuery.ratingsAverage = req.query.ratingsAverage * 1;
        };

        if(req.query.ratingsQuantity){
            matchQuery.ratingsQuantity = req.query.ratingsQuantity * 1;
        };

        if(req.query.price){
            matchQuery.price = req.query.price * 1;
        };

        if(req.query.summary){
            matchQuery.summary = req.query.summary;
        };

        if(req.query.description){
            matchQuery.description = req.query.description;
        };

        if(req.query.imageCover){
            matchQuery.imageCover = req.query.imageCover;
        };

        if(req.query.images){
            matchQuery.images = req.query.images;
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
        console.log(tours);
        
        
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
        // populate the 'reviews' virtual field, that has all the reviews of the this specific tour
        const tour = await Tour.findById(req.params.id).populate({
        path: 'reviews',
        select: 'name user rating'
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
        const newTour = await Tour.create(req.body);

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

        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status:"succsess",
            data: {
                tour
            }
        });
    }
    catch (err) {
        res.status(404).json({
            status:"failed",
            message: err
        });
    }
};

exports.deleteTour = async (req, res) => {
    try {

        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status:"succsess",
            data: null
        });
    }
    catch (err) {
        res.status(404).json({
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