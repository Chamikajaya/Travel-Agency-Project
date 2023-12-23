const User = require('../models/userModel')
const asyncWrapper = require('../utils/asyncWrapper')
const AppError = require('../utils/AppError')

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

    res.status(200).json({
        status: "user deleted successfully ",
    })
})



module.exports = { getAllUsers, getOneUser, deleteUser }