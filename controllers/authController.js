const { promisify } = require('util')
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
    const { name, email, password, passwordConfirm, role, passwordChangedAt } = req.body  // ! remove the last prop later (passwordChangedAt), once update user route is implemented
    const user = await User.create({ name, email, password, passwordConfirm, role, passwordChangedAt })          // ! remove the last prop later, once update user route is implemented


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

// protect the sensitive routes 
const protect = asyncWrapper(async (req, res, next) => {

    // 1) check whether the token exists
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]  // grab the token
    }

    if (!token) {
        return next(new AppError('Please login to continue.', 401))
    }

    // 2) verify the token -> to check whether the token has been tampered with
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)  // decoded obj will contain userId, iat and exp

    // console.log(decoded)

    // 3) check if user still exists (because user might have deleted his account after receiving his token )
    const matchingUser = await User.findById(decoded.id)

    if (!matchingUser) {
        return next(new AppError('User with the matching token no longer exists', 401))
    }

    // 4) check if the user has changed his password after the token issue (this will be done using the instance method defined in User schema)
    const isChanged = matchingUser.isPassChangedAfterTokenIssue(decoded.iat)
    if (isChanged) {
        return next(new AppError('User password was changed recently, after the issue of the current token ', 401))
    }

    req.user = matchingUser  //  to attach the authenticated user object to the request object. This allows downstream middleware (such as authorization )or route handlers to access information about the authenticated user.

    next()  // if all the above conditions are met, give access to the protected path😃

})


// authorization
/*
It takes a variable number of roles as arguments (using the spread operator ...roles) and returns a middleware function.
while we  can't directly pass arguments to middleware in Express, we can achieve a similar effect by using higher-order functions, like the one below 
*/
const restrictTo = (...roles) => {

    // no need to wrap this using asyncWrapper as this is not a async func

    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have enough permission to perform this action', 403))  // 403 is for forbidden
        }
        next()
    }
}


module.exports = { signup, login, protect, restrictTo }