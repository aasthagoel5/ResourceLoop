const bcrypt = require("bcryptjs");//used to hash and compare passwords
const jwt = require("jsonwebtoken");//used to create login tokens for users
const crypto = require("crypto");//used to generate random tokens for email verification
const User = require("../models/User");
const sendEmail =  require("../utils/sendEmail");//used to send emails for verification and password reset
const { generateAccessToken, generateRefreshToken } = require("../utils/generateTokens");
const Hospital = require("../models/Hospital");
const NGO = require("../models/NGO");

// @route  POST /api/auth/register
// @desc   Register a new user
exports.register = async (req, res) => {
  try{
    const { name, email, password, phone, location, role }=req.body;

    //Block anyone from self-registration as admin - admins are created manually/internally only
    if(role == "admin"){
      return res.status(403).json({message :"cannot register as admin"});
    }

    //only allow known roles; default to "individual" if none given
    const allowedRoles = ["individual","hospital","ngo"];
    const finalRole = allowedRoles.includes(role) ? role : "individual";

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = Date.now() + 60 * 60 * 1000;

    //Always create the Base user account first 
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      location,
      authProvider : "local",
      role : finalRole,
      verificationToken,
      verificationTokenExpires,
    });

    //If this is a hospital or NGO , also creat their extra profile document
    if (finalRole=="hospital"){
      const { hospitalName, registrationNumber, address} = req.body;

      if (!hospitalName || !registrationNumber || !address){
        //Rollback the user we just created, since hospital signup is still incomplete
        await User.findByIdAndDelete(user._id);
        return res.status(400).json({
          message : "hospitalName, registrationNumber, address are required field for the hpspital registration"
        });
      }
      await Hospital.create({
        userId: user._id,
        hospitalName,
        registrationNumber,
        address,
      });
    }

    if (finalRole === "ngo") {
      const { organizationName, registrationId, address } = req.body;

      if (!organizationName || !registrationId || !address) {
        await User.findByIdAndDelete(user._id);
        return res.status(400).json({
          message: "organizationName, registrationId, and address are required for NGO registration",
        });
      }

      await NGO.create({
        userId: user._id,
        organizationName,
        registrationId,
        address,
      });
    }

     //Send verification email (same as before, for all roles)
    const verifyUrl = `http://localhost:5000/api/auth/verify-email/${verificationToken}`;

    await sendEmail(
      user.email,
      "Verify your ResourceLoop account",
      `<h2>Welcome to ResourceLoop, ${name}!</h2>
       <p>Click the link below to verify your email:</p>
       <a href="${verifyUrl}">${verifyUrl}</a>
       <p>This link expires in 1 hour.</p>`
    );

    res.status(201).json({
      message: "User registered. Please check your email to verify account.",
      userId: user._id,
      role: finalRole,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @route  GET /api/auth/verify-email/:token
// @desc   Verify a user's email using the token sent to them
exports.verifyEmail = async (req, res) => {
  try{
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken:token,
      verificationTokenExpires: { $gt: Date.now() }, // token must not be expired
    });

    if(!user){
      return res.status(400).json({ message: "Invalid or expired verification link" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully! You can now log in." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @route  POST /api/auth/login
// @desc   Log in an existing user and return a JWT token
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user){
      // Same generic message whether email or password is wrong —
      // don't reveal which one was incorrect (security best practice)
    return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the plain-text password entered with the hashed password in DB
    const ismatch = await bcrypt.compare(password, user.password);
    if (!ismatch) return res.status(400).json({ message: "Invalid credentials" });

    //New:Block user if they haven't verified their email yet
    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in. Check your inbox for the verification link." });
    }


   //Generate both tokens
   const accessToken = generateAccessToken(user);
   const refreshToken = generateRefreshToken(user);

   //Save the refersh token on the user document
   //so we can verify/revoke it later
   user.refreshToken = refreshToken;
   await user.save();

    res.status(200).json({ accessToken,refreshToken, user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @route  POST /api/auth/forgot-password
// @desc   Send a password reset link to the user's email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal whether the email exists in the system (security best practice)
      //Prevents attackers from figuring out which emails are registred.
      return res.status(200).json({ message: "If that email is registered, a password reset link has been sent." });
    }
    //Generate a random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpires = Date.now() + 15*60*1000 // 15 minutes

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();
    
    const resetUrl= `http://localhost:5000/api/auth/reset-password/${resetToken}`;

    await sendEmail(
      user.email,
      "Reset your ResourceLoop Password",
      `<h2>Password Reset Request</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link expires in 15 minutes. If you didn't request this, ignore this email.</p>`
    );
    
    res.status(200).json({
      message : "If the email already exists, a password reset linkhas been sent."
    });
  } catch(error){
    res.status(500).json({message : error.message});
   }
  };


// @route  POST /api/auth/reset-password/:token
// @desc   Reset the user's password using a valid reset token
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;   //tokens comes from the url
    const { newPassword } = req.body;    //new password comes from the request body

    //Find a user with this exact token that hasn't expired yet
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // token must not be expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired password reset link" });
    }

    //hash the new password before saving-never store plain text
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    //clear the reset token so it can't be reused
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful! You can now log in with your new password." });
  } catch(error){
    res.status(500).json({ message: error.message });
  }
};


// @route  POST /api/auth/refresh-token
// @desc   Issue a new access token using a valid refresh token
exports.refreshToken = async(req,res) => {
  try{
    const{ refreshToken } = req.body;    //frontend sends the refresh token

    if (!refreshToken) {
      return res.status(401).json({message : "No refresh Token provided"});
    }

    //Verify that the refresh token is valid and not expired
    let decoded;
    try{
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch(error){
      return res.status(403).json({message: "Inavlid or expired refresh token" });
    }

    // Find the user and confirm this exact refresh token matches
    // what we saved at login (this lets us "revoke" tokens on logout)
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Refresh token not recognized" });
    }

    // Issue a brand new access token
    const newAccessToken = generateAccessToken(user);

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  POST /api/auth/logout
// @desc   Log the user out by invalidating their refresh token
exports.logout = async(req,res) => {
 try{
  const{ refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({message : "No refresh token provided."});
  }
  //Find one user with thi refresh token and clear it
  const user = await User.findOne({ refreshToken });
  if (user){
    user.refreshToken = undefined;
    await user.save();
  }
  res.status(200).json({message: "Logged out successfully."});
 } catch(error) {
  res.status(500).json({message: error.message});
 }
};
  

    
