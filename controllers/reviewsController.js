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


    // due to the following code, we can create a review without specifying the tour id and user id in the body of the request 😊 


    // if the tour id is not in the body, then we will get it from the url params (nested route in tourRouter.js + reviewRouter.js)
    if (!req.body.tour) {
        req.body.tour = req.params.tourId
    }

    // we will call the protect middleware before this controller, so we will have access to req.user.id 
    if (!req.body.user) {
        req.body.user = req.user.id

    }

    const newReview = await Review.create(req.body)

    res.status(201).json({
        status: "successful",
        newReview: newReview
    })
})


module.exports = { getAllReviews, createReview }