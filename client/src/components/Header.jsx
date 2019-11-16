import { Link } from "react-router-dom";
import React from "react";
import { AuthContext } from "../App";

function Header() {
  const { dispatch, state } = React.useContext(AuthContext);

  return (
    <ul className="menu">
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/profile">Profile</Link>
      </li>
        {!state.isAuthenticated ? 
          <Link to="/login">Login</Link>
          :
          <button className="link" onClick={handleLogOutClick}>Logout</button>
        }
    </ul>
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