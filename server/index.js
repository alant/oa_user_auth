require('dotenv').config();
const express = require("express");
const app = express();
const port = 7000;
const cors = require("cors");
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser"); // parse cookie header
const mongoose = require('./mongoose');
const router = require("express").Router();

mongoose();
const User = require('mongoose').model('User');

const CLIENT_HOME_PAGE_URL = "http://localhost:3000";

app.use(
  cors({
    origin: process.env.APP_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
  })
);

console.log("twitter keys: " + process.env.TWITTER_CONSUMER_KEY + ", " + process.env.TWITTER_CONSUMER_SECRET);

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    includeEmail: true,
    callbackURL: "/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    console.log("======> twitterStrategy: " + JSON.stringify(profile._json));
    User.upsertTwitterUser(token, tokenSecret, profile, function(err, user) {
        return done(err, user);
      });
    // done(null, null);
  }
));

console.log("github keys: " + process.env.GITHUB_CLIENT_ID + ", " + process.env.GITHUB_CLIENT_SECRET);

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    scope: 'user:email',
    // callbackURL: "/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log("======> GitHubStrategy: " + JSON.stringify(profile._json));
    User.upsertGithubUser(accessToken, refreshToken, profile, function(err, user) {
        return cb(err, user);
    });
  }
));

passport.serializeUser(function(user, cb) {
  console.log('====> serializeUser: ' + user._id)
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
// parse cookies
app.use(cookieParser());

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// when login is successful, retrieve user info
router.get("/login/success", (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      cookies: req.cookies
    });
  }
});

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      authenticated: false,
      message: "user has not been authenticated"
    });
  } else {
    next();
  }
};

app.get("/", authCheck, (req, res) => {
  res.status(200).json({
    authenticated: true,
    message: "oh yea, user successfully authenticated",
    user: req.user,
    cookies: req.cookies
  });
});

app.get("/oops", (req, res) => {
  res.status(401).json({
    success: false,
    message: "oh no, auth failed"
  });
});

app.get('/login/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter'));

app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback',
  passport.authenticate('github', { 
    // successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: '/oops' , 
        function(req, res) {
        const token = req.user.token;
        res.redirect(CLIENT_HOME_PAGE_URL + "?token=" + token);
    }
  })
);

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect(CLIENT_HOME_PAGE_URL);
  });
});

app.listen(port, () => console.log(`Server is running on port ${port}!`));