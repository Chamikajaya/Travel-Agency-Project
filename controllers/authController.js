const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const signToken = (id) => {

    // * Avoid putting sensitive information in the JWT payload. Since JWTs are encoded and not encrypted, the information in the payload can be read by anyone who has the token. -->

    // payload, secret, exp date
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE })

    return token

}


const signUp = async (req, res) => {

    try {
        // creating the new user => bad way 
        /*
         If your User model has fields that shouldn't be directly set by the user (like user roles, permissions, or activation status), a malicious user could potentially send extra fields in the request body to set these values
        */

        // const newUser = await User.create(req.body)

        // By explicitly listing the fields, you prevent over-posting. Users can only affect the fields you've explicitly included
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,

        })

        const token = signToken(newUser._id)

        res.status(201).json({
            status: "successful",
            token: token,
            newUser: newUser

        })
    } catch (error) {
        res.status(400).json({
            status: "Unsuccessful",
            msg: error.message
        })

    }

}

const login = async (req, res, next) => {

    try {
        // read email & password from the req body
        const { email, password } = req.body

        // * 1) check whether both email and pass exist

        if (!email || !password) {

            // ! todo ==> need to create the APP error class 

            // return next(new AppError('Please provide both email and password', 400))

            // ! will change these later

            res.status(400).json({
                status: "error",
                message: "Please provide both email and password"
            })

            return

        }

        // * 2) check whether such user exists && given the correct password


        // * Since we have select: false in our user schema for the password field, Mongoose will not include the password field in the results by default. we need to explicitly select it using .select('+password'):
        const user = await User.findOne({ email: email }).select('+password')

        // we had to move the line below to the if statement coz if the user does not exist we d not be able to access user.password. But since we moved it to the if statement it will run only if the user exists. -->

        // const correct = await user.correctPassword(password, user.password)


        if (!user || !(await user.correctPassword(password, user.password))) {
            // ! todo :-> AppError class
            // return next(new AppError('Wrong username or password', 401))  // 401 is for unauthorized

            // ! will change these later

            res.status(401).json({
                status: "error",
                message: "Incorrect email or password"
            })

            return


        }




        // * 3) send the token to the client

        const token = signToken(user._id)
        res.status(200).json({
            status: 'success',
            token: token
        })

    } catch (error) {

        res.status(500).json({
            status: "Unsuccessful",
            msg: error.message
        })
    }
}


module.exports = { signUp, login } 