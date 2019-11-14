import React from "react";

function Login() {
  return (
    <div className="login-container">
      <div className="card">
        <div className="container">
          <form>
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