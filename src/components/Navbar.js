import React, { useRef } from 'react';
import { Outlet, Link } from "react-router-dom";
import { Navbar, Container, Nav, Offcanvas } from 'react-bootstrap';
import Logout from './Logout';

const NavigationBar = ({ loggedUser }) => {
  const offCanvasRef = useRef(null);

  const closeOffCanvas = () => {
    if(offCanvasRef.current.backdrop)
      offCanvasRef.current.backdrop.click();
  };

  return (
    <>
      {['md'].map((expand) => (
        <Navbar key={expand} bg="dark" variant="dark" expand={expand} className="mb3">
          <Container >
            <Navbar.Brand as={Link} to="/it-society">Bird Detector by IT Society</Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
              ref={offCanvasRef}
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  MyBirdie App
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-between flex-grow-1 pe-3">
                  <Nav>
                    <Nav.Link as={Link} to="/it-society" onClick={closeOffCanvas}></Nav.Link>
                    {loggedUser && (
                      <Nav.Link as={Link} to="mybirds" onClick={closeOffCanvas}>My Birds</Nav.Link>
                    )}
                  </Nav>
                  {loggedUser && (
                    <Nav>
                      <Nav.Link as="li"></Nav.Link>
                      <Nav.Link as="li">{loggedUser}</Nav.Link>
                      <Logout closeOff={closeOffCanvas}/>
                    </Nav>
                  )}
                  {!loggedUser && (
                    <Nav>
                      {/*<Nav.Link as={Link} to="login" onClick={closeOffCanvas}>Login / Sign Up</Nav.Link>*/}
                    </Nav>
                  )}
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
      <Outlet />
    </>
  )
}

export default NavigationBar;