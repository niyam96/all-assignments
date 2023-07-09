import React, { useEffect } from "react";
import ApiService from "../services/ApiService";
import { Row, Col, Card, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ShowCourses() {
    const [courses, setCourses] = React.useState([]);
    const navigate = useNavigate();

    const fetchCourses = async () => {
        var courses = await ApiService.adminGetAllCourses();
        setCourses(courses);
    }

    useEffect(() => {
        fetchCourses();
    }, []);


    if (courses && courses.length) {
        return (
            <Container>
                <Row md={3} className="m-4 g-4">
                    <Col>
                        <Button className="m-1" onClick={() => fetchCourses()}>
                            <i className="bi bi-arrow-repeat"></i>Refresh
                        </Button>
                        <Button className="m-1" onClick={() => navigate('/createCourse')}>
                            <i className="bi bi-plus"></i>Create Course
                        </Button>
                    </Col>
                </Row>
                <Row md={3} className="m-4 g-4">
                    {courses.map(course => {
                        return (<Col key={course._id}>
                            <Course courseDetails={course} />
                        </Col>);
                    })}
                </Row>
            </Container>
        );
    }
    else {
        return (<Container>
            <Row md={3} className="m-4 g-4">
                <Col>
                    <Button onClick={() => navigate('/createCourse')}>
                        <i className="bi bi-plus"></i>Create Course
                    </Button>
                </Col>
            </Row>
        </Container>);
    }
}

function Course(props) {
    var course = props.courseDetails;
    return <Card className={!course.published ? "opacity-50" : ""}>
        <Card.Body>
            <Card.Title>{course.title}</Card.Title>
            <Card.Text>
                {course.description}
            </Card.Text>
        </Card.Body>
        <Card.Footer>
            <h5>Price : {course.price}</h5>
            <h6>Published : {course.published ? "Yes" : "No"}</h6>
        </Card.Footer>
    </Card>
}

export default ShowCourses;