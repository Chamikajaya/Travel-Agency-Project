const fs = require('fs')
const TourModel = require('../models/tourModel')


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

        const allTours = await TourModel.find()

        res.status(200)
            .json({
                status: "successful",
                totalTours: allTours.length,
                allTours: allTours
            })

    } catch (error) {

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
    createTour
}

