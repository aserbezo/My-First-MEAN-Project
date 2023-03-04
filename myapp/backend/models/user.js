const moongose = require('mongoose')

//npm install --save mongoose-unique-validator  to use unique validator package to check unique emails

const uniqueValidator = require("mongoose-unique-validator");
const { use } = require('../routes/user');

// create a schema
const userSchema = moongose.Schema({
  email : {type: String, require:true, unique: true},
  password: {type: String, require:true}

})

// to check if the user has unique email
userSchema.plugin(uniqueValidator)

// create model base on the shcema and exported
module.exports = moongose.model('User',userSchema);
