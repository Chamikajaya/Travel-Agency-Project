const User = require('../models/userModel')


const getAllUsers = async (req, res) => {

    try {

        const users = await User.find()

        res.status(200).json({
            status: "success",
            totUsers: users.length,
            data: users
        })
    } catch (error) {

        res.status(404)
            .json({
                status: "failed",
                message: error.message
            })

    }


}



const getOneUser = (req, res) => {

    res.status(500)
        .json({
            status: "failed",
            message: "User routes are yet to implement."
        })
}
const createUser = (req, res) => {

    res.status(500)
        .json({
            status: "failed",
            message: "User routes are yet to implement."
        })
}
const updateUser = (req, res) => {

    res.status(500)
        .json({
            status: "failed",
            message: "User routes are yet to implement."
        })
}
const deleteUser = async (req, res) => {

    try {

        await User.findByIdAndDelete(req.params.id)

        res.status(204).json({ status: "successful deletion" })

    } catch (error) {

        res.status(404)
            .json({
                status: "failed",
                message: error.message
            })

    }
}


module.exports = {
    getAllUsers,
    getOneUser,
    deleteUser,
    createUser,
    updateUser
}