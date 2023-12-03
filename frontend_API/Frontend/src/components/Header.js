import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {  Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import './styles.css'


function Header() {
  const headerStyle = {
    backgroundColor: '#3498db', // Warna latar belakang header
    padding: '1px', // Padding untuk memberi ruang di sekitar teks
    borderBottom: '1px solid #2c3e50', // Garis bawah header
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Bayangan header
  };
  

  return (
    <Navbar expand="lg" style={headerStyle} className="custom-navbar">
  <Container>
    <Link to="/v1/book" className="navbar-brand">
      <h3>Database</h3>
    </Link>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="me-auto">
        {/* Tambahkan menu atau item navigasi di sini */}
      </Nav>
      <Nav className="ms-auto">
        <LogoutButton />
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>

  );
}




export default Header;