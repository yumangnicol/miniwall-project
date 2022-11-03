const express = require('express')
const router = express.Router({mergeParams:true})

const Post = require('../models/Post')
const {postValidation} = require('../validations/validation')
const verifyToken = require('../verifyToken')

router.post('/', verifyToken, async(req,res)=>{
    
    try {
        const pushLikeToPost = await Post.findById(req.params.postId)
        pushLikeToPost.likes.push({
            created_by: res.user._id
        })
        const savedLike = await pushLikeToPost.save()
        res.send(pushLikeToPost)
    } catch (error) {
        res.status(400).send({message:error})
    }
})

module.exports = router