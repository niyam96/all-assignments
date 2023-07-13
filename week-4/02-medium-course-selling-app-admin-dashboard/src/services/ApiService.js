import axios from 'axios';
import config from '../config/Config.js';

const API_BASE_URL = config.API_BASE_URL;

const ApiService = {
    adminGetAllCourses: async () => {
        try {
            var response = await axios.get(API_BASE_URL + '/admin/courses')
            return response.data;
        } catch (err) {
            console.log(err.message);
        }
    },

    adminCreateCourse: async (courseDetails) => {
        var response = await axios.post(API_BASE_URL + '/admin/courses', courseDetails);
        return response.data;
    },

    adminUpdateCourse: async (courseDetails) => {
        var response = await axios.put(API_BASE_URL +
            `/admin/courses/${courseDetails.id}`, courseDetails);
        return response.data;
    },

    adminDeleteCourse: async (courseId) => {
        var response = await axios.delete(API_BASE_URL +
            `/admin/courses/${courseId}`);
        return response.data;
    }
};

export default ApiService;