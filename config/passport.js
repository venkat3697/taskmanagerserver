// config/passport.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Make sure to define User schema with googleId, email, etc.

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://taskmanagerserver-5c0t.onrender.com/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        //Check if user exists
        let user = await User.findOne({ userid: profile.id });
        if (!user) {
          // Create a new user if not found
          user = await new User({
            userid: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
          }).save();
        }
        done(null, profile);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

// Serialize user instance to store user in session
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
