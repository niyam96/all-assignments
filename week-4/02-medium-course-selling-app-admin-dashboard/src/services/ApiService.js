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

    adminCreateCourse: async(courseDetails) => {
        try {
            var response = await axios.post(API_BASE_URL + '/admin/courses', courseDetails);
            return response.data;
        } catch (err) {
            console.log(err.message);
        }
    }
};

export default ApiService;