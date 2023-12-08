const TourModel = require('../models/tourModel')
const APIFeatures = require('../utils/APIFeatures')




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

const getToursStats = async (req, res) => {

    try {

        // ! Refer MongoDB docs on aggregate pipelines (just like group by in SQL 💀)


        // In aggregate we ll pass an array , and that array will contain various pipeline stages such as $match , $group, $sort 
        const stats = await TourModel.aggregate([
            {
                $group: {
                    _id: "$difficulty",  // each doc can be identified by "difficulty" 
                    totalTours: { $sum: 1 },
                    numRatings: { $sum: "$ratingsQuantity" },
                    avgRating: { $avg: "$ratingsAverage" },
                    avgPrice: { $avg: "$price" },
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" }


                },

            }
        ])

        res.status(200)
            .json({
                status: "successful",
                stat: stats
            })



    } catch (error) {

        res.status(404)
            .json({
                status: "Unsuccessful",
                errorMsg: error.message
            })

    }
}

// @desc --> Get how many tours starting on each month and what they are
const getMonthlyPlan = async (req, res) => {

    // 

    try {

        const planYear = parseInt(req.params.year)

        const plan = await TourModel.aggregate([

            //  * unwind --> deconstructing an array field from input documents to output a document for each element. 

            { $unwind: "$startDates" },

            {
                // match the tours with the given year in the URL
                $match: {
                    startDates: {
                        $lte: new Date(`${planYear}-12-31`),
                        $gte: new Date(`${planYear}-01-01`)
                    }

                }
            },

            {
                $group: {
                    _id: { $month: "$startDates" }, //  extracts the month part from each startDates field and groups the data by this month.

                    numOfTourStarts: { $sum: 1 },
                    tours: { $push: "$name" }  // to push tour names to the array "tours"

                }
            },

            {
                $addFields: { month: "$_id" }
            },

            {
                $project: {
                    _id: 0  // exclude _id field from the response
                }
            },

            {
                // sort in descending order so that largest num of tour start month is at first
                $sort: { numOfTourStarts: -1 }

            }


        ])


        res.status(200)
            .json({
                status: "successful",
                plan: plan
            })


    } catch (error) {

        res.status(404)
            .json({
                status: "Unsuccessful",
                errorMsg: error.message
            })
    }








}






// * API aliasing --> These aliases are essentially shortcuts for more complex or commonly used queries. 
// @desc --> Get top 5 , highest rated, cheapest tours  (Middleware)
// GET api / v1 / tours / top-5-rated-cheapest
const topFiveRatedAndCheapest = (req, res, next) => {

    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name, price,ratingsAverage,difficulty,summary'

    next()  // ! do not forget to call next() ☝️


}






module.exports = {
    getAllTours,
    getOneTour,
    updateTour,
    deleteTour,
    createTour,
    topFiveRatedAndCheapest,
    getToursStats,
    getMonthlyPlan
}

