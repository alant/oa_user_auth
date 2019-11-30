require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser"); // parse cookie header
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
    // console.log("=> origin: ", origin);
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

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
// parse cookies
app.use(cookieParser());

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

app.post('/login/github', async (req, res) => {  
  const access_code = req.body.code;
  console.log("==> /login/github body:", req.body, "code: ", access_code);
  try {
    const atoken_resp = await axios.post('https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: req.body.code
      }
    );
    const parsed = queryString.parse(atoken_resp.data);
    console.log("=> parsed access_tokeng: ", parsed.access_token);
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
    
    let jwt_token = jwt.sign({ email: email_resp.data[0].email },
      process.env.JWT_SECRET, 
      { expiresIn: 30 * 24 * 60 * 60 }// expires in 30 days
    );
    res.json({
        token: jwt_token
    });

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
});

app.post('/login/facebook', async (req, res) => {  
  const access_token = req.body.access_token;
  console.log("==> /login/facebook body:", req.body, "token: ", access_token);
  let email;
  try {
    // exchange short term access token for a longlived token, get user's name and email, upsert, return jwt token
    const token_resp = await axios.get(`https://graph.facebook.com/${GRAPH_API_VERSION}/oauth/access_token`, {
      params: {
        grant_type: "fb_exchange_token",         
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        fb_exchange_token: access_token }
    });

    const longlived_token = token_resp.data.access_token;
    
    const user_resp = await axios.get(`https://graph.facebook.com/${GRAPH_API_VERSION}/me`, {
      params: {
        fields: "id, name, email, picture",
        access_token: longlived_token
      }
    });
    email = user_resp.data.email
    // console.log("==> /login/facebook resp:", user_resp);

    let profile = {
      email: user_resp.data.email,
      id: user_resp.data.id,
      name: user_resp.data.name,
      avatar_url: user_resp.data.picture.url
    };

    await User.upsertFacebookUser(access_token, profile);
  } catch (err) {
    console.log("====> facebook err: ", err);
    res.status(500).send({ auth: false, message: 'Failed to auth through facebook.' });
  }

  let jwt_token = jwt.sign({ email: email },
    process.env.JWT_SECRET, 
    { expiresIn: 30 * 24 * 60 * 60 }// expires in 30 days
  );
  res.json({
      token: jwt_token
  });
});

app.get('/logout', (req, res) => {
  req.session = null;
  // res.redirect(CLIENT_HOME_PAGE_URL);
});

app.listen(port, () => console.log(`Server is running on port ${port}!`));