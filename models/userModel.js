const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

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
        minlength: [6, 'Password length should at least be 6 char long'],
        select: false  //  as we do not wanna send the password with response

    },

    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate:
        {
            validator: function (pass) {
                return this.password === pass  // will return true if both password & confirmPass (pass) matches
            },
            message: 'Passwords do not match '
        }
    }

})


// hash password before saving to the DB using pre save hook
userSchema.pre('save', async function (next) {

    // hash the password only if it has been modified, if not return 
    if (!this.isModified('password')) {
        return next()
    }
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined  // as we no longer need passConfirm field, delete it 
    next()

})


// "instance method" to check whether passwords matched upon login  => call this method using an instance not the model itself ⭐
userSchema.methods.checkPassword = async function (realPass, enteredPass) {
    return await bcrypt.compare(enteredPass, realPass)
}



const User = mongoose.model('User', userSchema)

module.exports = User