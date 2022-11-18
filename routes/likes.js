const express = require('express')
const router = express.Router({mergeParams:true})

const Post = require('../models/Post')
const verifyToken = require('../middleware/verifyToken')

router.post('/', verifyToken, async(req,res)=>{    
    const getPostById = await Post.findOne({"_id" :req.params.postId})

    // Validation 1: Sends error message if post is not found
    if(getPostById == null){
        return res.status(404).send({message:"Resource not found"})        
    }

    // Validation 2: Checks if User is owner of Post    
    if(getPostById.user_id == res.user._id){
        return res.status(405).send({message:"Method not allowed"})
    }

    // Validation 3: Checks if User has already liked Post
    const hasLiked = await Post.findOne({ "_id" :req.params.postId, "likes.user_id": res.user._id})    
    if(hasLiked){
        return res.status(405).send({message:"Resource already liked!"})
    }  

    // Saves a new Like to a Post and increments likes_count by 1
    try {        
        getPostById.likes.push({
            user_id: res.user._id
        })
        getPostById.$inc('likes_count', 1)        
        const savedLike = await getPostById.save()
        res.status(201).send(savedLike)
    } catch (error) {
        res.status(400).send({message:error})
    }
})

router.delete('/', verifyToken, async(req,res)=>{
    const getPostById = await Post.findOne({"_id" :req.params.postId, "likes.user_id": res.user._id})

    // Validation 1: Sends error message if user id on likes array is not found
    if(getPostById == null){
        return res.status(404).send({message:"Resource not found"})        
    }

    try {
        const deleteLike = await Post.findOneAndUpdate(
            {"_id": req.params.postId},
            {
                "$pull" :{"likes": {"user_id": res.user._id}},
                "$inc" : {"likes_count": -1}
            }
            // {"$inc" : {"likes_count": -1}}
        )        
        deleteLike.save()        
        return res.status(200).send({message: "Post Unliked"})        
    } catch (error) {
        return res.status(400).send({message:error})
    }
})

module.exports = router