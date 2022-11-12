const express = require('express')
const router = express.Router({mergeParams:true})

const Post = require('../models/Post')

router.post('/', async(req,res)=>{

    // Validation 1: Check if User is owner of Post
    const ownPost = await Post.findOne({"_id" :req.params.postId, user_id: res.user._id})
    if(ownPost){
        return res.status(400).send({message:"User cannot like own post"})
    }

    // Validation 2: Check if User has already liked Post
    try {
        const hasLiked = await Post.findOne({ "_id" :req.params.postId, "likes.user_id": res.user._id})    
        if(hasLiked){
            return res.status(400).send({message:"User has already liked post"})
        } 
    } catch (error) {
        res.status(400).send({message:error})
    }    

    // Saves a new Like to a Post and increments likes_count by 1
    try {
        const pushLikeToPost = await Post.findById(req.params.postId)
        
        // Validation 3: Sends error message if post is not found
        if(pushLikeToPost == null){
            return res.status(400).send({message:"Cannot find post with that id"})
        }          

        pushLikeToPost.likes.push({
            user_id: res.user._id
        })
        pushLikeToPost.$inc('likes_count', 1)        
        const savedLike = await pushLikeToPost.save()
        res.send(pushLikeToPost)
    } catch (error) {
        res.status(400).send({message:error})
    }
})

module.exports = router