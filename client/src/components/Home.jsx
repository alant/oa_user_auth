import React, { useEffect }  from "react";
import { AuthContext } from "../App";
import axios from 'axios';
// import { useLocation } from "react-router-dom";

function Home() {
  const { dispatch, state } = React.useContext(AuthContext);
  // const location = useLocation();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get('http://localhost:7000/profile', {
            withCredentials: true,
            headers: {
              'Authorization': 'Bearer ' + state.token,
              "Access-Control-Allow-Credentials": true
            }
        });
        dispatch({
          type: "SETUSER",
          payload: {user: res.data.user.name}
        });
      } catch (error) {
        console.log("======>something went wrong trying to get profile: <=====", error);
        dispatch({ type: "LOGOUT" });
      }
    }
    if (state.isAuthenticated) {
      fetchUser();
    }
  }, [state.token, state.isAuthenticated, dispatch]);

  return (
    <div>
      {state.isAuthenticated ? (
        <div>
          <h2>Hello {state.user}!</h2>
        </div>
      ) : (
        <h1>Welcome!</h1>
      )}
    </div>
  );
  }

export default Home;