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
const request = require('request');
var jwt = require('jsonwebtoken');

mongoose();
const User = require('mongoose').model('User');

const CLIENT_HOME_PAGE_URL = "http://localhost:3000";
const SERVER_URL = "http://127.0.0.1:7000";

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
    callbackURL: SERVER_URL + "/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // console.log("======> GitHubStrategy: " + JSON.stringify(profile._json));
    User.upsertGithubUser(accessToken, refreshToken, profile, function(err, user) {
        return done(err, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  console.log('====> serializeUser: ' + user);
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  console.log('====> deserializeUser 1/2: ' + id);
  User.findById(id).then((user) => {
    console.log('====> deserializeUser 2/2: ' + user);
    done(null, user);
  });
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

app.use("/auth", router);

const authCheck = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }
  console.log("==> token: ", token);
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    console.log("==> decoded: ", decoded);
    next();
  });

  // if (!req.user) {
  //   res.status(401).json({
  //     authenticated: false,
  //     message: "user has not been authenticated"
  //   });
  // } else {
  //   next();
  // }
};

// when login is successful, retrieve user info
router.get("/login/success", authCheck, (req, res) => {
  // console.log("==> /login/success: ", req);
  // if (req.user) {
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: "abc",
      token: "def"
    });
  // }
});

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
    failureRedirect: '/oops' 
  }), 
  async function(req, res) {
    // const user = await User.findOne({_id: req.user._id}, {githubProvider: 1});
    // console.log("===> user: ", user);
    // const access_token = user.githubProvider.token;
    // console.log("===> access_token: ", access_token);
    // request.get(
    //   {
    //     url: 'https://api.github.com/user/public_emails',
    //     headers: {
    //       Authorization: 'token ' + access_token,
    //       'User-Agent': 'smartshoppinglist'
    //     }
    //   },
    //   (error, response, body) => {
    //     console.log("===> body: ", body);
    //   }
    // );
    var token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET, 
      { expiresIn: 30 * 24 * 60 * 60 }// expires in 24 hours
    );
    res.redirect(CLIENT_HOME_PAGE_URL+ "/#/?token=" + token);
    // res.json({
    //   success: true,
    //   message: "user has successfully authenticated",
    //   user: "abc",
    //   token: token
    // });
  }
  
);

app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect(CLIENT_HOME_PAGE_URL);
});

app.listen(port, () => console.log(`Server is running on port ${port}!`));