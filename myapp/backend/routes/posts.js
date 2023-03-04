const express = require("express")
// install npm i --save-dev @types/multer if you facing issue with mimetype
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')
const router = express.Router()
const Post = require('../models/post')



const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req,file,cb)=> {
    const isValid = MIME_TYPE_MAP[file.mimetype]
    let error = new Error('Invalid mime type')
    if(isValid){
      error = null
    }
    cb(error,"backend/images")
  },
  filename: (req,file,cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-')
    const ext = MIME_TYPE_MAP[file.mimetype]
    cb(null, name + '-' + Date.now() + '.' + ext)
  }
})


router.post("",checkAuth,multer({storage:storage}).single('image'),(req,res,next)=>{
  const url = req.protocol + '://' + req.get('host')
  const post = new Post({
    title : req.body.title,
    content: req.body.content,
    imagePath : url + '/images/' + req.file.filename
  })


  // the solve the issue with id null when addin a new post
  post.save().then(createdPost => {
   // console.log(createdPost)
    res.status(201).json({
    message: "Post added succesfully",
    post: {
      //...createdPost spread operator
      id: createdPost._id,
      title: createdPost.title,
      content: createdPost.content,
      imagePath: createdPost.imagePath
    }
  })

  })
})

router.put("/:id",checkAuth,multer({storage:storage}).single('image'),(req,res,next)=>{
  let imagePath = req.body.imagePath
  if (req.file){
    const url = req.protocol + '://' + req.get('host')
    imagePath = url + "/images/" + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath

  })
  console.log(post)
  Post.updateOne({_id: req.params.id},post).then(result => {
    console.log(result)
    res.status(200).json({message:"Update successful!"})
  })
})

// we can app.use but can change to app.get
router.get('',(req,res,next)=> {
  // adding + to convert to integer because in URL the are string
  const pageSize = +req.query.pageSize
  const currentPage = +req.query.page
  const postQuary = Post.find()
  let fetchedPosts
  if(pageSize && currentPage){
    postQuary
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize)
  }
  postQuary
  .then(documents=> {
    fetchedPosts = documents
    //console.log(documents)
    return Post.count()
  })
  .then(count=> {
    res.status(200).json({
      message : 'Posts fetched sucessfully',
      posts: fetchedPosts,
      maxPosts : count
    })
  })
})

router.get("/:id", (req,res,next)=> {
  Post.findById(req.params.id).then(post=>{
    if(post){
      res.status(200).json(post)
    }else{
      res.status(404).json({message: "Post not found !"})
    }
  })
})

// :id dynamic set some id
router.delete("/:id",checkAuth,(req,res,next)=>{
  //console.log(req.params.id)
  Post.deleteOne({
    _id: req.params.id
  }).then(result => {
    //console.log(result)
    res.status(200).json({message:'Post deleted !'})
  })

})

module.exports = router
