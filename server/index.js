require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require('./mongoose');
mongoose();
const User = require('mongoose').model('User');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const bodyParser = require('body-parser');
const queryString = require('query-string');

const port = 7000;
const GRAPH_API_VERSION = "v5.0";

const cors_whitelist = [
  process.env.APP_URL,
  process.env.APP_URL2,
  process.env.APP_URL3
];
const corsOptions = {
  origin: function (origin, callback) {
      if (cors_whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
  },
  credentials: true,
  enablePreflight: true
}

app.use(cors(corsOptions))
app.options("*", cors(corsOptions))

const authCheck = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
    if (err) {
      console.log("==> jwt error: ", err);
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    req.decoded = decoded;
    next();
  });
};

app.get("/profile", authCheck, async (req, res) => {
  // console.log("==> /profile req.decoded: ", req.decoded);
  const profile = await User.findUser(req.decoded.email);
  res.json({
    user: profile
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const loginWithGithub = async (req, res, next) => {
  try {
    const atoken_resp = await axios.post('https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: req.body.code
      }
    );
    const parsed = queryString.parse(atoken_resp.data);
    const access_token = parsed.access_token;

    const user_resp = await axios.get('https://api.github.com/user', {
      headers: {
        'Authorization': "bearer " + access_token,
        'User-Agent': 'smartshoppinglist'
      }
    });

    const email_resp = await axios.get('https://api.github.com/user/public_emails', {
      headers: {
        'Authorization': "bearer " + access_token,
        'User-Agent': 'smartshoppinglist'
      }
    });
    req.email = email_resp.data[0].email;
    let profile = {
      email: email_resp.data[0].email,
      id: user_resp.data.id,
      name: user_resp.data.name,
      avatar_url: user_resp.data.avatar_url
    };

    await User.upsertGithubUser(access_token, profile);
  } catch (err) {
    console.log("====> github err: ", err);
    res.status(500).send({ auth: false, message: 'Failed to auth through github.' });
  }

  next();
}

const issueJwt = function (req, res, next) {
  let jwt_token = jwt.sign({ email: req.email },
    process.env.JWT_SECRET, 
    { expiresIn: 30 * 24 * 60 * 60 }// expires in 30 days
  );
  res.json({
    token: jwt_token
  });
  next();
}

app.post('/login/github', loginWithGithub, issueJwt, (req, res) => {});

const loginWithFacebook = async (req, res, next) => {
  try {
    // exchange short term access token for a longlived token, get user's name and email, upsert, return jwt token
    const token_resp = await axios.get(`https://graph.facebook.com/${GRAPH_API_VERSION}/oauth/access_token`, {
      params: {
        grant_type: "fb_exchange_token",         
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        fb_exchange_token: req.body.access_token }
    });

    const longlived_token = token_resp.data.access_token;
    
    const user_resp = await axios.get(`https://graph.facebook.com/${GRAPH_API_VERSION}/me`, {
      params: {
        fields: "id, name, email, picture",
        access_token: longlived_token
      }
    });
    req.email = user_resp.data.email
    // console.log("==> /login/facebook resp:", user_resp.data);
    let profile = {
      email: user_resp.data.email,
      id: user_resp.data.id,
      name: user_resp.data.name,
      avatar_url: user_resp.data.picture.data.url
    };

    await User.upsertFacebookUser(longlived_token, profile);
  } catch (err) {
    console.log("====> facebook err: ", err);
    res.status(500).send({ auth: false, message: 'Failed to auth through facebook.' });
  }
  next();
}

app.post('/login/facebook', loginWithFacebook, issueJwt, (req, res) => {});

app.listen(port, () => console.log(`Server is running on port ${port}!`));