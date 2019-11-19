import { Link } from "react-router-dom";
import React from "react";
import { AuthContext } from "../App";
import { Sticky } from 'semantic-ui-react';

function Header() {
  const { dispatch, state } = React.useContext(AuthContext);

  return (
    <Sticky>
      <div class="ui secondary pointing menu">
        <a class="item">
          <Link to="/">Home</Link>
        </a>
        <a class="item">
          <Link to="/profile">Profile</Link>
        </a>        
        <div class="right menu">
          <a class="ui item">
            {!state.isAuthenticated ? 
              <Link to="/login">Login</Link>
              :
              <a className="link" onClick={handleLogOutClick}>Logout</a>
            }
          </a>
        </div>
      </div>
    </Sticky>
  );

  function handleLogOutClick() {
    dispatch({
      type: "LOGOUT"
    });
  }
  // handleLogInClick = () => {
  //   window.open(process.env.REACT_APP_API_URL + "/login/github", "_self");
  //   // console.log("env: " + process.env.REACT_APP_API_URL);
  //   // axios.get(process.env.REACT_APP_API_URL + "/").then(
  //   //   response => console.log(response));
  // };
}

export default Header;