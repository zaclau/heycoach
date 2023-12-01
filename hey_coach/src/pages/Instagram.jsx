import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router";
import { useAuthContext } from '../auth/auth';
import { set } from 'date-fns';

const Instagram = () => {
    const userManagement = useAuthContext();
    const navigate = useNavigate();
    const [success, setSuccess] = useState();
    const [failed, setFailed] = useState();
    const handleUpdateInstagramToken = async () => {
        // Resume user session if available
        const user = localStorage.getItem('user');
        console.log('Local Storage: ', localStorage.getItem('user'));
        if (user) {
            userManagement.signInUser(JSON.parse(user));    // Start user session
            localStorage.clear();
        } else {
            // Redirect to login if user accesses this page directly
            navigate('/login');
            return;
        }

        const userId = JSON.parse(user)._id;
        console.log('userId: ', userId);
        const api = Axios.create({
            baseURL: process.env.REACT_APP_DOMAIN,
            timeout: 5000,  // abort if request takes longer than 5 seconds
            headers: {'Content-Type': 'application/json'},
            withCredentials: true   // send cookies
        });
        try {
            const response = await api.post('/api/v1/instagram/update-user', { userId: userId });
            console.log('response: ', response);
            setSuccess('success');
            setTimeout(() => navigate(`/coaches/${userId}`), 4000);
        } catch (error) {
            console.log('error: ', error);
            setFailed('failed');
            setTimeout(() => navigate('/settings'), 4000);
        }
    }

    useEffect( () => {
        handleUpdateInstagramToken();    // Note: Cannot use async directly in useEffect, must abstract out into async function!
    }, []);

    return (
        <div className="container-xxl bd-gutter">
            <div className='d-flex flex-column justify-content-center align-items-center' style={{height: "100vh"}}>
                <div className='spinner-grow text-secondary'></div>
                <h4 className='text-center text-secondary mt-2'>{success && '✅ Successfully linked! Redirecting...'}</h4>
                <h4 className='text-center text-secondary mt-2'>{failed && '❌ Failed to link! Redirecting...'}</h4>
            </div>
        </div>
    );
}

export default Instagram;