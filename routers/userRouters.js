const express = require('express')
const { getAllUsers,
    getOneUser,
    updateMe,
    deleteUser,
    deleteAllUsers
} = require('../controllers/userController.js')
const { signup, login, forgotPassword, resetPassword, updatePassword, protect } = require('../controllers/authController.js')

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)

router.patch('/updatePassword', protect, updatePassword)  // since only the logged in users can update the password protect middleware should be used

router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:token', resetPassword)

router.patch('/updateMe', protect, updateMe)


router.route('/').get(getAllUsers).delete(deleteAllUsers)

router.route('/:id').get(getOneUser).delete(deleteUser)



module.exports = router
