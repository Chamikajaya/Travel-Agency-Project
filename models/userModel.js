const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    photo: {
        type: String,

    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [8, 'Password must be at least 8 characters'],
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm  your password'],

        // ! Following validator  will work only on CREATE & SAVE
        validate: {
            validator: function (el) {
                return el === this.password
            },
            message: 'Passwords do not match !'
        }


    },
}
)


// The 'save' hook is triggered just before a document is saved to the database.
userSchema.pre('save', async function (next) {

    // no need to rehash if the password has not been modified
    if (!this.isModified('password')) { return next() }

    this.password = await bcrypt.hash(this.password, 12)  // hashing returns a promise (so async/await)

    this.passwordConfirm = undefined; // no need to store this field in DB, as it was needed only for validation

    next()


})


const User = mongoose.model('User', userSchema)

module.exports = User