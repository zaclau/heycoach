import React, { useEffect } from 'react';
import { useForm } from "react-hook-form"
import ErrorMessage from "../../components/errorMessage/ErrorMessage";
import { useLocation, useNavigate } from 'react-router-dom';
import { graphQLFetch } from '../../graphQL/graphQLFetch';
import { useAuthContext } from '../../auth/auth';
import { createStripeAccount } from '../../../server/stripe';

function Settings() {
    const userManagement = useAuthContext();
    
    const { register, handleSubmit, formState: { errors } } = useForm();    // See https://www.react-hook-form.com/get-started/#ReactWebVideoTutorial
    const formSubmit = async (data) => {
        // Create new User with Coach Profile
        const updateUserMutation = `
            mutation updateUserProfile($userId: ID!, $updatedProfile: InputsForUserProfile!) {
                updateUserProfile(userId: $userId, updatedProfile: $updatedProfile) {
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
                        location
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

        console.log('Data from settings form: ', data);
        const firstName = data.firstName;
        const lastName = data.lastName;
        const updatedProfile = {
            email: userManagement.userStore.email,
            firstName,
            lastName
        };
        
        const userId = userManagement.userStore._id;
        const variables = {
            userId,
            updatedProfile
        };
        console.log('Settings variables: ', variables);

        try {
            const updatedUser = await graphQLFetch(updateUserMutation, variables);
            console.log('Updated user from Settings: ', updatedUser);
            if (updatedUser.updateUserProfile) {
                userManagement.signInUser(updatedUser.updateUserProfile);    // Start user session
                console.log('User profile updated!');
            } // might need else clause to throw error
        } catch (error) {
            console.log(error);
        }
    } 

    return (
        <div className="container-xxl bd-gutter">
            <h1 className="text-center fw-bolder my-5">
                Settings <br></br>
            </h1>
            <hr></hr>

            <div className="row justify-content-center">
                <form onSubmit={handleSubmit(formSubmit)} className="col-4">
                    
                    <label className="form-label mt-2 mb-1">First Name</label>
                    <input {...register("firstName", {value: userManagement.userStore.firstName, required: 'First name is required.'})} className="form-control text-white bg-dark rounded-pill" placeholder="First Name"></input>
                    
                    <label className="form-label mt-2 mb-1">Last Name</label>
                    <input {...register("lastName", {value: userManagement.userStore.lastName})} className="form-control text-white bg-dark rounded-pill" placeholder="Last Name"></input>

                    <input type="submit" value="Save Changes" className="form-control btn btn-light mt-4"/>
                    
                    <hr></hr>
                </form>
            </div>
        </div>
    );
}

export default Settings;