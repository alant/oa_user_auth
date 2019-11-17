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