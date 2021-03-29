import React from "react";
import { useHistory } from "react-router-dom";
import { authService } from "../fbase";
import { Navbar, Nav } from "react-bootstrap";

import "../css/navigation.css"

function Navigation(props) {
  const history = useHistory();
  const LogOut = () => {
    authService.signOut();
    history.push("/front");
  };
  return (
    <Navbar className="navbar" variant="light">
      <Navbar.Brand href="/ourNeighborFoodTruck/">우리동네</Navbar.Brand>
      {props.isLoggedIn ? (
        <Nav className="mr-auto">
          <Nav.Link href="/ourNeighborFoodTruck/home">Home</Nav.Link>
          <Nav.Link href="/ourNeighborFoodTruck/profile">Profile</Nav.Link>
          <Nav.Link
            href="/profile"
            onClick={() => {
              LogOut();
            }}
          >
            log out{" "}
          </Nav.Link>
        </Nav>
      ) : (
        <Nav className="mr-auto">
          <Nav.Link href="/home">Home</Nav.Link>
          <Nav.Link href="/auth">log in </Nav.Link>
        </Nav>
      )}
    </Navbar>
  );
}
export default Navigation;
