const TourModel = require('../models/tourModel')
const APIFeatures = require('../utils/APIFeatures')


// * API aliasing --> These aliases are essentially shortcuts for more complex or commonly used queries. 
// @desc --> Get top 5 , highest rated, cheapest tours
// GET api / v1 / tours / top-5-rated-cheapest
const topFiveRatedAndCheapest = (req, res, next) => {

    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name, price,ratingsAverage,difficulty,summary'

    next()  // ! do not forget to call next() ☝️


}




// @desc --> create a tour
// POST / api / v1 / tours
const createTour = async (req, res) => {

    // we should write async /await functions inside a try/catch block

    try {
        // here create method returns a promise so we can use async await to handle it
        const newTour = await TourModel.create(req.body)

        res.status(201)
            .json({
                status: "Successful",
                message: "Tour created successfully"
            })

    } catch (error) {

        res.status(400).json({
            status: "Unsuccessful",
            msg: error.message
        })

    }
}









// @desc --> Get all tours 
// GET /api/v1/tours
const getAllTours = async (req, res) => {

    try {

        // creating an instance & chaining the methods
        const features = new APIFeatures(TourModel.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate()


        const tours = await features.query

        res.status(200)
            .json({
                status: "successful",
                totalTours: tours.length,
                allTours: tours
            })


    }


    catch (error) {

        res.status(404).json({
            status: "Unsuccessful",
            msg: error.message

        })

    }

}


// @desc --> Get one tour
// GET /api/v1/tours/:id
const getOneTour = async (req, res) => {

    try {

        const askedTour = await TourModel.findById(req.params.id)  // to access the parameters use req.params not req.body 😊

        res.status(200)
            .json({
                status: "successful",
                tour: askedTour
            })

    } catch (error) {

        res.status(404)
            .json({
                status: "Unsuccessful",
                errorMsg: error.message
            })

    }






}


// @desc --> Update a tour
// PATCH /api/v1/tours/:id

const updateTour = async (req, res) => {

    try {

        // findByIdAndUpdate --> refer mongoose docs
        const updatedTour = await TourModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: 'after', runValidators: true }
        )



        res.status(200)
            .json({
                status: "successfully updated",
                updatedTour: updatedTour

            })



    } catch (error) {

        res.status(404).json({
            status: "unsuccessful",
            errMsg: error.message
        })
    }

}


// @desc --> delete a tour 
// DELETE /api/v1/tours/:id
const deleteTour = async (req, res) => {

    try {

        await TourModel.findByIdAndDelete(req.params.id)

        res.status(204).json({ status: "successful deletion" })

    } catch (error) {

        res.status(404)
            .json({
                status: "unsuccessful",
                errMsg: error.message
            })
    }

}


module.exports = {
    getAllTours,
    getOneTour,
    updateTour,
    deleteTour,
    createTour,
    topFiveRatedAndCheapest
}

