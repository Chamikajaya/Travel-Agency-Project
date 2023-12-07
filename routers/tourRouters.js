const express = require('express')
const {
    getAllTours,
    getOneTour,
    updateTour,
    deleteTour,
    createTour,
    topFiveRatedAndCheapest
} = require("../controllers/tourController")

const router = express.Router()


// *  defining a middleware function that will be invoked when a route parameter named 'id' is present in the URL. This kind of middleware function can be useful for validation, logging, or loading additional data related to the route parameter.

router.param('id', (req, res, next, id) => {
    console.log('Tour id is is ' + id)
    next()
})


router.route('/top-5-rated-cheapest')
    .get(topFiveRatedAndCheapest, getAllTours)


router.route('/')
    .get(getAllTours)
    .post(createTour)


router.route('/:id')
    .get(getOneTour)
    .patch(updateTour)
    .delete(deleteTour)


module.exports = router