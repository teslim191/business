const mongoose = require('mongoose')
const {isEmail} = require('validator')
const bcrypt = require('bcryptjs')



const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'please enter email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'please enter password'],
        minlength: [6, 'password should not be lesser than 6']
    }
})
// mongoose hooks
// trigger a function that will fire when a user is added to te db
// UserSchema.post('save', (doc, next)=>{
//     console.log('new user created and saved', doc)
//     next()
// })

// hash a password before saving it to db . it is an asynchronous function
UserSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    console.log('new user created', this)
    next()
})

// create a styatic for login
UserSchema.statics.login = async function(email, password){
    // check if user email exist in the database
    const user = await this.findOne({email})
    // if user exists compare the password with the hashed password in the database
    if (user) {
        const auth = await bcrypt.compare(password, user.password)
        // check if password matches and return  the user
        if (auth) {
            return user
        }
        throw Error('password incorrect')
    }
    throw Error('incorrect email')

}






module.exports = mongoose.model('User', UserSchema)