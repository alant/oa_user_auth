import React, { Component } from "react";

export default class Home extends Component {
  state = {
    user: {},
    loggedIn: false
  };

  render() {
    const { loggedIn } = this.state;
    return (
      <div>
        {loggedIn ? (
          <div>
            <h2>Hello {this.state.user.name}!</h2>
          </div>
        ) : (
          <h1>Welcome!</h1>
        )}
      </div>
    );
  }

}