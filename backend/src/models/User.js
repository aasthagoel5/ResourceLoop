const mongoose = require("mongoose");


// Define the User schema
const userschema = new mongoose.Schema({
  name: {
    type: String,required: true
  },//every user will have a name
  email: {
    type: String,required: true,unique: true
  }, //prevents two users from having the same email

  password: {
    type: String,
    required: function () {
      return this.authProvider == "local";
    },
  }, //hashed password
  phone: {
    type: String, //contact number
  }, 
  location: {
    type: String, //can upgrade to lat/lng later for real map matching
  },
  profileImage: {
    type: String, //will store a URL/path once you add image upload later
  },

  role: {
    type: String, enum: ['individual','ngo','hospital', 'admin'], //only these values are allowed
    default: 'individual',
  },//every new signup is a normal user unless changed by an admin

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
  refreshToken:{
    type:String,
  },
  trustScore:{
    type: Number,
    default:10, // every new user starts at 10 , as per trust score idea.
  },
  authProvider : {
    type : String,
    enum:["local","google"],
    default:"local",
  },
  savedResources :[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resource",
  },],
  },
  {timestamps: true});


  //compile the schema into a model so we can query/create users in the database
module.exports = mongoose.model("User", userschema);
