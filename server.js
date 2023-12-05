const fs = require('fs')
const express = require('express');
const morgan = require('morgan')
const app = express();
const port = process.env.PORT || 3000;


// define the variable, otherwise when we are outside the scope of try/catch block (file read), we won't be able to access it.
let tours;

const filePath = `${__dirname}/dev-data/data/tours-simple.json`

try {
    // read the file in a synchronous way 
    const data = fs.readFileSync(filePath, 'utf8')
    tours = JSON.parse(data)  // * to convert the JSON data into a JavaScript object.


} catch (error) {
    console.log('Error occurred while reading the file -> ' + error)
    process.exit(1)
}

// creating a middleware to get the time when the request made --> "morgan" can be used 🙀

/*
const getReqTime = (req, res, next) => {

    const reqTime = new Date().toISOString()
    console.log(`${req.method} to ${req.url} at ${reqTime}`)
    next()  // ! do not forget to call next(), otherwise response will be left hanging
}

app.use(getReqTime)

*/

// * MIDDLEWARES * \\ 

// * The express.json() middleware function acts as a parser. It takes the raw request body and transforms it into a format that's easier to work with (in this case, JSON). After the middleware processes the request body, you can access the JSON data sent with the request using req.body in your route handlers. ==>


app.use(express.json());

app.use(morgan('dev'))






// @desc --> Get all tours

const getAllTours = (req, res) => {
    res.status(200)
        .json({
            status: "Success",
            results: tours.length,
            data: tours
        })
}

// @desc --> Get one tour

const getOneTour = (req, res) => {

    // convert string to num
    const tourId = parseInt(req.params.id)

    // return early if tourId is invalid -->
    if (isNaN(tourId) || tourId < 0) {
        return res.status(404)
            .json({
                status: "unsuccessful",
                message: "invalid tourId provided !"
            })
    }



    // find the tour from array
    const askedTourIdx = tours.findIndex(item => item.id === tourId)

    // such tour with the provided ID no longer exists ! ==>
    if (askedTourIdx === -1) {
        return res.status(404)
            .json({
                status: "unsuccessful",
                message: "No tour with the provided ID exists. !"
            })
    }


    // success
    res.status(200)
        .json({
            status: "successful",
            tour: tours[askedTourIdx]
        })

}



// @desc --> Update a tour

const updateTour = (req, res) => {

    // convert string to num
    const tourId = parseInt(req.params.id)

    // return early if tourId is invalid -->
    if (isNaN(tourId) || tourId < 0) {
        return res.status(404)
            .json({
                status: "unsuccessful",
                message: "invalid tourId provided !"
            })
    }



    // find the tour from array
    const askedTourIdx = tours.findIndex(item => item.id === tourId)

    // such tour with the provided ID no longer exists ! ==>
    if (askedTourIdx === -1) {
        return res.status(404)
            .json({
                status: "unsuccessful",
                message: "No tour with the provided ID exists. !"
            })
    }

    const updatedTour = { ...tours[askedTourIdx], ...req.body, }

    // how the above line works -> If there are any properties in req.body that also exist in the tour object (tours[askedTourIdx]), their values will be overwritten in the updatedTour object with the values from req.body.

    tours[askedTourIdx] = updatedTour

    fs.writeFile(filePath, JSON.stringify(tours), () => {
        res.status(200)
            .json({
                status: "successful",
                tour: updatedTour
            })
    })

}

// @desc --> Create a tour 

const createTour = (req, res) => {

    const newTourId = tours.length + 1
    const newTour = { id: newTourId, ...req.body }
    tours.push(newTour)


    fs.writeFile(filePath, JSON.stringify(tours), (error) => {

        // ! make sure to stringify tours object :)

        if (error) {

            res.status(500)
                .json({
                    status: "Success",
                    message: "Error while saving the new tour to the data file !"
                })
        }
        else {

            res.status(201)  // 201 is for successful creation
                .json({
                    status: "Created successfully ",
                    newTour: newTour
                })
        }
    })





}


// @desc --> Delete a tour 


const deleteTour = (req, res) => {

    // convert string to num
    const tourId = parseInt(req.params.id)

    // return early if tourId is invalid -->
    if (isNaN(tourId) || tourId < 0) {
        return res.status(404)
            .json({
                status: "unsuccessful",
                message: "invalid tourId provided !"
            })
    }



    // find the tour from array
    const askedTourIdx = tours.findIndex(item => item.id === tourId)

    // such tour with the provided ID no longer exists ! ==>
    if (askedTourIdx === -1) {
        return res.status(404)
            .json({
                status: "unsuccessful",
                message: "No tour with the provided ID exists. !"
            })
    }

    // success
    tours.splice(askedTourIdx, 1)  // delete the tour

    fs.writeFile(filePath, JSON.stringify(tours), () => {

        res.status(204)  // 204 is for no content
            .send()
    })




}


// Routes
app.route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour)


app.route('/api/v1/tours/:id')
    .get(getOneTour)
    .patch(updateTour)
    .delete(deleteTour)



app.listen(port, () => {
    console.log(`Server listening on port ${port}...`)
})