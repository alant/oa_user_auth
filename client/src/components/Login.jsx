import React from "react";
import { AuthContext } from "../App";
import { Redirect } from "react-router-dom";

function Login() {
  const { state } = React.useContext(AuthContext);
  // const [data, setData] = React.useState(initialState);
  // const initialState = {
  //   email: "",
  //   password: "",
  //   // isSubmitting: false,
  //   // errorMessage: null
  // };

  const CLIENT_ID = "6e0b5f325ac2e324312c";
  const REDIRECT_URI = "http://127.0.0.1:3000/callback";

  const handleLogin = event => {
    event.preventDefault();
    window.open(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user&redirect_uri=${REDIRECT_URI}`, "_self");

    // fetch('http://localhost:7000/auth/github', {
    //   method: 'GET',
    //   // body: JSON.stringify(this.state),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })
    // .then(res => {
    //   // if (res.status === 200) {
    //   //   this.props.history.push('/');
    //   //   console.log()
    //   // } else {
    //   //   const error = new Error(res.error);
    //   //   throw error;
    //   // }
    //   console.log("==> login success: ", res);
    // })
    // .catch(err => {
    //   console.error(err);
    //   alert('Error logging in please try again');
    // });
    
    // setData({
    //   ...data,
    //   // isSubmitting: true,
    //   // errorMessage: null
    // });
    // dispatch({
    //     type: "LOGIN",
    //     payload: {user: "abc", token: "def"}
    // });
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