// npm install --save bcrypt to hash the password
const bcrypt = require('bcrypt')
//npm install --save jsonwebtoken
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const saltRounds = 10

exports.createUser = (req,res,next) => {
  const password = req.body.password
  const hash_password = bcrypt.hashSync(password,saltRounds)
  const user = new User({
    email: req.body.email,
    password : hash_password
  })

  try{
    user.save().then(result => {
      res.status(201).json({
        message: 'User is created !',
        result: result
      })
    })
  }catch(err){
    res.status(500).json({
        message: 'Invalid authetication credentials!'
    })
  }
    //console.log(req.body)
    //console.log(` Backend ${user}`)
    //user.save()


  //   bcrypt.hash(req.body.password,10)
  //   .then( hash => {
  //   const user = new User({
  //     email: req.body.email,
  //     password : hashß
  //   })
  //   console.log(user)
  //   user.save()
  //   .then(result => {
  //     res.status(201).json({
  //       message: 'User created!',
  //       result: result
  //     })
  //   })
  //   .catch(err=> {
  //     res.status(500).json({
  //     error: err
  //     })
  //   })
  // })

}


exports.userLogin = (req,res,next)=> {
  let fetchedUser;
  //console.log(req.body)
  User.findOne({ email: req.body.email})
  .then(user=> {
    //console.log(user)
    if(!user){
      return res.status(401).json({
        message: 'Auth Failed'
      })
    }
    fetchedUser = user
    return bcrypt.compare(req.body.password, user.password)
  })
  .then(result=> {
   // console.log(result)
    if(!result) {
      return res.status(401).json({
        message: 'Auth Failed'
      })
    }
    const token = jwt.sign({
      email: fetchedUser.email,
      userId :  fetchedUser._id
    },
    // JWT key from nodemon json
    "secret_this_shuld_be_longer",
    {expiresIn: '1h'}
    )
   // console.log(token)
    res.status(200).json({
      token : token,
      expiresIn: 3600
    })

  })
  .catch(err=>{
   // console.log(err)
    return res.status(401).json({
    message : 'Invalid authentication credentials !'
    })
  })

}
