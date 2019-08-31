require('dotenv').config();
const express = require("express");
const app = express();
const port = 7000;
const cors = require("cors");
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser"); // parse cookie header

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
    callbackURL: "/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    console.log("======> twitterStrategy: " + JSON.stringify(profile._json));
    done(null, null);
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

app.get("/", (req, res) => {
  res.status(200).json({
    message: "oh hello",
    user: "alan"
  });
});

app.get("/oops", (req, res) => {
  res.status(200).json({
    message: "oh no, failed"
  });
});

app.get('/login/twitter',
  passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/oops' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout',
  function(req, res){
    req.session.destroy(function (err) {
      res.redirect('/');
    });
  });

app.listen(port, () => console.log(`Server is running on port ${port}!`));