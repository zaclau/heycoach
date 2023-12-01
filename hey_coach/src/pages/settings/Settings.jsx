import React, { useEffect } from 'react';
import { useForm } from "react-hook-form"
import ErrorMessage from "../../components/errorMessage/ErrorMessage";
import { useLocation, useNavigate } from 'react-router-dom';
import { graphQLFetch } from '../../graphQL/graphQLFetch';
import { useAuthContext } from '../../auth/auth';
import { getAuthorization } from '../../../server/instagram';


function Settings() {
    const userManagement = useAuthContext();
    const navigate = useNavigate();
    
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

    const handleInstagramAuth = () => {
        console.log('handleInstagramAuth entered. ');
        console.log('User when instagram button clicked: ', userManagement.userStore);
        sessionStorage.setItem('user', JSON.stringify(userManagement.userStore));
        localStorage.setItem('user', JSON.stringify(userManagement.userStore));
        getAuthorization();
    }
    
    const handleDeleteUser = async () => {
        const deleteUserMutation = `
            mutation deleteUser($userId: ID!) {
                deleteUser(userId: $userId)
            }
        `;

        const userId = userManagement.userStore._id;
        try {
            const userDeleted = await graphQLFetch(deleteUserMutation, { userId });
            // TODO: Delete all related sessions? 
            if (userDeleted) {
                userManagement.signOutUser();
                navigate("/");
                return;
            }
            throw new Error('User does not exist.');
            
        } catch (error) {
            console.log(`Failed to delete user: ${error.message}`);
        }
    }

    return (
        <div className="container-xxl bd-gutter">
            <h1 className="text-center fw-bolder my-5">
                Settings <br></br>
            </h1>
            <hr className='col-8 mx-auto'></hr>

            <div className="row justify-content-center">
                <div className="col-4">
                    <form onSubmit={handleSubmit(formSubmit)}>
                        
                        <label className="form-label mt-2 mb-1">First Name</label>
                        <input {...register("firstName", {value: userManagement.userStore.firstName, required: 'First name is required.'})} className="form-control text-white bg-dark rounded-pill" placeholder="First Name"></input>
                        
                        <label className="form-label mt-2 mb-1">Last Name</label>
                        <input {...register("lastName", {value: userManagement.userStore.lastName})} className="form-control text-white bg-dark rounded-pill" placeholder="Last Name"></input>

                        <input type="submit" value="Save Changes" className="form-control btn btn-light mt-4 mb-2"/>
                        
                        <hr></hr>
                    </form>


                    {userManagement.userStore.profileAsCoach &&
                        <>
                            <button 
                                onClick={ handleInstagramAuth }
                                className="form-control btn btn-dark my-2">
                                <i className='bi bi-instagram me-3'></i>
                                Link Your Instagram Profile
                            </button>
                            <hr></hr>
                        </>}

                    <button 
                        className='form-control btn btn-danger col-4 my-2'
                        onClick={ handleDeleteUser }>
                        Delete Your Account
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Settings;