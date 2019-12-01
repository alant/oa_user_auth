import React, { useEffect }  from "react";
import { AuthContext } from "../App";
import axios from 'axios';
import { useLocation } from "react-router-dom";
import queryString from 'query-string'

function Callback(props) {
  const { dispatch } = React.useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    async function exchangeToken() {
      try {
        const resp = await axios.post('http://localhost:7000/login/github', JSON.stringify({
          code: values.code
        }), {
          headers: {
              'Content-Type': 'application/json',
          }
        });
        dispatch({
          type: "LOGIN",
          payload: { token: resp.data.token }
        });
        props.history.push("/");
      } catch (error) {
        console.log("=> backend error /login/github:", error);
        throw error;
      }
    }

    const values = queryString.parse(location.search)
    if (values.code) {
      exchangeToken();
    }
  }, [dispatch, location, props.history]);

  return null;
}

export default Callback;