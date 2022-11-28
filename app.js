const express = require('express')
const app = express()

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config({path:'./configs/.env'})


app.use(bodyParser.json())

// Middleware
const authRoute = require('./routes/auth')
app.use('/api/users', authRoute)

const postsRoute = require('./routes/posts')
app.use('/api/posts', postsRoute)

const commentsRoute = require('./routes/comments')
app.use('/api/posts/:postId/comments', commentsRoute)

const likesRoute = require('./routes/likes')
app.use('/api/posts/:postId/likes', likesRoute)

mongoose.connect(process.env.DB_CONNECTOR, ()=>{
    console.log('DB is connected...')
})

app.listen(3000, ()=>{
    console.log('Your server is running...')
})