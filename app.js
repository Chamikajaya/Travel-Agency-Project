const express = require('express');
const morgan = require('morgan');

const globalErrorHandler = require('./controllers/errorController')
const AppError = require('./utils/AppError')

const tourRouter = require('./routers/tourRouters')
const userRouter = require('./routers/userRouters')

const app = express();




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
app.use(express.static(`${__dirname}/public`))

// only log if we are in dev mode
if (process.env.NODE_ENV === 'development')
    app.use(morgan('dev'))




// mounting routers
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

// handle non-existing routes
app.use('*', (req, res, next) => {

    const err = new AppError(`Requested path ${req.originalUrl} does not exist !`, 404)

    next(err)

})

// use the global error handler
app.use(globalErrorHandler)


// ! make sure to export app to server.js 😡
module.exports = app


