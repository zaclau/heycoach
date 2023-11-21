import React from 'react';
import { useForm } from "react-hook-form"
import ErrorMessage from "../../components/errorMessage/ErrorMessage";
import { useGoogleLogin } from '@react-oauth/google';
import { graphQLFetch } from "../../graphQL/graphQLFetch";
import { useNavigate } from 'react-router-dom';

function Login({ userManagement }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    const navigate = useNavigate();

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                method: "GET",
                headers: { "Authorization": `Bearer ${tokenResponse.access_token}` }
            });
            const userInfo = await response.json();
            console.log('Google API userinfo: ', userInfo); //TODO: To be removed

            // Get user from backend. If user exists, return user and signin. Else, redirect to signup
            const getUserQuery = `
                query getUserByEmail($email: String!) {
                    getUserByEmail(email: $email) {
                        _id
                        email
                        firstName
                        lastName
                        profilePicture
                        googleOuthToken
                        stripeCustomerId
                        profileAsCoach {
                        description
                        tagsOfSpecialties
                        sessionSlotsAvailable {
                            day
                            slots {
                                start
                                end
                            }
                        }
                        sessionDuration
                        sessionPrice
                        }
                        profileAsCoachee {
                            description
                        sessionSlotsPreferred {
                            day
                            slots {
                                start
                                end
                            }
                        }
                        tagsOfGoals
                        }
                    }
                }
            `;
            const email = userInfo.email;
            const existingUser = await graphQLFetch(getUserQuery, { email });
            console.log('Existing user found on signin/up: ', existingUser); //TODO: Remove console output
            

            // Redirect to Listings page if existing user
            if (existingUser) {
                userManagement.signInUser(existingUser);    // Start user session
                navigate("/listings");
                return;
            }

            // Redirect to signup form
            console.log('Navigating to signup page from login');
            navigate("/signup", { state: { 
                email: userInfo.email, 
                firstName: userInfo.given_name,
                lastName: userInfo.family_name,
                profilePicture: userInfo.picture
            }})

        },
        onError: (error) => console.log(error), 
    });
    return (
        <div className="container-xxl bd-gutter">
            <h1 className="text-center fw-bolder my-5">
                You're one click <br></br> away to exclusive <br></br> 1:1 Sessions
            </h1>

            <div className="row justify-content-center">
                <form onSubmit={handleSubmit((data) => {
                        console.log(data)   // TODO: Replace with backend call to login endpoint
                    })} className="col-4">

                    <label className="form-label mt-2 mb-1">Email</label>
                    <input {...register("email", {
                        required: 'Email is required.', 
                        pattern: {
                            value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                            message: "Email is invalid."
                        }
                    })} 
                        className="form-control text-white bg-dark rounded-pill" 
                        placeholder="Email"></input>
                    {errors.email && <ErrorMessage message={errors.email?.message} />}
                    
                    <label className="form-label mt-2 mb-1">Password</label>
                    <input {...register("password", {
                        required: 'Password is required.',
                    })} className="form-control text-white bg-dark rounded-pill" placeholder="Password"></input>
                    {errors.password && <ErrorMessage message={errors.password?.message} />}
                    
                    <input type="submit" value="Login" className="form-control btn btn-light mt-4"/>

                    <button onClick={() => login()} className="form-control btn btn-light mt-4">Sign in with Google</button>
                </form>
                
            </div>
        </div>
    )
}

export default Login;