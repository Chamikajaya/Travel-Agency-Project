const express = require('express')
const { getAllUsers,
    getOneUser,
    deleteUser,
    deleteAllUsers
} = require('../controllers/userController.js')
const { signup, login, forgotPassword, resetPassword } = require('../controllers/authController.js')

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)

router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:token', resetPassword)


router.route('/').get(getAllUsers).delete(deleteAllUsers)

router.route('/:id').get(getOneUser).delete(deleteUser)



module.exports = router
