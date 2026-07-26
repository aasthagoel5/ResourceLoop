const mongoose = require("mongoose");


// Define the User schema
const userschema = new mongoose.Schema({
  name: {type: String,required: true},//every user will have a name


  email: {type: String,required: true,unique: true}, //prevents two users from having the same email

  password: {type: String,required: true}, //hashed password

  role: {type: String, enum: ['user','ngo','hospital', 'admin'], //only these values are allowed

  default: 'user'},//every new signup is a normal user unless changed by an admin

  //New fields for email verification
  isVerified:{
    type:Boolean,default:false,
  },
  verificationToken:{
    type:String,
  },
  verificationTokenExpires:{
    type:Date,
  },
  resetPasswordToken:{
    type:String,
  },
  resetPasswordExpires:{
    type: Date,
  },
  refershToken:{
    type:String,
  },
  },
  {timestamps: true});


  //compile the schema into a model so we can query/create users in the database
module.exports = mongoose.model("User", userschema);
