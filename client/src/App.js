import React, { useEffect } from 'react';
import Header from "./components/Header";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Callback from "./components/Callback";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { useReducer } from "reinspect";

export const AuthContext = React.createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token
      };
    case "LOGINWITHSTOREDTOKEN":
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token
      };
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };
    case "SETUSER":
      return {
        ...state,
        user: action.payload.user
      };
    default:
      return state;
  }
};
function App() {
  // const [state, dispatch] = useReducer(reducer, initialState);
  const [state, dispatch] = useReducer(reducer, initialState, (state => state), "appReducer");
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch({
        type: "LOGINWITHSTOREDTOKEN",
        payload: {token: token}
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      <Router>
        <Header/>
        <div>
          <Route exact path="/" component={Home} />
          <PrivateRoute isAuthenticated={state.isAuthenticated} path="/profile" component={Profile} />
          <Route path="/login" component={Login} />
          <Route path="/callback" component={Callback} />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

function PrivateRoute({ component: Component, isAuthenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

export default App;
