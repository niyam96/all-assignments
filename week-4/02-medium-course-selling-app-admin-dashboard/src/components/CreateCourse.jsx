import React from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import ApiService from '../services/ApiService';

function Login() {
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [imageLink, setImageLink] = React.useState("");
    const [price, setPrice] = React.useState(0);
    const [published, setPublished] = React.useState(false);
    const [createCourseStatus, setCreateCourseStatus] = React.useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        const form = e.currentTarget;
        e.preventDefault();

        if (form.checkValidity() === false) {
            e.stopPropagation();
        }

        try {
            await ApiService.adminCreateCourse({
                title: title,
                description: description,
                price: price,
                imageLink: imageLink,
                published: published
            });
            navigate('/courses');
        }
        catch (error) {
            setCreateCourseStatus(`${error.response.data ? error.response.data : "Course Creation Failed"}`);
        }
    };

    return <Container>
        <Row>
            <Col md={{ span: 6, offset: 3 }} className='my-4'>
                <h1 className="text-center">Create Course</h1>
            </Col>
        </Row>
        <Row>
            <Col md={{ span: 6, offset: 3 }} className='my-4'>
                <Form onSubmit={(event) => handleSubmit(event)}>
                    <Form.Group className="mb-3" controlId="courseTitle">
                        <Form.Label>Course Title</Form.Label>
                        <Form.Control required type="text" placeholder="Enter course title"
                            onChange={(e) => setTitle(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="courseDescription">
                        <Form.Label>Course Description</Form.Label>
                        <Form.Control required as="textarea" rows={3} placeholder="Enter description"
                            onChange={(e) => setDescription(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="courseImageLink">
                        <Form.Label>Image Link</Form.Label>
                        <Form.Control required type="text" placeholder="Enter image link"
                            onChange={(e) => setImageLink(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="coursePrice">
                        <Form.Label>Price</Form.Label>
                        <Form.Control required type="number" placeholder="Enter price"
                            onChange={(e) => setPrice(e.target.value)} />
                    </Form.Group>

                    <Form.Check
                        type="switch"
                        id="coursePublishedFlag"
                        label="Publish Course"
                        onChange={(e) => setPublished(e.target.checked)}
                    />

                    {createCourseStatus ? <Form.Group className="mb-3" controlId="createCourseStatus">
                        <Form.Label className='text-danger'>
                            {createCourseStatus}
                        </Form.Label>
                    </Form.Group> : <></>}

                    <Button className="my-3" variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Col>
        </Row>
    </Container>
}

export default Login;