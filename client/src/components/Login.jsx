import React from "react";
import { AuthContext } from "../App";
import { Redirect } from "react-router-dom";
import { Grid } from 'semantic-ui-react';

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

  const handleTwitterLogin = event => {
    event.preventDefault();
    console.log("twitter login");
  };

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
                  <button onClick={handleTwitterLogin}>
                    Login with Twitter
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