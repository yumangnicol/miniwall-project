const express = require('express')
const router = express.Router()

const Post = require('../models/Post')
const {postValidation} = require('../middleware/validation')
const verifyToken = require('../middleware/verifyToken')

// Creates new Post
router.post('/', verifyToken, async(req, res)=>{

    // Validation 1: Checks User input
    const {error} = postValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

    const postData = new Post({        
        user_id: res.user._id,
        title: req.body.title,
        description: req.body.description        
    })    

    // Saves new Post
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
        const getPosts = await Post.find().sort({likes_count:-1, created_at: 1})
        res.send(getPosts)        
    } catch (error) {
        res.status(400).send({message:error})
    }
})

// Read Post
router.get('/:postId', verifyToken, async(req,res)=>{
    const getPostById = await Post.findById(req.params.postId)

    // Validation 1: Checks if Post exists
    if(getPostById == null){
        return res.status(400).send({message:"Cannot find post with that id"})
    }

    try {                
        res.send(getPostById)
    } catch (error) {
        res.send({message: error})
    }
})

// Update Post
router.patch('/:postId', verifyToken, async(req,res)=>{
    const getPostById = await Post.findById(req.params.postId)     

    // Validation 1: Checks if Post exists
    if(getPostById == null){
        return res.status(400).send({message:"Cannot find post with that id"})
    }
   
    // Validation 2: Checks if User is owner of Post
    if(getPostById.user_id != res.user._id) {
        return res.status(400).send({message:"User is not allowed to update this post"})
    }

    // Validation 3: Checks User input
    const {error} = postValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

    // Saves changes to Post data
    try {   
        const updatePostById = await getPostById.updateOne(
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

// Delete Post
router.delete('/:postId', verifyToken, async(req,res)=>{
    const getPostById = await Post.findById(req.params.postId)   

    // Validation 1: Checks if Post exists
    if(getPostById == null){
        return res.status(400).send({message:"Cannot find post with that id"})
    }

    // Validation 2: Checks if User is owner of Post   
    if(getPostById.user_id != res.user._id){
        return res.status(400).send({message:"User is not allowed to delete this post"})
    }
    
    try {
        const deletePostById = await getPostById.deleteOne()
        res.send(deletePostById)
    } catch (error) {
        res.send({message:error})
    }
})

module.exports = router