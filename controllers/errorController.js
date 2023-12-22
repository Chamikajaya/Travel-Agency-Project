const globalErrorHandler = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'  // this is needed here coz not all errors will be coming from our AppError class 


    res.status(err.statusCode).json({
        status: err.status,
        msg: err.message
    })
}

module.exports = globalErrorHandler