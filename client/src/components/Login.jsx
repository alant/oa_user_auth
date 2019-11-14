import React from "react";
import { AuthContext } from "../App";

function Login() {
  const { dispatch } = React.useContext(AuthContext);
  // const [data, setData] = React.useState(initialState);
  // const initialState = {
  //   email: "",
  //   password: "",
  //   // isSubmitting: false,
  //   // errorMessage: null
  // };

  const handleFormSubmit = event => {
    event.preventDefault();
    // setData({
    //   ...data,
    //   // isSubmitting: true,
    //   // errorMessage: null
    // });
    dispatch({
        type: "LOGIN",
        payload: {user: "abc", token: "def"}
    });
  };

  return (
    <div className="login-container">
      <div className="card">
        <div className="container">
          <form onSubmit={handleFormSubmit}>
            <h1>Login</h1>
			
    		    <label htmlFor="email">
              Email Address
              <input
                type="text"
                name="email"
                id="email"
              />
            </label>
			
    		    <label htmlFor="password">
              Password
              <input
                type="password"
                name="password"
                id="password"
              />
            </label>
			
            <button>
              Login
            </button>
          
    	    </form>
        </div>
      </div>
    </div>
  );
}

export default Login;