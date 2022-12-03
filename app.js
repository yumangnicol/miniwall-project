const express = require('express')
const app = express()

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config({path:'./configs/.env'})


app.use(bodyParser.json())

// Middleware
const authRoute = require('./routes/auth')
app.use('/api/user', authRoute)

const postsRoute = require('./routes/posts')
app.use('/api/post', postsRoute)

const commentsRoute = require('./routes/comments')
app.use('/api/post/:postId/comment', commentsRoute)

const likesRoute = require('./routes/likes')
app.use('/api/post/:postId/like', likesRoute)

mongoose.connect(process.env.DB_CONNECTOR, ()=>{
    console.log('DB is connected...')
})

app.listen(3000, ()=>{
    console.log('Your server is running...')
})