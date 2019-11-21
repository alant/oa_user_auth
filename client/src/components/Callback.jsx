import React, { useEffect }  from "react";
import { AuthContext } from "../App";
import axios from 'axios';
import { useLocation } from "react-router-dom";
import queryString from 'query-string'
// import { useNavigation } from 'react-navigation-hooks'

function Callback(props) {
  const { dispatch, state } = React.useContext(AuthContext);
  const location = useLocation();
  // const { navigate } = useNavigation();

  useEffect(() => {
    const values = queryString.parse(location.search)
    console.log("===> call back values:", values);
    if (values.code) {
      // dispatch({
      //   type: "LOGIN",
      //   payload: {user: "abc", token: values.token}
      // });
      // props.history.push("/");
      axios.post('http://localhost:7000/login/github', JSON.stringify({
        code: values.code
      }), {
        headers: {
            'Content-Type': 'application/json',
        }
      })
      .then(function (response) {
        console.log("=> backend /login/github:", response);
        dispatch({
          type: "LOGIN",
          payload: {token: response.data.token}
        });
        props.history.push("/");
      })
      .catch(function (error) {
        console.log("=> backend error /login/github:", error);
      });
    }

    // async function fetchUser() {
    //   console.log("======>useEffect <=====");
    //   try {
    //     const res = await axios.get(
    //       'http://localhost:7000/auth/login/success', {
    //         withCredentials: true,
    //         headers: {
    //           'Authorization': 'Bearer ' + state.token,
    //           // Accept: "application/json",
    //           // "Content-Type": "application/json",
    //           "Access-Control-Allow-Credentials": true
    //         }
    //       }
    //     )
        
    //     console.log("======>return json: ", res);

    //     if (res.data.success) {
    //       // dispatch({
    //       //   type: "LOGIN",
    //       //   payload: {user: "abc", token: "def"}
    //       // });
          
    //     }

    //   } catch (error) {
    //     console.log("======>something went wrong trying to authenticateu <=====");
    //     console.log(error);
    //     // throw new Error("something went wrong trying to get authed user");
    //   }
    // }

    // if (state.isAuthenticated) {
    //   fetchUser();
    // }
  }, [props.history, state.token, state.isAuthenticated, dispatch, location]);

  return null;
}

export default Callback;