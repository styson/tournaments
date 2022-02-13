import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';

const Header = () => (
  <header>
    <Navbar expand="lg" fixed="top" bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Brand href="/">Tournament Director</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/tournaments">Tournaments</Nav.Link>
            <Nav.Link href="/scenarios">Scenarios</Nav.Link>
            <Nav.Link href="/players">Players</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Authenticator>
          {({ signOut, user }) => (
            <Button
              size='sm'
              variant='outline-secondary'
              onClick={signOut}
            >Sign Out</Button>
          )}
        </Authenticator>
      </Container>
    </Navbar>
  </header>
);

export default Header;