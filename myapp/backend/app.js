const express = require('express');
const bodyParser = require('body-parser')
const path = require('path')
const postsRoutes = require('./routes/posts')

// creating the express app
const app = express()
// connect to MongoDB from Express app
const moongoose = require('mongoose');
const post = require('./models/post');
moongoose.connect('mongodb+srv://Admin:SwXPCOC0SNqlWW6X@project.xsqgrzt.mongodb.net/node-angular?retryWrites=true&w=majority')
.then(()=> {
  console.log('Connected to the Database !')
})
.catch(()=>{
  console.log('Connection failed !')
})


// bodyparse midlleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use("/images", express.static(path.join('backend/images')))

// resolve CORS error issue
app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept")
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS")
  next()
})


app.use("/api/posts",postsRoutes)

// we are exporrting not only the app but also the middleware attached to it.
module.exports = app;
