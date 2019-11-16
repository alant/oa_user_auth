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

  const handleLogin = event => {
    event.preventDefault();
    window.open("http://localhost:7000/auth/github", "_self");
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