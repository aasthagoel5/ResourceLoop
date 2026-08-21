const express = require("express");
const router = express.Router();
const { register, login, verifyEmail , forgotPassword, resetPassword, refreshToken, logout  } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const passport = require("../config/passport");
const {generateAccessToken, generateRefreshToken } = require("../utils/generateTokens");
const { uploadDocument } = require("../middleware/upload");

// POST /api/auth/register -> calls register controller
router.post("/register", uploadDocument.single("document"), register);

// POST /api/auth/login -> calls login controller
router.post("/login", login);

// GET /api/auth/verify-email/:token -> calls verifyEmail controller
router.get("/verify-email/:token", verifyEmail);

//POST /api/auth/forgot-password/:token -> 
router.post("/forgot-password", forgotPassword);

//POST /api/auth/reset-password/:token ->
router.post("/reset-password/:token", resetPassword);

router.post("/logout", logout);

router.post("/refresh-token", refreshToken);

// TEST ROUTE — only accessible with a valid token
// "protect" runs first; if it calls next(), this function runs
router.get("/profile", protect, (req, res) => {
  // req.user was set inside the middleware after verifying the token
  res.status(200).json({
    message: "You accessed a protected route!",
    user: req.user, // contains { userId, role, iat, exp }
  });
});



// @route  GET /api/auth/google
// @desc   Starts the Google login flow — redirects user to Google's login page
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

// @route  GET /api/auth/google/callback
// @desc   Google redirects here after the user approves login
router.get(
  "/google/callback",
  passport.authenticate("google",{ session:false, failureRedirect:"/login-failed" }),
  async ( req, res ) => {
    try{
      // At this point, req.user is the User document Passport found/created
      const user = req.user;

      // Generate our own JWT tokens, exactly like normal login
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      user.refreshToken = refreshToken;
      await user.save();

      // For now (no frontend yet), just show the tokens as JSON.
      // Later, once React exists, this would redirect to your frontend
      // with the tokens attached, e.g.:
      // res.redirect(`http://localhost:3000/oauth-success?accessToken=${accessToken}&refreshToken=${refreshToken}`
      res.redirect(
        `${process.env.FRONTEND_URL || "http://localhost:5173"}/oauth-success?accessToken=${accessToken}&refreshToken=${refreshToken}`
      );
    } catch (error) {
      res.redirect(`http://localhost:5173/login?error=oauth_failed`);
    }

    }
);

module.exports = router;