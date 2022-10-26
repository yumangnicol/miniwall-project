const express = require('express')
const router = express.Router()

const User = require('../models/User')
const {registerValidation, loginValidation} = require('../validations/validation')

const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

router.post('/register', async(req,res)=>{
    // Validation 1: Check user input and validate throuth joi
    const {error} = registerValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

    // Validation 2: Check if user exists on DB
    const userExists = await User.findOne({email:req.body.email})
    if(userExists){
        return res.status(400).send({message:'Email already in use'})
    }

    // Hash password of user
    const salt = await bcryptjs.genSalt(5)
    const hashedPassword = await bcryptjs.hash(req.body.password, salt)

    // Save user data
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
    // Validation 1: Check user input
    const {error} = loginValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

    // Validation 2: Check is user exists
    const user = await User.findOne({email:req.body.email})
    if (!user){
        return res.status(400).send({message:'User does not exists'}) //Change message after developing
    }

    // Validation 3: Check user credentials
    const passwordValidation = await bcryptjs.compare(req.body.password, user.password)
    if (!passwordValidation){
        return res.status(400).send({message:'Password is wrong'})
    }

    // Generate an auth-token
    const token = jsonwebtoken.sign({_id:user.id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send({'auth-token':token})
})


module.exports = router