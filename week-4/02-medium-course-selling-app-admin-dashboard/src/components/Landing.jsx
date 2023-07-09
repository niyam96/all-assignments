
import React from "react";
import { Container, Row, Col } from "react-bootstrap";

/// This is the landing page. You need to add a link to the login page here.
/// Maybe also check from the backend if the user is already logged in and then show them a logout button
/// Logging a user out is as simple as deleting the token from the local storage.
function Landing() {
    return <Container>
        <Row>
            <Col md={{ span: 6, offset: 3 }} className='my-4'>
                <h1 className="text-center">Course Selling App</h1>
            </Col>
        </Row>
    </Container>
}

export default Landing;