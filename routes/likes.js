const express = require('express')
const router = express.Router({mergeParams:true})

const Post = require('../models/Post')
const {postValidation} = require('../validations/validation')
const verifyToken = require('../verifyToken')

router.post('/', verifyToken, async(req,res)=>{

    // Validation 1: Check if User is owner of Post
    const ownPost = await Post.findOne({created_by: res.user._id})
    if(ownPost){
        return res.status(400).send({message:"User cannot like own post"})
    }

    // Validation 2: Check if User has already liked Post
    const hasLiked = await (await Post.find({ "likes.created_by": res.user._id})).length 
    if(hasLiked){
        return res.status(400).send({message:"User has already liked post"})
    } 

    // Saves a new Like to a Post and increments likes_count by 1
    try {
        const pushLikeToPost = await Post.findById(req.params.postId)
        pushLikeToPost.likes.push({
            created_by: res.user._id
        })
        pushLikeToPost.$inc('likes_count', 1)        
        const savedLike = await pushLikeToPost.save()
        res.send(pushLikeToPost)
    } catch (error) {
        res.status(400).send({message:error})
    }
})

module.exports = router