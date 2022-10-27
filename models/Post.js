const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
    },
    text: {
        type: String, 
        required: true,
        min: 1
    }, 
    created_date: {
        type: Date,
        default: Date.now
    }
})

const postSchema = mongoose.Schema({
    created_by: {
        type: mongoose.Schema.Types.ObjectId
    },
    title: {
        type: String,
        required: true,
        min: 1,
        max: 280
    },
    description: {
        type: String,
        required: true,
        min: 1,
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