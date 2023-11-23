import React from 'react';
import { useForm } from "react-hook-form"
import ErrorMessage from "../../components/errorMessage/ErrorMessage";
import { useLocation, useNavigate } from 'react-router-dom';
import { graphQLFetch } from '../../graphQL/graphQLFetch';
import { useAuthContext } from '../../auth/auth';

function SignupCoachee() {
    const userManagement = useAuthContext();
    const location = useLocation();
    const navigate = useNavigate();
    
    const { register, handleSubmit, formState: { errors } } = useForm();    // See https://www.react-hook-form.com/get-started/#ReactWebVideoTutorial
    const formSubmit = async (data) => {
        // Create new User with Coachee Profile
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
        const tagsOfGoals = ["Wellness"]; // hardcoded for now
        const userProfileInput = {
            newUser: {email,
            firstName,
            lastName,
            profilePicture,
            profileAsCoachee: {
                description,
                tagsOfGoals,
            }}
        };

        try {
            const newUser = await graphQLFetch(signUpUserMutation, userProfileInput);
            console.log('New user created from Signup Coach: ', newUser);
            if (newUser.signUpUser) {
                userManagement.signInUser(newUser.signUpUser);    // Start user session
                navigate('/');
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
                    <textarea {...register("description", {required: 'Description is required.'})} className="form-control text-white bg-dark rounded-pill" placeholder="Description"></textarea>
                    {errors.description && <ErrorMessage message={errors.description?.message} />}

                    <input type="submit" value="Proceed" className="form-control btn btn-light mt-4"/>
                    
                    <hr></hr>
                </form>
            </div>
        </div>
    );
}

export default SignupCoachee;