const mongoose = require('mongoose')


// Schema --> define the structure of the data
// Model --> a wrapper for the schema, provides an interface to the database for CRUD operations




const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'A name must be provided for the tour.'],
        minlength: [3, 'Tour name must have at least 5 characters'],
        maxlength: [30, 'Tour name must have a max of  30 characters']
    },

    price: {
        type: Number,
        required: [true, 'A tour must have a price.'],
        min: [0, 'Price must be >= 0']

    },

    ratingsAverage: {
        type: Number,
        default: 0

    },

    ratingsQuantity: {
        type: Number,
        default: 0
    },

    difficulty: {
        type: String,
        required: [true, 'Difficulty must be given'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Tour difficulty must be --> easy/ medium/ difficult '
        }
    },

    duration: {
        type: Number,
        required: [true, 'A tour must have a duration'],
        min: [1, 'Tour must be at least 1 day long'],
        max: [30, 'Max duration is 30 days']
    },

    maxGroupSize: {
        type: Number,
        required: [true, 'Group size must be mentioned']

    },

    priceDiscount: Number,

    summary: {
        type: String,
        required: [true, 'A summary must be given about the tour'],
        trim: true,

    },

    description: {
        type: String,
        minlength: [20, 'description length >= 20 char']

    },

    imageCover: {
        type: String, // we will store the path to the image in the db, not the image itself
        required: [true, 'Must have a cover image']
    },

    images: [String],

    createdAt: {
        type: Date,
        default: Date.now(),
        select: false  // since select is false we will never send createdAt field as response (security reasons,... 🙀)
    },

    startDates: [Date]


},
    { toJSON: { virtuals: true } })  //  if you pass a document to Express' res.json() function, virtuals will not be included by default. include virtuals in res.json(), you need to set the toJSON schema option to { virtuals: true }


// * virtual props ==>  a virtual is a property that is not stored in MongoDB. Virtuals are typically used for computed properties on documents. Also help us separate app and business logic  


// here we need to use "this" keyword, so we must use traditional function 
tourSchema.virtual('formattedDuration').get(function () {


    const weeks = Math.floor(this.duration / 7)

    const days = this.duration % 7

    return `${weeks} weeks ${days} days`

})


// convention is to name the model as capitalized
const TourModel = mongoose.model('TourModel', tourSchema)

module.exports = TourModel
