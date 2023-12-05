const express = require('express')
const {
    getAllUsers,
    getOneUser,
    deleteUser,
    createUser,
    updateUser } = require('./../controllers/userController')

const router = express.Router()




router.route('/')
    .get(getAllUsers)
    .post(createUser)


router.route('/:id')
    .get(getOneUser)
    .patch(updateUser)
    .delete(deleteUser)


module.exports = router
