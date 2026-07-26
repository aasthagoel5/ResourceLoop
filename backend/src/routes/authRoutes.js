const express = require("express");
const router = express.Router();
const { register, login, verifyEmail , forgotPassword, resetPassword, refreshToken, logout  } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

// POST /api/auth/register -> calls register controller
router.post("/register", register);

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

module.exports = router;
