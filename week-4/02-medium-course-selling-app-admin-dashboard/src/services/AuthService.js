import axios from 'axios';
import { useCookies } from 'react-cookie';
import config from '../config/Config.js';

const API_BASE_URL = config.API_BASE_URL;

const useAuthService = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['token']);

    const adminLogin = async (username, password) => {
        var response = await axios.post(API_BASE_URL + "/admin/login", {}, {
            headers: {
                'username': username,
                'password': password
            }
        });

        var token = response.data.token;
        setCookie('token', token, { path: '/' });

        return token;
    };

    const logout = () => {
        removeCookie('token', { path: '/' });
    };

    return { adminLogin, logout };
}

export default useAuthService;