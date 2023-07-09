import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const [cookies, , removeCookie] = useCookies(['token', 'loggedinuser']);
    const navigate = useNavigate();
    const [interceptorReady, setInterceptorReady] = useState(false);

    useEffect(() => {
        const handleTokenExpiration = () => {
            removeCookie('token');
            removeCookie('loggedinuser');
            navigate('/login', { state: { loginStatus: "Session expired. Please relogin" }});
        };

        const apiRequestInterceptor = axios.interceptors.request.use(config => {
            config.headers.Authorization = `Bearer ${cookies.token}`;
            return config;
        }, 
        error => {
            return Promise.reject(error);
        }, {synchronous: true});

        const apiResponseInterceptor = axios.interceptors.response.use(response => response,
            error => {
                if (error.response && 
                    (error.response.status === 401 || error.response.status === 403)) {
                    handleTokenExpiration();
                }

                return Promise.reject(error);
            }, {synchronous: true});

        setInterceptorReady(true);

        //Cleanup interceptors when component unmounts, to prevent unexpected behaviour
        return () => {
            axios.interceptors.request.eject(apiRequestInterceptor);
            axios.interceptors.response.eject(apiResponseInterceptor);
        };
    }, []);

    //If the dependency array is not kept empty here, then this effect also gets called twice when 
    //component renders twice, and somehow this causes the interceptor to not working on first request
    //to get all courses and that returns a 401 response

    if(interceptorReady)
        return <Outlet />;
    else
        return <p>Loading...</p>;
}

export default PrivateRoute;
