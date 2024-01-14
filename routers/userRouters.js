const express = require('express')
const { getAllUsers,
    getOneUser,
    updateMe,
    deleteMe,
    deleteUser,
    updateUser,
    getMe
} = require('../controllers/userController.js')
const { signup, login, forgotPassword, resetPassword, updatePassword, protect } = require('../controllers/authController.js')

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)

router.patch('/updatePassword', protect, updatePassword)  // since only the logged in users can update the password protect middleware should be used

router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:token', resetPassword)

router.get('/me', protect, getMe, getOneUser)
router.patch('/updateMe', protect, updateMe)
router.delete('/deleteMe', protect, deleteMe)


router.route('/').get(getAllUsers)

router.route('/:id')
    .get(getOneUser)
    .delete(deleteUser)
    .patch(updateUser)



module.exports = router
