const Post = require('../models/post')

exports.createPost = (req,res,next)=>{
  const url = req.protocol + '://' + req.get('host')
  const post = new Post({
    title : req.body.title,
    content: req.body.content,
    imagePath : url + '/images/' + req.file.filename,
    creator : req.userData.userId
  })
  //console.log(req.userData)
  //return res.status(200).json({})
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
  .catch(error => {
    res.status(500).json({
      message: 'Created Post Failed !'
    })
  })
}


exports.updatePost = (req,res,next)=>{
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
  Post.updateOne({_id: req.params.id , creator: req.userData.userId},post).then(result => {
    console.log(result)
    if (result.matchedCount > 0){
    res.status(200).json({message:"Update successful!"})
    }else{
      res.status(401).json({message:"Not Authorize!"})
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Could not update post !'
    })
  })
}

exports.getPosts = (req,res,next)=> {
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
  .catch(error => {
    res.status(500).json({
      message: 'Unable to get the posts !'
    })
  })
}

exports.getPost = (req,res,next)=> {
  Post.findById(req.params.id).then(post=>{
    if(post){
      res.status(200).json(post)
    }else{
      res.status(404).json({message: "Post not found !"})
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Unable to get the posts !'
    })
  })
}

exports.deletePost = (req,res,next)=>{
  //console.log(req.params.id)
  Post.deleteOne({
    _id: req.params.id
  }).then(result => {
    //console.log(result)
    res.status(200).json({message:'Post deleted !'})
  })

}
