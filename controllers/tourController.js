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

        // ! Removing unwanted fields

        // our query obj may have extra fields such as 'limit', 'sort',...So we should remove them from the query obj as follows

        // cloning the query obj
        let clonedQuery = { ...req.query }

        const excludedFields = ['page', 'sort', 'limit', 'fields']

        // removing the unnecessary fields from clonedObj  --> we should use [] instead of . because the dot notation requires the property name to be known
        excludedFields.forEach((field) => delete clonedQuery[field])


        // console.log(clonedQuery)

        // * What happens if we use "await" here (Direct execution)--> Since the query is executed immediately, you don’t have the opportunity to modify or add conditions to the query afterward. This approach is best when the query is fixed and doesn't require further refinement.

        // const allTours = await TourModel.find(clonedQuery)


        //  ** Delayed Execution --> This separation allows you to manipulate or refine the query further before executing it.

        // * Matching Client-Side and Server-Side Syntax:--> Typically, the query parameters sent from the client-side (like through a URL in a web application) are in a more readable or user-friendly format (e.g., lt, gt, lte, gte).  However, the server-side, which interacts with the database, must translate these into the syntax that the database understands. In this case, your code acts as a translator between the client-side representation and the MongoDB query syntax.

        // * for example consider URL ->  http://yourwebsite.com/api/tours?price[gt]=300&duration[lt]=10 . When this URL is accessed, your server receives an object like:-->

        /*
        {
        "price": {
            "gt": "300"
        },
        "duration": {
            "lt": "10"
        }
        */

        // * Your server-side code then needs to convert this into a format that MongoDB understands. The conversion process you implement in your code would translate price[gt] to price: {$gt: 300} and duration[lt] to duration: {$lt: 10} for the MongoDB query. //


        // ! gt|gte|lt|lte Feature

        // **************   HOW THIS IS DONE *****************  

        // convert the cloned query obj into a JSON string to run replace func
        let clonedString = JSON.stringify(clonedQuery)

        // run replace method + regEx
        clonedString = clonedString.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`)

        // parse the string into an obj
        const filters = JSON.parse(clonedString)

        // console.log(filters)

        let filteredTours = TourModel.find(filters)


        // ! SORTING Feature

        // check whether sort is given as a query
        if (req.query.sort) {

            // * In a URL, query parameters are typically delimited by commas for readability and URL encoding standards. For example, if a user wants to sort by price in ascending order and then by rating in descending order, they might send a request like this: "http://yourwebsite.com/api/tours?sort=price,-rating" 

            // * MongoDB Sort Method Format: MongoDB's sort method expects each field to be sorted by as a separate argument, and these arguments are typically separated by spaces in JavaScript. For instance, sorting by price in ascending order and rating in descending order would look like this in MongoDB query syntax: .sort('price -rating')

            // * So to do the matching we will do the following


            const sortConditions = req.query.sort.split(',').join(' ')  // convert the sort criteria to mongoDb format

            filteredTours = filteredTours.sort(sortConditions)  // actual sorting happens here


        } else {
            filteredTours = filteredTours.sort('-createdAt') // descending order -> newest first 

        }

        // ! FIELDS LIMITING Feature

        if (req.query.fields) {
            const fieldSet = req.query.fields.split(',').join(' ')
            filteredTours = filteredTours.select(fieldSet)


        } else {
            filteredTours = filteredTours.select('-__v')  // here __v is a mongoose related field, and we will not send it as a field by simply using minus sign(-)
        }

        //! PAGINATION Feature

        const page = parseInt(req.query.page) || 1  // default val is 1
        const limit = parseInt(req.query.limit) || 4  // default is set to 4 tours per pg
        const skip = (page - 1) * limit

        // counter the case where user enters a page number > existing pgs
        const totalDocs = await TourModel.countDocuments()
        const maxPgs = Math.ceil(totalDocs / limit)

        if (page > maxPgs) { throw new Error("Invalid page number. Page does not exist 😡") }

        // if everything is successful
        filteredTours = filteredTours.skip(skip).limit(limit)




        const tours = await filteredTours


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
    createTour
}

