const express = require('express')
const router = express.Router()

const Post = require('../models/Post')
const {postValidation} = require('../validations/validation')
const verifyToken = require('../verifyToken')

router.post('/', verifyToken, async(req, res)=>{
    // console.log(req.body)
    // console.log(res.user)
    const {error} = postValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

    const postData = new Post({        
        created_by: res.user._id,
        title: req.body.title,
        description: req.body.description,        
    })    

    try {
        const postToSave = await postData.save()
        res.send(postToSave)
    } catch (error) {
        res.send({message:error})
    }
})

module.exports = router