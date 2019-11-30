import React, { useEffect } from "react";
import { AuthContext } from "../App";
import { Redirect } from "react-router-dom";
import { Grid } from 'semantic-ui-react';
import axios from 'axios';

function Login(props) {
  const { state, dispatch } = React.useContext(AuthContext);

  const GITHUB_CLIENT_ID = "6e0b5f325ac2e324312c";
  const GITHUB_REDIRECT_URI = process.env.REACT_APP_APP_URL + "/callback";

  const FACEBOOK_APP_ID = "1668438256731685";

  const handleGithubLogin = event => {
    event.preventDefault();
    window.open(`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user&redirect_uri=${GITHUB_REDIRECT_URI}`, "_self");
  }

  const exchangeFBtokenWithJWT = async (token) => {
    try {
      const resp = await axios.post('http://localhost:7000/login/facebook',
        JSON.stringify({ access_token: token }), {
          headers: { 'Content-Type': 'application/json',}
        }
      );
      dispatch({
        type: "LOGIN",
        payload: {token: resp.data.token, method: "FACEBOOK"}
      });
      props.history.push("/");
    } catch(error) {
      console.log("=> backend error /login/facebook:", error);
      window.FB.logout((function(response) {}));
    }
  }

  const handleFacebookLogin = (event) => {
    event.preventDefault();
    window.FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        exchangeFBtokenWithJWT(response.authResponse.accessToken);
      } else {
        window.FB.login(function(response) {
          if (response.status === 'connected') {
            exchangeFBtokenWithJWT(response.authResponse.accessToken);
          }
        }, {scope: 'public_profile,email'});
      }
    });  
  };

  const initFB = () => {
    window.fbAsyncInit = function() {
      window.FB.init({
        appId            : FACEBOOK_APP_ID,
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v5.0'
      });
    };
    (function(d, s, id) {
      var js, fjs=d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js=d.createElement(s); js.id=id;
      js.src="//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, "script", "facebook-jssdk"));
  };

  useEffect(() => {
    if (!window.FB) {
      initFB();
    }
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