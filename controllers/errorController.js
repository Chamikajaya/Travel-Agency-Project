const sendErrorInDev = (res, err) => {
    // in dev, send detailed error reports
    res.status(err.statusCode).json({
        status: err.status,
        msg: err.message,
        error: err,
        stack: err.stack
    })
}

const sendErrorInProd = (res, err) => {

    // if the error is an operational error send the response below (trusted )
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            msg: err.message,
        })
    } else {

        // log the error to the hosting platform's console
        console.error('Error💀 -->' + err)

        // if it is not an operational error send a vague message + 500 
        res.status(500).json({
            status: err.status,
            msg: 'Something went wrong !'
        })

    }

}

const globalErrorHandler = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'  // this is needed here coz not all errors will be coming from our AppError class 

    // based on the env we want to send different kind of error msgs
    if (process.env.NODE_ENV === 'development') {
        sendErrorInDev(res, err)
    } else if (process.env.NODE_ENV === 'production') {
        sendErrorInProd(res, err)
    }




}

module.exports = globalErrorHandler