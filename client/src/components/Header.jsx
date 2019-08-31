import { Link } from "react-router-dom";
import React, { Component } from "react";

export default class Header extends Component {
  render() {
    return (
      <ul className="menu">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li onClick={this.handleLogInClick}>Login</li>
      </ul>
    );
  }

  handleLogInClick = () => {
    console.log("login!");
  };
}