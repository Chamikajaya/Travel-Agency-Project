const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review can not be empty']

    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },

    // parent ref to the tour
    tour:
    {
        type: mongoose.Schema.ObjectId,
        ref: 'TourModel',
        required: [true, 'Review must belong to a tour']
    }
    ,

    // parent ref to the user
    user:
    {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user']
    }



}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


// query middleware to populate the tour and user fields
reviewSchema.pre(/^find/, function (next) {

    this.populate({
        path: 'user',
        select: 'name photo'  // select these fields only (no need to display the private fields like email, ...)
    })
        .populate({
            path: 'tour',
            select: 'name'
        })

    next()

})



const Review = mongoose.model('Review', reviewSchema)

module.exports = Review
