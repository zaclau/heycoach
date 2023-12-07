import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../auth/auth';

function Success() {
    const userManagement = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('user')) {
            userManagement.signInUser(JSON.parse(localStorage.getItem('user')));    // Start user session
            localStorage.clear();
            navigate('/');
        }
    }, []);

    return (
        <div className="container-xxl bd-gutter">
            <h1 className="text-center fw-bolder my-5">
                Success! <br></br> You're 1 step closer <br></br> to a better you
            </h1>

            <div className="row justify-content-center">
                <button className="form-control btn btn-light mt-4 col-4">automatically redirecting</button>
            </div>
        </div>
    )
}

export default Success;