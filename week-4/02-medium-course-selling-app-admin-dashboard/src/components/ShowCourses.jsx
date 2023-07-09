import React, { useEffect } from "react";
import ApiService from "../services/ApiService";

function ShowCourses() {
    const [courses, setCourses] = React.useState([]);

    useEffect(() => {
        async function fetchCourses() {
            var courses = await ApiService.adminGetAllCourses();
            setCourses(courses);
        }

        fetchCourses();
    }, []);



    // Add code to fetch courses from the server
    // and set it in the courses state variable.
    if (courses) {
        return <div>
            <h1>Create Course Page</h1>
            {courses.map(c => <Course key={c._id} title={c.title} />)}
        </div>
    }
    else{
        return <>Loading...</>
    }
}

function Course(props) {
    return <div>
        <h1>{props.title}</h1>
    </div>
}

export default ShowCourses;