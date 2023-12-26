const User = require('../models/userModel')
const asyncWrapper = require('../utils/asyncWrapper')
const AppError = require('../utils/AppError')

// function to get the filtered object when user updates data
const getFilteredBodyObj = (bodyObj, ...updatableFields) => {  // as second parameter to this function we used spread operator, this way we can entry as many args and they will be placed inside an array
    const newObj = {}
    Object.keys(bodyObj).forEach((it) => {
        if (updatableFields.includes(it)) {
            newObj[it] = bodyObj[it]
        }
    })
    return newObj;
}

const getAllUsers = asyncWrapper(async (req, res) => {

    const allUsers = await User.find()

    res.status(200).json({
        status: "successful",
        totalUsers: allUsers.length,
        allUsers: allUsers
    })


})

const getOneUser = asyncWrapper(async (req, res, next) => {

    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new AppError('Requested user not found', 404))
    }

    res.status(200).json({
        status: "successful",
        user: user
    })
})

const deleteUser = asyncWrapper(async (req, res, next) => {

    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
        return next(new AppError('Requested user not found', 404))
    }

    res.status(204).send()
})


const updateMe = asyncWrapper(async (req, res, next) => {

    // we will not let the user update his password via this route
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('You can not use this route to update password. Please use changePassword route for password update', 400))
    }


    // A malicious user may try to change his role (say to 'admin'). So we should filter the request object to accept only the relevant ones
    const filteredBody = getFilteredBodyObj(req.body, 'name', 'email')

    const user = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true })  //  since we are not dealing with sensitive data like passwords we do not have to run the pre save hooks we implemented in User schema. So we can use findByIdAndUpdate , rather than "save" 



    res.status(200).json({
        status: "success",
        updated: user
    })
})




// ! for convenience I made this while dev, will be deleted later
const deleteAllUsers = asyncWrapper(async (req, res, next) => {
    await User.deleteMany()

    res.status(204).send()
})


module.exports = { getAllUsers, getOneUser, deleteUser, deleteAllUsers, updateMe }