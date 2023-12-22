const TourModel = require('../models/tourModel')
const APIFeatures = require('../utils/APIFeatures')

const AppError = require('../utils/AppError')

const asyncWrapper = require('../utils/asyncWrapper')


// @desc --> create a tour
// POST / api / v1 / tours
const createTour = asyncWrapper(async (req, res) => {

    // here create method returns a promise so we can use async await to handle it
    const newTour = await TourModel.create(req.body)

    res.status(201)
        .json({
            status: "Successful",
            message: "Tour created successfully"
        })

})


// @desc --> Get all tours 
// GET /api/v1/tours
const getAllTours = asyncWrapper(async (req, res) => {

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
)

// @desc --> Get one tour
// GET /api/v1/tours/:id
const getOneTour = asyncWrapper(async (req, res, next) => {

    const askedTour = await TourModel.findById(req.params.id)  // to access the parameters use req.params not req.body 😊


    // when user gives proper id, but a tour corresponding to that id does not exist (this is not CAST ERROR)
    if (!askedTour) {
        return next(new AppError('Requested tour not found', 404))
    }

    res.status(200)
        .json({
            status: "successful",
            tour: askedTour
        })

})


// @desc --> Update a tour
// PATCH /api/v1/tours/:id
const updateTour = asyncWrapper(async (req, res) => {

    // findByIdAndUpdate --> refer mongoose docs
    const updatedTour = await TourModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { returnDocument: 'after', runValidators: true }
    )

    if (!updatedTour) {
        return next(new AppError('Requested tour not found', 404))
    }
    res.status(200)
        .json({
            status: "successfully updated",
            updatedTour: updatedTour

        })

})


// @desc --> delete a tour 
// DELETE /api/v1/tours/:id
const deleteTour = asyncWrapper(async (req, res) => {

    const tour = await TourModel.findByIdAndDelete(req.params.id)

    if (!tour) {
        return next(new AppError('Requested tour not found', 404))
    }

    res.status(204).json({ status: "successful deletion" })
})



const getToursStats = asyncWrapper(async (req, res) => {


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
})

// @desc --> Get how many tours starting on each month and what they are
const getMonthlyPlan = asyncWrapper(async (req, res) => {


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

})




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

