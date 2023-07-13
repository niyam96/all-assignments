import React, {useEffect} from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import ApiService from '../services/ApiService';

function UpdateCourse() {
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [imageLink, setImageLink] = React.useState("");
    const [price, setPrice] = React.useState(0);
    const [published, setPublished] = React.useState(false);
    const [updateCourseStatus, setUpdateCourseStatus] = React.useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const courseDetails = location.state?.courseDetails;


    useEffect(() => {
        setTitle(location.state?.courseDetails.title);
        setDescription(location.state?.courseDetails.description);
        setImageLink(location.state?.courseDetails.imageLink);
        setPrice(location.state?.courseDetails.price);
        setPublished(location.state?.courseDetails.published);
    }, []);

    const handleSubmit = async (e) => {
        const form = e.currentTarget;
        e.preventDefault();

        if (form.checkValidity() === false) {
            e.stopPropagation();
        }

        try {
            await ApiService.adminUpdateCourse({
                id: courseDetails._id,
                title: title,
                description: description,
                price: price,
                imageLink: imageLink,
                published: published
            });
            navigate('/courses');
        }
        catch (error) {
            setUpdateCourseStatus(`${error.response.data ? error.response.data : "Course Updation Failed"}`);
        }
    };

    return location.state?.courseDetails ? <Container>
        <Row>
            <Col md={{ span: 6, offset: 3 }} className='my-4'>
                <h1 className="text-center">Update Course</h1>
            </Col>
        </Row>
        <Row>
            <Col md={{ span: 6, offset: 3 }} className='my-4'>
                <Form onSubmit={(event) => handleSubmit(event)}>
                    <Form.Group className="mb-3" controlId="courseTitle">
                        <Form.Label>Course Title</Form.Label>
                        <Form.Control required type="text"
                            defaultValue={courseDetails.title}
                            onChange={(e) => setTitle(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="courseDescription">
                        <Form.Label>Course Description</Form.Label>
                        <Form.Control required as="textarea" rows={3} 
                            defaultValue={courseDetails.description}
                            onChange={(e) => setDescription(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="courseImageLink">
                        <Form.Label>Image Link</Form.Label>
                        <Form.Control required type="text" 
                            defaultValue={courseDetails.imageLink}
                            onChange={(e) => setImageLink(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="coursePrice">
                        <Form.Label>Price</Form.Label>
                        <Form.Control required type="number" 
                            defaultValue={courseDetails.price}
                            onChange={(e) => setPrice(e.target.value)} />
                    </Form.Group>

                    <Form.Check
                        type="switch"
                        id="coursePublishedFlag"
                        label="Publish Course"
                        defaultChecked={courseDetails.published}
                        onChange={(e) => setPublished(e.target.checked)}
                    />

                    {updateCourseStatus ? <Form.Group className="mb-3" controlId="createCourseStatus">
                        <Form.Label className='text-danger'>
                            {updateCourseStatus}
                        </Form.Label>
                    </Form.Group> : <></>}

                    <Button className="my-3" variant="primary" type="submit">
                        Save
                    </Button>
                </Form>
            </Col>
        </Row>
    </Container> : 
    <Container>
    <Row>
        <Col md={{ span: 6, offset: 3 }} className='my-4 text-center'>
            <h3>Select a course to be edited from <a href="/courses">Courses</a> page</h3>
        </Col>
    </Row>
    </Container>
}

export default UpdateCourse;