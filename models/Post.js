const mongoose = require('mongoose')

const likeSchema = mongoose.Schema({
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
    },
    created_date: {
        type: Date,
        default: Date.now
    }
})

const commentSchema = mongoose.Schema({
    created_by: {
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
    likes_count: {
        type: Number,
        default: 0
    },
    likes: {
        type: [likeSchema]
    },
    comments: {
        type: [commentSchema]
    },
    created_date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('posts', postSchema)