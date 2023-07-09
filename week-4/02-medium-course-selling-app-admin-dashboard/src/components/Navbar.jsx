import React, { useEffect } from "react";
import { Navbar, Container, Nav, NavLink, Button, NavbarBrand } from "react-bootstrap";
import { useCookies } from "react-cookie";
import useAuthService from "../services/AuthService";

function AppNavbar() {
    const [cookies] = useCookies(['token', 'loggedinuser']);
    const { logout } = useAuthService();

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Toggle aria-controls="appnavbar-nav" />
                <Navbar.Collapse id="appnavbar-nav" >
                    
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/courses">Courses</Nav.Link>
                    </Nav>
                    <Nav className="justify-content-end">
                        {
                            cookies.loggedinuser ?
                                <>
                                    <Navbar.Text>Signed in as {cookies.loggedinuser}
                                        <Button className="mx-2" onClick={ () => logout()}>Logout</Button></Navbar.Text>
                                </> :
                                <>
                                    <Nav.Link href="/login" className="me-auto">Login</Nav.Link>
                                    <Nav.Link href="/signup">Signup</Nav.Link>
                                </>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );

};

export default AppNavbar;