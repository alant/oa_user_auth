import { Link } from "react-router-dom";
import React from "react";
import { AuthContext } from "../App";
import { Menu, Sticky } from 'semantic-ui-react';

function Header() {
  const { dispatch, state } = React.useContext(AuthContext);

  return (
    <Sticky>
      <Menu secondary>
        <Menu.Item name='home' as={Link} to='/'>Home</Menu.Item>
        <Menu.Item name='profile' as={Link} to='/profile'>Profile</Menu.Item>
          <Menu.Menu position='right'>
            {!state.isAuthenticated ? 
              <Menu.Item name='login' as={Link} to='/login'>Login</Menu.Item>
              :
              <Menu.Item name='logout' onClick={handleLogOutClick}>Logout</Menu.Item>
            }
          </Menu.Menu>
      </Menu>
    </Sticky>
  );

  function handleLogOutClick() {
    dispatch({
      type: "LOGOUT"
    });
  }
}

export default Header;