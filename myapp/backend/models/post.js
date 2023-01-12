// import moongose

const moongose = require('mongoose')

// create a schema
const postSchema = moongose.Schema({
  title : {type: String, require:true},
  content: {type: String, require:true},
  imagePath: {type:String, require:true}
})


// create model base on the shcema and exported
module.exports = moongose.model('Post',postSchema);
