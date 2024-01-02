const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/authController");
const checkLogin = require("../../config/CheckLogin");
const passport = require("passport");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./scratch");

var GitHubStrategy = require("passport-github").Strategy;

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      cb(null, profile);
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Retrieve user information from MongoDB based on the stored id
  User.findOne({ providerId: id })
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err);
    });
});

router.get("/github", passport.authenticate("github"));

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    localStorage.setItem("providerId", req.user.id);
    User.findOne({ providerId: req.user.id }).then((user, err) => {
      if (!user) {
        return User.create({
          username: req.user.username,
          fullname: req.user.displayName,
          location: req.user._json.location,
          email: req.user._json.email,
          profilePhoto: req.user._json.avatar_url,
          provider: req.user.provider,
          providerId: req.user.id,
          role: "User",
          phone: "",
          password: "",
          gender: "",
        }).then((user, err) => {
          res.status(200).redirect("/home");
        });
      } else {
        req.session.user = user;
        res.status(200).redirect("/home");
      }
    });
  }
);

router.get("/login", Controller.getLogin);
router.post("/login", Controller.postLoginAccount);

router.get("/register", Controller.getRegister);
router.post("/register", Controller.postRegister);

router.get("/ForgotPassword", checkLogin, Controller.getForgotPassword);
router.post("/ForgotPassword", checkLogin, Controller.postForgotPassword);

router.get("/logout", checkLogin, Controller.getLogout);

module.exports = router;
