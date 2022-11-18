const express = require('express')
const router = express.Router()

const User = require('../models/User')
const {registerValidation, loginValidation} = require('../middleware/validation')

const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

router.post('/register', async(req,res)=>{
    // Validation 1: Checks User input
    const {error} = registerValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

    // Validation 2: Checks if User exists
    const userExists = await User.findOne({email:req.body.email})
    if(userExists){
        return res.status(400).send({message:'Email already in use'})
    }

    // Hashes User password
    const salt = await bcryptjs.genSalt(5)
    const hashedPassword = await bcryptjs.hash(req.body.password, salt)

    // Saves User data
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    })

    try {
        const savedUser = await user.save()
        res.send(savedUser)        
    } catch (error) {
        res.status(400).send({message:error})
    }
})

router.post('/login', async(req,res)=>{
    // Validation 1: Checks User input
    const {error} = loginValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

    // Validation 2: Checks if User exists
    const user = await User.findOne({email:req.body.email})
    if (!user){
        return res.status(400).send({message:'User does not exists'})
    }

    // Validation 3: Checks User credentials
    const passwordValidation = await bcryptjs.compare(req.body.password, user.password)
    if (!passwordValidation){
        return res.status(400).send({message:'Password is wrong'})
    }

    // Generates an Auth-Token (expires in 30 minutes)
    const token = jsonwebtoken.sign({_id:user.id}, process.env.TOKEN_SECRET, {expiresIn: +process.env.TOKEN_LIFE})
    res.header('auth-token', token).send({'auth-token':token})
})


module.exports = router