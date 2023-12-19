const User = require('../models/userModel')
const jwt = require('jsonwebtoken')


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

        // * Avoid putting sensitive information in the JWT payload. Since JWTs are encoded and not encrypted, the information in the payload can be read by anyone who has the token. -->

        // payload, secret, exp date
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE })


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




module.exports = { signUp }