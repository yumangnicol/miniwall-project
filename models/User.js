const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 256
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 256
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    created_date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('users', userSchema)