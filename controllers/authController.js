const User = require('../models/userModel')
const asyncWrapper = require('../utils/asyncWrapper')
const jwt = require('jsonwebtoken')
const AppError = require('../utils/AppError')

const generateToken = (id) => {
    // sign the user a token upon sign up -> payload | secret | exp time
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })

    return token;
}

// user sign up
const signup = asyncWrapper(async (req, res, next) => {

    // for security reasons do not directly accept req.body, instead do it like below
    const { name, email, password, passwordConfirm } = req.body
    const user = await User.create({ name, email, password, passwordConfirm })

    const token = generateToken(user._id)

    res.status(201).json({
        status: "Successful",
        message: "User signup is successful",
        token: token,  // send the token to the user  
        newUser: user
    })

})

// login 
const login = asyncWrapper(async (req, res, next) => {

    // read email and password
    const { email, password } = req.body

    // * 1) check if user has provided both email & password
    if (!email || !password) {
        return next(new AppError('Please provide both email & password', 400))
    }

    // * 2) check if user exists and whether he has given the correct password

    const user = await User.findOne({ email: email }).select('+password')  // should explicitly select the password as in our userSchema we set select password as false

    // since checkPassword is an instance method it should be called using user instance not User model
    if (!user || !(await user.checkPassword(user.password, password))) {
        return next(new AppError('Username or password does not match. Provide correct credentials', 401))  // 401 means unauthorized

    }

    // * 3) if above conditions are met send the token

    const token = generateToken(user._id)

    res.status(200).json({
        status: "Successful",
        message: "User login is successful",
        token: token,  // send the token to the user
    })

})



module.exports = { signup, login }