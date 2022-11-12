const express = require('express')
const router = express.Router({mergeParams:true})

const Post = require('../models/Post')
const {commentValidation} = require('../middleware/validation')
const verifyToken = require('../middleware/verifyToken')

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

module.exports = router