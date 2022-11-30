const mongoose = require('mongoose')

const likeSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

const commentSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    text: {
        type: String, 
        required: true,
        min: 1,
        max: 280
    }, 
    created_at: {
        type: Date,
        default: Date.now
    }
})

const postSchema = mongoose.Schema({
    user_id: {
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
    created_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('posts', postSchema)