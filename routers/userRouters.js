const express = require('express')
const { getAllUsers,
    getOneUser,
    deleteUser,
    deleteAllUsers
} = require('../controllers/userController.js')
const { signup, login } = require('../controllers/authController.js')

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)

router.route('/').get(getAllUsers).delete(deleteAllUsers)

router.route('/:id').get(getOneUser).delete(deleteUser)



module.exports = router
