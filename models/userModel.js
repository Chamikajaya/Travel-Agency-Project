const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'A username must be specified']
    },

    email: {
        type: String,
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid email.']
    },

    photo: String,
    password: {
        type: String,
        required: [true, 'You must specify a password'],
        minlength: [6, 'Password length should at least be 6 char long']

    },

    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password']
    }

})

const User = mongoose.model('User', userSchema)

module.exports = User