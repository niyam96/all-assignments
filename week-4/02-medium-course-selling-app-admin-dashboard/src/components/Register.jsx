import React from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthService from '../services/AuthService.js';

function Register() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [signupStatus, setSignupStatus] = React.useState(null);
    const { adminSignup } = useAuthService();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        const form = e.currentTarget;
        e.preventDefault();

        if (form.checkValidity() === false) {
            e.stopPropagation();
        }

        try {
            await adminSignup(email, password);

            navigate('/courses');
        }
        catch (error) {
            setSignupStatus(`${error.response ? error.response.data : "Signup Failed"}`);
        }
    };

    return <Container>
        <Row>
            <Col md={{ span: 6, offset: 3 }} className='my-4'>
                <h1 className="text-center">Sign up</h1>
            </Col>
        </Row>
        <Row>
            <Col md={{ span: 6, offset: 3 }} className='my-4'>
                <Form onSubmit={(event) => handleSubmit(event)}>
                    <Form.Group className="mb-3" controlId="signupEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control required type="email" placeholder="Enter email"
                            onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="signupPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control required type="password" placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>

                    { signupStatus ? <><Form.Group className="mb-3" controlId="signupStatus">
                        <Form.Label className='text-danger'>
                            {signupStatus}
                        </Form.Label>
                    </Form.Group></> : <></> }


                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Col>
        </Row>
    </Container>
}

export default Register;