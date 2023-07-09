import React from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthService from '../services/AuthService.js';

/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loginStatus, setLoginStatus] = React.useState("");
    const { adminLogin } = useAuthService();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        const form = e.currentTarget;
        e.preventDefault();

        if (form.checkValidity() === false) {
            e.stopPropagation();
        }

        try {
            await adminLogin(email, password);

            navigate('/courses');
        }
        catch (error) {
            setLoginStatus(`${error.response.data ? error.response.data : "Login Failed"}`);
        }
    };

    return <Container>
        <Row>
            <Col md={{ span: 6, offset: 3 }} className='my-4'>
                <h1 className="text-center">Login</h1>
            </Col>
        </Row>
        <Row>
            <Col md={{ span: 6, offset: 3 }} className='my-4'>
                <Form onSubmit={(event) => handleSubmit(event)}>
                    <Form.Group className="mb-3" controlId="loginEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control required type="email" placeholder="Enter email"
                            onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="loginPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control required type="password" placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>

                    { location.state ? <><Form.Group className="mb-3" controlId="loginStatus">
                        <Form.Label className='text-danger'>
                            {location.state.loginStatus}
                        </Form.Label>
                    </Form.Group></> : <></> }
                    
                    {loginStatus ? <Form.Group className="mb-3" controlId="loginStatus">
                        <Form.Label className='text-danger'>
                            {loginStatus}
                        </Form.Label>
                    </Form.Group> : <></> }


                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Col>
        </Row>
    </Container>
}

export default Login;