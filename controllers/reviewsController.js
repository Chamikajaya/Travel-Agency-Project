const Review = require('../models/reviewModel');
// const AppError = require('../utils/appError')
const asyncWrapper = require('../utils/asyncWrapper')
const { deleteSingleDoc, updateSingleDoc, createSingleDoc } = require('../controllers/handlerFactory')


const getAllReviews = asyncWrapper(async (req, res) => {


    // if the tour id is not in the url params (nested route) we will get the tour id from the body of the request so that we can get all the reviews for that particular tour, otherwise we will get all the reviews for all the tours 

    let filter = {}

    if (req.params.tourId) {
        filter = { tour: req.params.tourId }
    }

    const allReviews = await Review.find(filter)

    res.status(200).json({
        status: "successful",
        totalReviews: allReviews.length,
        allReviews: allReviews
    })
})

// middleware function 👉
// due to the following code, we can create a review without specifying the tour id and user id in the body of the request 😊 

const setTourIdAndUserID = (req, res, next) => {


    // if the tour id is not in the body, then we will get it from the url params (nested route in tourRouter.js + reviewRouter.js)
    if (!req.body.tour) {
        req.body.tour = req.params.tourId
    }

    // we will call the protect middleware before this controller, so we will have access to req.user.id 
    if (!req.body.user) {
        req.body.user = req.user.id

    }

    next()
}


const createReview = createSingleDoc(Review)

const deleteReview = deleteSingleDoc(Review)

const updateReview = updateSingleDoc(Review)


module.exports = { getAllReviews, createReview, deleteReview, updateReview, setTourIdAndUserID }