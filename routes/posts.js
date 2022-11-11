const express = require('express')
const router = express.Router()

const Post = require('../models/Post')
const {postValidation} = require('../validations/validation')
const verifyToken = require('../verifyToken')

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
        description: req.body.description,        
    })    

    try {
        const postToSave = await postData.save()
        res.send(postToSave)
    } catch (error) {
        res.status(400).send({message:error})
    }
})

router.get('/', verifyToken, async(req, res)=>{

    try {
        // const Posts = await Post.aggregate()
    } catch (error) {
        res.status(400).send({message:error})
    }
})

module.exports = router