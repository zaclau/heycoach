import React from 'react';
import { useForm } from "react-hook-form"
import ErrorMessage from "../../components/errorMessage/ErrorMessage";
import { useLocation, useNavigate } from 'react-router-dom';
import { graphQLFetch } from '../../graphQL/graphQLFetch';
import { useAuthContext } from '../../auth/auth';
import { createStripeAccount } from '../../server/stripe';

function SignupCoach() {
    const userManagement = useAuthContext();
    const location = useLocation();
    const navigate = useNavigate();
    
    const { register, handleSubmit, formState: { errors } } = useForm();    // See https://www.react-hook-form.com/get-started/#ReactWebVideoTutorial
    const formSubmit = async (data) => {
        // Create new User with Coach Profile
        const signUpUserMutation = `
            mutation signUpUser($newUser: InputsForUserProfile!) {
                signUpUser(newUser: $newUser) {
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

        const email = location.state.email;
        const firstName = location.state.firstName;
        const lastName = location.state.lastName;
        const profilePicture = location.state.profilePicture;
        const description = data.description;
        const sessionDuration = parseInt(data.sessionDuration);
        const sessionPrice = parseFloat(data.sessionPrice);
        const userProfileInput = {
            newUser: {email,
            firstName,
            lastName,
            profilePicture,
            profileAsCoach: {
                description,
                sessionDuration,
                sessionPrice
            }}
        };

        try {
            const newUser = await graphQLFetch(signUpUserMutation, userProfileInput);
            console.log('New user created from Signup Coach: ', newUser);
            if (newUser.signUpUser) {
                userManagement.signInUser(newUser.signUpUser);    // Start user session
                // Create Stripe Account
                const stripeAccountId = await createStripeAccount(newUser.signUpUser, '/signup/coach', '/#/listings');
                console.log('Stripe Account ID: ', stripeAccountId);
                // Update User with Stripe Account ID
                // navigate('/listings');
            } // might need else clause to throw error
        } catch (error) {
            console.log(error);
        }
    } 

    return (
        <div className="container-xxl bd-gutter">
            <h1 className="text-center fw-bolder my-5">
                Almost there! <br></br> Tell us more <br></br> about yourself
            </h1>

            <div className="row justify-content-center">
                <form onSubmit={handleSubmit(formSubmit)} className="col-4">
                    
                    <label className="form-label mt-2 mb-1">Description</label>
                    <textarea {...register("description")} className="form-control text-white bg-dark rounded-pill" placeholder="Description"></textarea>
                    
                    <label className="form-label mt-2 mb-1">Session Duration</label>
                    <input {...register("sessionDuration", {required: 'Session duration is required.'})} className="form-control text-white bg-dark rounded-pill" placeholder="Session Duration" type='number'></input>
                    {errors.sessionDuration && <ErrorMessage message={errors.sessionDuration?.message} />}

                    <label className="form-label mt-2 mb-1">Session Price</label>
                    <input {...register("sessionPrice", {required: 'Session price is required.'})} className="form-control text-white bg-dark rounded-pill" placeholder="Session Price" type="number" step="0.01" min="0" ></input>
                    {errors.sessionPrice && <ErrorMessage message={errors.sessionPrice?.message} />}
                    
                    <input type="submit" value="Proceed" className="form-control btn btn-light mt-4"/>
                    
                    <hr></hr>
                </form>
            </div>
        </div>
    );
}

export default SignupCoach;