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
          Home
        </a>
        <a class="item">
          Messages
        </a>
        <a class="item">
          Friends
        </a>
        <div class="right menu">
          <a class="ui item">
            Logout
          </a>
        </div>

      </div>
    </Sticky>
    // <ul className="menu">
    //   <li>
    //     <Link to="/">Home</Link>
    //   </li>
    //   <li>
    //     <Link to="/profile">Profile</Link>
    //   </li>
    //     {!state.isAuthenticated ? 
    //       <Link to="/login">Login</Link>
    //       :
    //       <button className="link" onClick={handleLogOutClick}>Logout</button>
    //     }
    // </ul>
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