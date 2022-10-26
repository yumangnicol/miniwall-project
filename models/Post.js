const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    text: {
        type: String, 
        required: true
    }, 
    created_date: {
        type: Date,
        default: Date.now
    }
})

const postSchema = mongoose.Schema({
    owner: {
        type: ObjectId
    },
    title: {
        type: String,
        required: true,
        max: 280
    },
    desciption: {
        type: String,
        required: true,
        max: 280
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    comments: {
        type: [commentSchema]
    }
})

module.exports = mongoose.model('posts', postSchema)