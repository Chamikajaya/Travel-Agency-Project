const express = require('express');
const { getAllReviews, createReview } = require('../controllers/reviewsController');
const { protect, restrictTo } = require('../controllers/authController');


const router = express.Router({ mergeParams: true });  // mergeParams: true is needed to access the tourId in the nested route in tourRouters.js


// POST /tour/:tourId/reviews (nested route ⭐)
// POST /reviews
// GET /reviews 
router.route('/')
    .get(getAllReviews)
    .post(protect, restrictTo("user"), createReview)  // only logged in users who are not admin or lead-guide/guide  can create a review 😊 


module.exports = router