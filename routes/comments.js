const express = require('express')
const router = express.Router({mergeParams:true})

const Post = require('../models/Post')
const {commentValidation} = require('../middleware/validation')
const verifyToken = require('../middleware/verifyToken')
const { route } = require('./auth')

// Create new Comment on Post
router.post('/', verifyToken, async(req,res)=>{
    const getPostById = await Post.findById(req.params.postId)   

    // Validation 1: Checks if Post exists    
    if(getPostById == null){
        return res.status(400).send({message:"Cannot find post with that id"})
    } 

    // Validation 2: Checks if User is owner of Post    
    if(getPostById.user_id == res.user._id){
        return res.status(400).send({message:"User cannot comment on own post"})
    }

    // Validation 3: Checks User input
    const {error} = commentValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

    // Saves a new Comment inside the Post
    try {                      
        getPostById.comments.push({
            text: req.body.text,
            user_id: res.user._id
        })        

        const savedComment = await getPostById.save()
        res.send(savedComment)  
    } catch (error) {
        res.status(400).send({message:error})
    }
})

// View all Comments on Post
router.get('/', verifyToken, async(req,res)=>{
    const getPostById = await Post.findById(req.params.postId)

    // Validation 1: Checks if Post exists
    if(getPostById == null){
        return res.status(400).send({message:"Cannot find post with that id"})
    }

    try {
        res.send(getPostById.comments)
    } catch (error) {
        res.status(400).send({message:error})
    }
})

// Update Comment on Post
router.patch('/:commentId', verifyToken, async(req,res)=>{
    const commentExist = await Post.findOne({"_id": req.params.postId, "comments._id":req.params.commentId})
        
    // Validation 1: Checks if Comment exists
    if(commentExist == null){
        return res.status(400).send({message:"Cannot find resource"})
    }

    // Validation 2: Checks if User is Owner of Comment    
    const getPostComment = await Post.findOne({"_id": req.params.postId, "comments._id":req.params.commentId, "comments.user_id": res.user._id})    
    if (getPostComment == null){
        return res.status(400).send({message:"User cannot update resource"})
    }    

    try {
        const updateComment = await Post.findOneAndUpdate(
            {"_id": req.params.postId, "comments._id":req.params.commentId, "comments.user_id": res.user._id},
            {$set:{"comments.$.text": req.body.text}}
        )
        updateComment.save()
        
        res.send(updateComment)        
    } catch (error) {
        return res.status(400).send({message:error})
    }
})

// Delete Comment on Post


module.exports = router