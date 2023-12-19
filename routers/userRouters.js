const express = require('express')
const {
    getAllUsers,
    getOneUser,
    deleteUser,
    createUser,
    updateUser } = require('./../controllers/userController')


const { signUp } = require('../controllers/authController')

const router = express.Router()

router.post('/signup', signUp)



router.route('/')
    .get(getAllUsers)
    .post(createUser)


router.route('/:id')
    .get(getOneUser)
    .patch(updateUser)
    .delete(deleteUser)


module.exports = router
