import React from "react";
import { AuthContext } from "../App";
import { Redirect } from "react-router-dom";

function Login() {
  const { state } = React.useContext(AuthContext);

  const CLIENT_ID = "6e0b5f325ac2e324312c";
  const REDIRECT_URI = "http://127.0.0.1:3000/callback";

  const handleLogin = event => {
    event.preventDefault();
    window.open(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user&redirect_uri=${REDIRECT_URI}`, "_self");
  };

  return (
    <div className="login-container">
      {!state.isAuthenticated ?
        <div className="card">
          <div className="container">
              <h1>Login</h1>
              <button onClick={handleLogin}>
                Login with github
              </button>
          </div>
        </div>
        :
        <Redirect to="/" />
      }
    </div>
  );
}

export default Login;