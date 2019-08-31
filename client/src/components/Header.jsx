import { Link } from "react-router-dom";
import React, { Component } from "react";
import axios from 'axios'

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
    console.log("env: " + process.env.REACT_APP_API_URL);
    axios.get(process.env.REACT_APP_API_URL + "/").then(
      response => console.log(response));
  };
}