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
        select: false,
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

    // this property is regarding AUTH - to check whether the user has changed his password 
    passwordChangedAt: Date
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


// checking the hashed password and the provided password upon login is correct using instance method ( an instance method is a method that you define on a Mongoose schema and which becomes available on each document (instance) created using that schema)

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {

    return await bcrypt.compare(candidatePassword, userPassword)  // returns a boolean
}


userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {

    // do the checking only if "passwordChangedAt" property exists
    if (this.passwordChangedAt) {

        // convert Date into TimeStamp (coz initially this is in Date format, but token issue is in seconds format ,)
        const passChangedTimeStamp = this.passwordChangedAt.getTime() / 1000 // divide by 1000 to make ms into seconds

        // console.log(passChangedTimeStamp, JWTTimeStamp)

        return passChangedTimeStamp > JWTTimeStamp  // if this is true, that means user has changed his password after issuing the token
    }


    // this means that the user has never changed the password (passwordChangedAt does not exist)
    return false;


}



const User = mongoose.model('User', userSchema)

module.exports = User