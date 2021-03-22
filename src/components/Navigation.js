import React from "react";
import { Link } from "react-router-dom";


import  "../css/navigation.css";


function Navigation() {
  return (
    <nav className ="nav-main">
      <ul>
        <Link to="/home">
          {" "}
          <li>Map</li>
        </Link>
        <Link to="/">
          {" "}
          <li>Front</li>
        </Link>
        <Link to="/profile">
          {" "}
          <li>Profile</li>
        </Link>
      </ul>
    </nav>
  );
}
export default Navigation;
