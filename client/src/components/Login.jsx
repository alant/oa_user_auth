import React, { useEffect } from "react";
import { AuthContext } from "../App";
import { Redirect } from "react-router-dom";
import { Grid } from 'semantic-ui-react';
// import axios from 'axios';

function Login() {
  const { state } = React.useContext(AuthContext);

  const GITHUB_CLIENT_ID = "6e0b5f325ac2e324312c";
  const GITHUB_REDIRECT_URI = process.env.REACT_APP_APP_URL + "/callback";

  // const TWITTER_CLIENT_ID = "6e0b5f325ac2e324312c";
  // const TWITTER_REDIRECT_URI = "http://127.0.0.1:3000/callback";

  const handleGithubLogin = event => {
    event.preventDefault();
    window.open(`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user&redirect_uri=${GITHUB_REDIRECT_URI}`, "_self");
  };

  const statusChangeCallback = (response) => {
    console.log('statusChangeCallback');
    console.log(response);
    if (response.status === 'connected') {
      console.log('Welcome!  Fetching your information.... ');
      window.FB.api('/me', function(response) {
        console.log('Successful login for: ' + response.name);
      });
    } else if (response.status === 'not_authorized') {
      console.log("Please log into this app.");
    } else {
      console.log("Please log into this facebook.");
    }
  };

  const checkFBLoginState = () => {
    window.FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  const handleFacebookLogin = async (event) => {
    event.preventDefault();
    window.FB.login(checkFBLoginState());
  };

  const initFBSDK = () => {
    window.fbAsyncInit = function() {
      window.FB.init({
        appId            : '1668438256731685',
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v5.0'
      });
    };

    console.log("Loading fb api");

    (function(d, s, id) {
      var js, fjs=d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js=d.createElement(s); js.id=id;
      js.src="//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, "script", "facebook-jssdk"));
  };

  useEffect(() => {
    initFBSDK();
  });

  return (
    <div className="login-container">
      {!state.isAuthenticated ?
        <div className="card">
          <div className="container">
            <h1>Login</h1>
            <Grid>
              <Grid.Row>
                <Grid.Column>
                  <button onClick={handleGithubLogin}>
                    Login with Github
                  </button>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <button onClick={handleFacebookLogin}>
                    Login with Facebook
                  </button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        </div>
        :
        <Redirect to="/" />
      }
    </div>
  );
}

export default Login;