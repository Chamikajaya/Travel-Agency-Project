const Review = require('../models/reviewModel');
const AppError = require('../utils/AppError')
const asyncWrapper = require('../utils/asyncWrapper')

const getAllReviews = asyncWrapper(async (req, res) => {

    const allReviews = await Review.find()

    res.status(200).json({
        status: "successful",
        totalReviews: allReviews.length,
        allReviews: allReviews
    })
})

const createReview = asyncWrapper(async (req, res) => {

    const newReview = await Review.create(req.body)

    res.status(201).json({
        status: "successful",
        newReview: newReview
    })
})


module.exports = { getAllReviews, createReview }