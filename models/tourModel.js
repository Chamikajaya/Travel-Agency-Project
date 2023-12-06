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

    rating: {
        type: Number,
        default: 0.0

    },

    difficulty: {
        type: String,
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Tour difficulty must be --> easy/ medium/ difficult '
        }


    }

})


// convention is to name the model as capitalized
const TourModel = mongoose.model('TourModel', tourSchema)

module.exports = TourModel
