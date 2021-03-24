import React from "react";
import { Link, useHistory } from "react-router-dom";
import { authService } from "../fbase";

import "../css/navigation.css";

function Navigation() {
  const history = useHistory();
  const LogOut = () => {
    authService.signOut();
    history.push("/");
  };
  return (
    <nav className="nav-main">
      <ul>
        <Link to="/home">
          <li>Map</li>
        </Link>
        <Link to="/">
          <li>Front</li>
        </Link>
        <Link to="/profile">
          <li>Profile</li>
        </Link>
        <Link to="/auth">
          <li
            onClick={() => {
              LogOut();
            }}
          >
            log out
          </li>
        </Link>
      </ul>
    </nav>
  );
}
export default Navigation;
