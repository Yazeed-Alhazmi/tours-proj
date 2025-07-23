const mongoose = require('mongoose');

const toursSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal 40 characters']
    },
    duration:{
        type:Number,
        required: [true, "A tour must have a duration"]
    },
    maxGroupSize: {
        type: Number,
        required: [true, "A tour must have a group size"]
    },
    difficulty: {
        type: String,
        required: [true, "A tour should have difficulty"],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: "Difficulty is either: easy, medium, difficult"
        }
    },
    price:{
        type: Number,
        required: [true, "A tour should have price"]
    },
    ratingsAverage:{
        type: Number,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity:{
        type: Number,
        default: 0,
    },
    priceDiscount:{
        type: Number
    },
    summary: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        required: [true, "A tour should have description"]
    },
    imageCover: {
        type: String,
        required: [true, "A tour should have a cover image"]
    },
    images: {
        type: [String]
    },
    startDates: {
        type: [Date]
    },
    startLocation: {
        type:{
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    // Embedded location documents
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point'],
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        {type: mongoose.Schema.ObjectId,
        ref: 'User'
        }
    ]
},{
    timestamps: true,
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
});

// A virtual field to load the reviews on each tour document
toursSchema.virtual('reviews', {
    ref:'Review',
    foreignField: 'tour',
    localField: '_id'
});


const Tour = mongoose.model('Tour', toursSchema, 'tours');

module.exports = Tour;