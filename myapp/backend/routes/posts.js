const express = require("express")
// install npm i --save-dev @types/multer if you facing issue with mimetype

const checkAuth = require('../middleware/check-auth')
const extractFile = require('../middleware/file')

const router = express.Router()

const PostController = require('../controllers/posts')





router.post("",checkAuth,extractFile,PostController.createPost)

router.put("/:id",checkAuth,extractFile,PostController.updatePost)

// we can app.use but can change to app.get
router.get('',PostController.getPosts)

router.get("/:id",PostController.getPost )

// :id dynamic set some id
router.delete("/:id",checkAuth,PostController.deletePost)

module.exports = router
