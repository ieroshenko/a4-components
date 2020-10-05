const mongoose = require("mongoose");
const User = require("./models/User");

const GitHubStrategy = require("passport-github2").Strategy;

module.exports = function(passport) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "https://a4-ivan-eroshenko.herokuapp.com/auth/github/callback"
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {githubId: profile.id, username: profile.username};

        try {
            let user = await User.findOne({githubId: profile.id})

            if (user) {
              done(null, user);
            } else {
              user = await User.create(newUser)
              done(null, user);
            }
        } catch (e) {
          console.log(e);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
