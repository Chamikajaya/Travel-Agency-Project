const express = require('express')
const {
    getAllTours,
    getOneTour,
    updateTour,
    deleteTour,
    createTour,
    idValidator,
    bodyValidator
} = require('./../controllers/tourController')

const router = express.Router()


// *  defining a middleware function that will be invoked when a route parameter named 'id' is present in the URL. This kind of middleware function can be useful for validation, logging, or loading additional data related to the route parameter.

router.param('id', (req, res, next, id) => {
    console.log('Tour id is is ' + id)
    next()
})

// the following is run if the route has id parameter, it will run the idValidator function. We could have used the middleware function directly in the route, but we are using the router.param() method to make the code more modular and reusable. (rather than repeating the same code in each route)

// ! if we have a dynamic route try to use router.param method as it helps to maintain DRY principle   ==>

router.param('id', idValidator)

router.route('/')
    .get(getAllTours)
    .post(bodyValidator, createTour)


router.route('/:id')
    .get(getOneTour)
    .patch(updateTour)
    .delete(deleteTour)


module.exports = router