const express = require('express')
const router = express.Router()

const Post = require('../models/Post')
const {postValidation} = require('../validations/validation')
const verifyToken = require('../verifyToken')


// Creates new Post
router.post('/', verifyToken, async(req, res)=>{

    // Validation 1: Checks User input
    const {error} = postValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

    // Saves Post data
    const postData = new Post({        
        user_id: res.user._id,
        title: req.body.title,
        description: req.body.description        
    })    

    try {
        const postToSave = await postData.save()
        res.send(postToSave)
    } catch (error) {
        res.status(400).send({message:error})
    }
})

// Reads all Posts, arranged in descending order by likes_count
router.get('/', verifyToken, async(req, res)=>{

    try {
        const getPosts = await Post.find().sort({likes_count:-1})
        res.send(getPosts)        
    } catch (error) {
        res.status(400).send({message:error})
    }
})

// Read Post
router.get('/:postId', verifyToken, async(req,res)=>{
    try {
        const getPostById = await Post.findById(req.params.postId)

        // Validation 1: Sends error message if post is not found
        if(getPostById == null){
            return res.status(400).send({message:"Cannot find post with that id"})
        }

        res.send(getPostById)
    } catch (error) {
        res.send({message: error})
    }
})

// Update Post
router.patch('/:postId', verifyToken, async(req,res)=>{
    // Validation 1: Check if User is owner of Post
    const ownPost = await Post.findOne({"_id" :req.params.postId, user_id: res.user._id})
    if(!ownPost){
        return res.status(400).send({message:"User is not allowed to update this post"})
    }

    // Validation 2: Checks User input
    const {error} = postValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

    // Saves changes to Post data
    try {
        const updatePostById = await Post.updateOne(
            {_id:req.params.postId},
            {$set: {
                title: req.body.title,
                description: req.body.description  
            }}
        )   
        res.send(updatePostById)
    } catch (error) {
        res.status(400).send({message:error})
    }
})

module.exports = router