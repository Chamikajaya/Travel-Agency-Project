const express = require('express');
const { getAllReviews, createReview, deleteReview } = require('../controllers/reviewsController');
const { protect, restrictTo } = require('../controllers/authController');


const router = express.Router({ mergeParams: true });  // mergeParams: true is needed to access the tourId in the nested route in tourRouters.js


// POST /tour/:tourId/reviews (nested route ⭐)
// GET /tour/:tourId/reviews (nested route ⭐)  (get all the reviews for a particular tour)
// POST /reviews
// GET /reviews 
router.route('/')
    .get(getAllReviews)
    .post(protect, restrictTo("user"), createReview)  // only logged in users who are not admin or lead-guide/guide  can create a review 😊 

router.route('/:id')
    .delete(deleteReview)

module.exports = router