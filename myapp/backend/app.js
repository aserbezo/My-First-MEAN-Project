const express = require('express');
const bodyParser = require('body-parser')
// creating the express app
const app = express()

// import the PostModel for moongoose database
const Post = require('./models/post')

// connect to MongoDB from Express app

const moongoose = require('mongoose')
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


// resolve CORS error issue
app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept")
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS")
  next()
})


app.post("/api/posts", (req,res,next)=>{
  const post = new Post({
    title : req.body.title,
    content: req.body.content
  })

  // the solve the issue with id null when addin a new post
  post.save().then(createdPost => {
   // console.log(createdPost)
    res.status(201).json({
    message: "Post added succesfully",
    postId: createdPost._id
  })

  })
})

// we can app.use but can change to app.get
app.get('/api/posts',(req,res,next)=> {
  // const posts = [
  //   {id: 'dadawqwe', title: 'tittt', content: 'dqdqwqdwqdwqdq'},
  //   {id: '3231312313', title: 'qwrqewq', content: 'awdadwawa'}
  // ]
  Post.find()
  .then(documents=> {
    //console.log(documents)

    res.status(200).json({
      message : 'Posts fetched sucessfully',
      posts: documents
    })
  })
})

// :id dynamic set some id
app.delete("/api/posts/:id", (req,res,next)=>{
  //console.log(req.params.id)
  Post.deleteOne({
    _id: req.params.id
  }).then(result => {
    //console.log(result)
    res.status(200).json({message:'Post deleted !'})
  })

})


// we are exporrting not only the app but also the middleware attached to it.
module.exports = app;
