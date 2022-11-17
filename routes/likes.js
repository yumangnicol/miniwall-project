const express = require('express')
const router = express.Router({mergeParams:true})

const Post = require('../models/Post')
const verifyToken = require('../middleware/verifyToken')

router.post('/', verifyToken, async(req,res)=>{    
    const getPostById = await Post.findOne({"_id" :req.params.postId})

    // Validation 1: Sends error message if post is not found
    if(getPostById == null){
        return res.status(400).send({message:"Cannot find post with that id"})        
    }

    // Validation 2: Checks if User is owner of Post    
    if(getPostById.user_id == res.user._id){
        return res.status(400).send({message:"User cannot like own post"})
    }

    // Validation 3: Checks if User has already liked Post
    const hasLiked = await Post.findOne({ "_id" :req.params.postId, "likes.user_id": res.user._id})    
    if(hasLiked){
        return res.status(400).send({message:"User has already liked post"})
    }  

    // Saves a new Like to a Post and increments likes_count by 1
    try {        
        getPostById.likes.push({
            user_id: res.user._id
        })
        getPostById.$inc('likes_count', 1)        
        const savedLike = await getPostById.save()
        res.send(savedLike)
    } catch (error) {
        res.status(400).send({message:error})
    }
})

module.exports = router