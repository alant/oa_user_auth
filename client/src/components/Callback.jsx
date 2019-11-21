import React, { useEffect }  from "react";
import { AuthContext } from "../App";
import axios from 'axios';
import { useLocation } from "react-router-dom";
import queryString from 'query-string'

function Callback(props) {
  const { dispatch, state } = React.useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    const values = queryString.parse(location.search)
    console.log("===> call back values:", values);
    if (values.code) {
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
  }, [dispatch, location]);

  return null;
}

export default Callback;