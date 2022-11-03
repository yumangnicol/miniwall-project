const express = require('express')
const router = express.Router({mergeParams:true})

const Post = require('../models/Post')
const {commentValidation} = require('../validations/validation')
const verifyToken = require('../verifyToken')

router.post('/', verifyToken, async(req,res)=>{

    // Validation 1: Check User input
    const {error} = commentValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

    // Saves a new Comment into inside a Post
    try {
        const pushCommentToPost = await Post.findById(req.params.postId)
        pushCommentToPost.comments.push({
            text: req.body.text
        })        
        const savedComment = await pushCommentToPost.save()
        res.send(pushCommentToPost)  
    } catch (error) {
        res.status(400).send({message:error})
    }
})

module.exports = router