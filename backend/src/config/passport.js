const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

// This function runs whenever someone completes Google login.
// Google gives us their profile info here — we decide what to do with it.
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // profile contains the user's Google info: id, displayName, emails, etc.
        const email = profile.emails[0].value;

        // Check if a user with this email already exists in our database
        let user = await User.findOne({ email });

        if (!user) {
          // No existing account — create a new one automatically.
          // Note: no password is set here, since Google handles authentication
          // for this user going forward, not our own login system.
          user = await User.create({
            name: profile.displayName,
            email,
            role: "individual",
            isVerified: true, // Google already verified this email for us
            authProvider: "google",
          });
        }

        // Pass the found/created user along to the next step
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

module.exports = passport;