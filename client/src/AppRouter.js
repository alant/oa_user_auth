import React from "react";
import Home from "./components/Home";
import Profile from "./components/Profile";
import { HashRouter as Router, Route } from "react-router-dom";

export const AppRouter = () => {
  return (
    <Router>
      <div>
        <Route exact path="/" component={Home} />
        <Route path="/profile" component={Profile} />
      </div>
    </Router>
  );
};