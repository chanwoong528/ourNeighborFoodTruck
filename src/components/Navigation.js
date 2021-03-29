import React from "react";
import { useHistory } from "react-router-dom";
import { authService } from "../fbase";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

import "../css/navigation.css"

function Navigation(props) {
  const history = useHistory();
  const LogOut = () => {
    authService.signOut();
    history.push("/");
  };
  return (
    <Navbar className="navbar" variant="light">
      <Navbar.Brand as={Link} to="/">우리동네</Navbar.Brand>
      {props.isLoggedIn ? (
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/home">Home</Nav.Link>
          <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
          <Nav.Link as={Link}
            to="/profile"
            onClick={() => {
              LogOut();
            }}
          >
            log out
          </Nav.Link>
        </Nav>
      ) : (
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/home">Home</Nav.Link>
          <Nav.Link as={Link} to="/auth">log in </Nav.Link>
        </Nav>
      )}
    </Navbar>
  );
}
export default Navigation;
