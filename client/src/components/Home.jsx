import React, { useEffect }  from "react";
import { AuthContext } from "../App";
import axios from 'axios';

function Home() {
  const { dispatch, state } = React.useContext(AuthContext);
  useEffect(() => {
    async function fetchUser() {
      console.log("======>useEffect <=====");
      try {
        const res = await axios.get(
          'http://localhost:7000/auth/login/success', {
            withCredentials: true,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true
            }
          }
        )
        
        console.log("======>return json <=====");
        console.log(res);

        dispatch({
          type: "LOGIN",
          payload: {user: "abc", token: "def"}
        });
      } catch (error) {
        console.log("======>something went wrong trying to authenticateu <=====");
        console.log(error);
        // throw new Error("something went wrong trying to get authed user");
      }
    }
    fetchUser();

    // .then(res => {
    //   console.log("======>return json <=====");
    //   return res.json();
    // })
    // .then(responseJson => {
    //   console.log("======> did not respond with correct object <=====");
    //   dispatch({
    //     type: "LOGIN",
    //     payload: {user: responseJson.user, token: "def"}
    //   });
    // })
    // .catch(err => { /* not hit since no 401 */ 
    //   console.log("======>something went wrong trying to authenticateu <=====");
    //   throw new Error("something went wrong trying to authenticate user");
    // });

  //   fetch("http://localhost:7000/auth/login/success", {
  //     method: "GET",
  //     credentials: "include",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //       "Access-Control-Allow-Credentials": true
  //     }
  //   })
  //   .then(response => {
  //     console.log("======>return json <=====");
  //     if (response.status === 200) return response.json();
  //     // throw new Error("failed to authenticate user");
  //   })
  //   .then(responseJson => {
  //     console.log("======> did not respond with correct object <=====");
  //     dispatch({
  //       type: "LOGIN",
  //       payload: {user: responseJson.user, token: "def"}
  //     });
  //   })
  //   .catch(error => {
  //     console.log("======>something went wrong trying to authenticateu <=====");
  //     throw new Error("something went wrong trying to authenticate user");
  //   });

  }, [dispatch]);

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