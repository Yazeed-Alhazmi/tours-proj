const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({

    review: {
        type: String,
        required: [true, 'A review can not be empty']
    },
    rating: {
        type: Number,
        required: [true, 'A review must have a rating'],
        min:1,
        max: 5
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'A review must belong to a tour']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A review must belong to a user']
    }

},
{
    timestamps: true,
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
} 
);

// this is to populate the user when retrieving a review
reviewSchema.pre(/^find/, function(next){
    this.populate({
        path:'user',
        select:'name'
    });
    next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;