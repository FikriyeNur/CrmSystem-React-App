import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface NavigationBarProps {
  isLoggedIn: boolean;
  username?: string;
  onLogout: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ isLoggedIn, username, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();      // state ve localStorage temizlenir
    navigate('/');   // logout sonrası ana sayfaya yönlendir
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="mb-4">
      <Container>
        <Navbar.Brand>Crm System</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate('/')}>Home</Nav.Link>
            <Nav.Link onClick={() => navigate('/customers')}>Customers</Nav.Link>
            {isLoggedIn && <Nav.Link onClick={() => navigate('/profile')}>Profile</Nav.Link>}
          </Nav>
          <Nav className="ms-auto align-items-center">
            {!isLoggedIn ? (
              <Button variant="success" onClick={() => navigate('/login')}>
                Login
              </Button>
            ) : (
              <>
                <span className="text-white me-3">Hello, <strong>{username || 'User'}</strong></span>
                <Button variant="success" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
