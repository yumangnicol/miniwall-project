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
        return res.status(404).send({message:"Resource not found"})
    } 

    // Validation 2: Checks if User is owner of Post    
    if(getPostById.user_id == res.user._id){
        return res.status(405).send({message:"Method not allowed"})
    }

    // Validation 3: Checks User input
    const {error} = commentValidation(req.body)
    if(error){
        return res.status(422).send({message:error['details'][0]['message']})
    }

    // Saves a new Comment inside the Post
    try {                      
        getPostById.comments.push({
            text: req.body.text,
            user_id: res.user._id
        })        

        const savedComment = await getPostById.save()
        res.status(201).send(savedComment)  
    } catch (error) {
        res.status(400).send({message:error})
    }
})

// View all Comments on Post
router.get('/', verifyToken, async(req,res)=>{
    const getPostById = await Post.findById(req.params.postId)

    // Validation 1: Checks if Post exists
    if(getPostById == null){
        return res.status(404).send({message:"Resource not found"})
    }

    try {
        res.status(200).send(getPostById.comments)
    } catch (error) {
        res.status(400).send({message:error})
    }
})

// Update Comment on Post
router.patch('/:commentId', verifyToken, async(req,res)=>{
    const commentExist = await Post.findOne({"_id": req.params.postId, "comments._id":req.params.commentId})
        
    // Validation 1: Checks if Comment exists
    if(commentExist == null){
        return res.status(400).send({message:"Resource not found"})
    }

    // Validation 2: Checks if User is Owner of Comment    
    const isOwnerOfComment = await Post.findOne({"_id": req.params.postId, "comments._id":req.params.commentId, "comments.user_id": res.user._id})    
    if (isOwnerOfComment == null){
        return res.status(403).send({message:"Forbidden access to resource"})
    }    

    try {
        const getComment = await Post.findOneAndUpdate(
            {"_id": req.params.postId, "comments._id":req.params.commentId, "comments.user_id": res.user._id},
            {$set:{"comments.$.text": req.body.text}}
        )
        getComment.save()
        
        res.status(200).send(getComment)        
    } catch (error) {
        return res.status(400).send({message:error})
    }
})

// Delete Comment on Post
router.delete('/:commentId', verifyToken, async(req,res)=>{
    const commentExist = await Post.findOne({"_id": req.params.postId, "comments._id":req.params.commentId})
        
    // Validation 1: Checks if Comment exists
    if(commentExist == null){
        return res.status(404).send({message:"Resource not found"})
    }

    // Validation 2: Checks if User is Owner of Comment    
    const isOwnerOfComment = await Post.findOne({"_id": req.params.postId, "comments._id":req.params.commentId, "comments.user_id": res.user._id})    
    if (isOwnerOfComment == null){
        return res.status(403).send({message:"Forbidden access to resource"})
    }    

    try {
        const deleteComment = await Post.findOneAndUpdate(
            {"_id": req.params.postId},
            {"$pull" :{"comments": {"_id":req.params.commentId}}}
        )        
        deleteComment.save()        
        res.status(204).send({message: "Comment deleted!"})
    } catch (error) {
        return res.status(400).send({message:error})
    }
})

module.exports = router