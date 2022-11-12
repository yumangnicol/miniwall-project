const express = require('express')
const router = express.Router({mergeParams:true})

const Post = require('../models/Post')
const {commentValidation} = require('../validations/validation')
const verifyToken = require('../verifyToken')

router.post('/', verifyToken, async(req,res)=>{

    // Validation 1: Check if User is owner of Post
    const ownPost = await Post.findOne({"_id" :req.params.postId, user_id: res.user._id})
    if(ownPost){
        return res.status(400).send({message:"User cannot comment on own post"})
    }

    // Validation 2: Check User input
    const {error} = commentValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

    // Saves a new Comment into inside a Post
    try {        
        const pushCommentToPost = await Post.findById(req.params.postId)

        // Validation 3: Sends error message if post is not found
        if(pushCommentToPost == null){
            return res.status(400).send({message:"Cannot find post with that id"})
        } 

        pushCommentToPost.comments.push({
            text: req.body.text,
            user_id: res.user._id
        })        
        const savedComment = await pushCommentToPost.save()
        res.send(pushCommentToPost)  
    } catch (error) {
        res.status(400).send({message:error})
    }
})

module.exports = router