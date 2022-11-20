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
        return res.status(422).send({message:error['details'][0]['message']})
    }

    const postData = new Post({        
        user_id: res.user._id,
        title: req.body.title,
        description: req.body.description        
    })    

    // Saves new Post
    try {
        const postToSave = await postData.save()
        res.status(201).send(postToSave)
    } catch (error) {
        res.status(400).send({message:error})
    }
})

// Reads all Posts, arranged in descending order by likes_count
router.get('/', verifyToken, async(req, res)=>{
    try {
        const getPosts = await Post.find().sort({likes_count:-1, created_at: 1})
        res.status(200).send(getPosts)        
    } catch (error) {
        res.status(400).send({message:error})
    }
})

// Read Post
router.get('/:postId', verifyToken, async(req,res)=>{
    const getPostById = await Post.findById(req.params.postId)

    // Validation 1: Checks if Post exists
    if(getPostById == null){
        return res.status(404).send({message:"Resource not found"})
    }

    try {                
        res.status(200).send(getPostById)
    } catch (error) {
        res.send({message: error})
    }
})

// Update Post
router.patch('/:postId', verifyToken, async(req,res)=>{
    const getPostById = await Post.findById(req.params.postId)     

    // Validation 1: Checks if Post exists
    if(getPostById == null){
        return res.status(404).send({message:"Resource not found"})
    }
   
    // Validation 2: Checks if User is owner of Post
    if(getPostById.user_id != res.user._id) {
        return res.status(403).send({message:"Forbidden access to resource"})
    }

    // Validation 3: Checks User input
    const {error} = postValidation(req.body)
    if(error){
        return res.status(422).send({message:error['details'][0]['message']})
    }

    try {           
        const updatePostById = await Post.findOneAndUpdate(
            {_id: req.params.postId},        
            {$set: {
                title: req.body.title,
                description: req.body.description  
            }},
            {
                returnDocument: 'after'
            }
        )                   
        console.log(updatePostById)
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
        return res.status(404).send({message:"Resource not found"})
    }

    // Validation 2: Checks if User is owner of Post   
    if(getPostById.user_id != res.user._id){
        return res.status(403).send({message:"Forbidden access to resource"})
    }
        
    try {
        const deletePostById = await getPostById.deleteOne()
        res.status(204).send({message: "Post deleted!"})
    } catch (error) {
        res.status(400).send({message:error})
    }
})

module.exports = router