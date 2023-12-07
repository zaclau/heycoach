import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Signup() {
    const navigate = useNavigate();
    const location = useLocation();
    console.log('Location.state in Signup page: ', location.state);
    const handleCoachRegistration = () => { navigate('/signup/coach', { state: location.state }) }
    const handleCoacheeRegistration = () => { navigate('/signup/user', { state: location.state }) }
    return (
        <div className="container-xxl bd-gutter">
            <h1 className="text-center fw-bolder my-5">
                Welcome to HeyCoach, { location.state.firstName }!<br></br>
            </h1>

            <div className="row justify-content-center">
                <button 
                    onClick={ () => handleCoacheeRegistration() } 
                    className='btn btn-light col-4 mx-2'>
                        I'm looking for a Coach
                </button>
                <button 
                    onClick={ () => handleCoachRegistration() }
                    className='btn btn-light col-4 mx-2'>
                        I want to be a Coach
                </button>
            </div>
        </div>
    );
}

export default Signup;