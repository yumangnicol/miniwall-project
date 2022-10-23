const express = require('express')
const app = express()

const mongoose = require('mongoose')
require('dotenv/config')

mongoose.connect(process.env.DB_CONNECTOR, ()=>{
    console.log('DB is connected...')
})

app.listen(3000, ()=>{
    console.log('Your server is running...')
})