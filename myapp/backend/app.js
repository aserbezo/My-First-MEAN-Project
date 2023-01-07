const express = require('express');
const bodyParser = require('body-parser')
// creating the express app
const app = express()

// bodyparse midlleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

// resolve CORS error issue
app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept")
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS")
  next()
})


app.post("/api/posts", (req,res,next)=>{
  const post = req.body
  console.log(post)
  res.status(201).json({
    message: "Post added succesfully"
  })
})

// we can app.use but can change to app.get
app.get('/api/posts',(req,res,next)=> {
  const posts = [
    {id: 'dadawqwe', title: 'tittt', content: 'dqdqwqdwqdwqdq'},
    {id: '3231312313', title: 'qwrqewq', content: 'awdadwawa'}
  ]
  res.status(200).json({
    message : 'Posts fetched sucessfully',
    posts: posts
  })
})

// we are exporrting not only the app but also the middleware attached to it.
module.exports = app;
