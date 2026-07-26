const jwt = require("jsonwebtoken");

//Create a short-livedaccess token - used to authorize normal api request
const generateAccessToken = (user) => {
  return jwt.sign(
    {userId: user._id, role:user.role},
    process.env.JWT_SECRET,
    {expiresIn: "15m"} //short lifespan - minimizes risk if needed
  );
};

//Create a long-lived refresh token - used only to get a new access token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET, // different secret than access token
    { expiresIn: "30d" } // long lifespan — user stays logged in for a month
  );
};

module.exports = { generateAccessToken, generateRefreshToken };
