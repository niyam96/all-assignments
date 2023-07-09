import axios from 'axios';
import { useCookies } from 'react-cookie';
import config from '../config/Config.js';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = config.API_BASE_URL;

const useAuthService = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['token','loggedinuser']);
    const navigate = useNavigate();

    const adminLogin = async (username, password) => {
        var response = await axios.post(API_BASE_URL + "/admin/login", {}, {
            headers: {
                'username': username,
                'password': password
            }
        });

        var token = response.data.token;
        setCookie('token', token, { path: '/' });
        setCookie('loggedinuser', username, { path: '/' });

        return token;
    };

    const adminSignup = async(username, password) => {
        var response = await axios.post(API_BASE_URL + "/admin/signup", 
        {'username': username,
        'password': password});

        var token = response.data.token;
        setCookie('token', token, { path: '/' });
        setCookie('loggedinuser', username, { path: '/' });

        return token;
    };

    const logout = () => {
        removeCookie('token', { path: '/' });
        removeCookie('loggedinuser', { path: '/' });
        navigate('/login');
    };

    return { adminSignup, adminLogin, logout };
}

export default useAuthService;