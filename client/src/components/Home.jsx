import React, { useEffect }  from "react";
import { AuthContext } from "../App";
import axios from 'axios';
import { useLocation } from "react-router-dom";
import queryString from 'query-string'
// import { useNavigation } from 'react-navigation-hooks'

function Home(props) {
  const { dispatch, state } = React.useContext(AuthContext);
  const location = useLocation();
  // const { navigate } = useNavigation();

  useEffect(() => {
    const values = queryString.parse(location.search)
    console.log("===> values:", values);
    if (values.token) {
      dispatch({
        type: "LOGIN",
        payload: {user: "abc", token: values.token}
      });
      props.history.push("/");
    }

    async function fetchUser() {
      console.log("======>useEffect <=====");
      try {
        const res = await axios.get(
          'http://localhost:7000/auth/login/success', {
            withCredentials: true,
            headers: {
              'Authorization': 'Bearer ' + state.token,
              // Accept: "application/json",
              // "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true
            }
          }
        )
        
        console.log("======>return json: ", res);

        if (res.data.success) {
          // dispatch({
          //   type: "LOGIN",
          //   payload: {user: "abc", token: "def"}
          // });
          
        }

      } catch (error) {
        console.log("======>something went wrong trying to authenticateu <=====");
        console.log(error);
        // throw new Error("something went wrong trying to get authed user");
      }
    }
    fetchUser();
  }, [props.history, state.token, dispatch, location]);

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