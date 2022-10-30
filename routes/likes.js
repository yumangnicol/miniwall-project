const express = require('express')
const router = express.Router()

const Post = require('../models/Post')
const {postValidation} = require('../validations/validation')
const verifyToken = require('../verifyToken')

router.post('/', async(req,res)=>{

})

module.exports = router