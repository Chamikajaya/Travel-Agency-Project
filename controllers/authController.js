const User = require('../models/userModel')
const asyncWrapper = require('../utils/asyncWrapper')

// user sign up
const signup = asyncWrapper(async (req, res, next) => {

    const user = await User.create(req.body)

    res.status(201).json({
        status: "Successful",
        message: "User signup is successful",
        newUser: user
    })

})


module.exports = { signup }