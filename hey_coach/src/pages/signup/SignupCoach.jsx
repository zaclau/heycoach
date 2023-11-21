import React from 'react';
import { useForm } from "react-hook-form"
import ErrorMessage from "../../components/errorMessage/ErrorMessage";
import { useLocation, useNavigate } from 'react-router-dom';
import { graphQLFetch } from '../../graphQL/graphQLFetch';

function SignupCoach({ userManagement }) {
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
        const sessionDuration = data.sessionDuration;
        const sessionPrice = data.sessionPrice;
        const userProfileInput = {
            email,
            firstName,
            // lastName,
            // profilePicture,
            // profileAsCoach: {
            //     description,
            //     sessionDuration,
            //     sessionPrice
            // },
            // profileAsCoachee: {}
        };

        try {
            const newUser = await graphQLFetch(signUpUserMutation, { userProfileInput });
            console.log('New user created from Signup Coach: ', newUser);
            if (newUser) {
                userManagement.signInUser(newUser);    // Start user session
                navigate('/listings');
            } // might need else clause to throw error
        } catch (error) {
            console.log(error);
        }
    } 

    return (
        <div className="container-xxl bd-gutter">
            <h1 className="text-center fw-bolder my-5">
                You're one click <br></br> away to exclusive <br></br> 1:1 Sessions
            </h1>

            <div className="row justify-content-center">
                <form onSubmit={handleSubmit(formSubmit)} className="col-4">
                    
                    <label className="form-label mt-2 mb-1">Desciprtion</label>
                    <textarea {...register("description")} className="form-control text-white bg-dark rounded-pill" placeholder="Description"></textarea>
                    
                    <label className="form-label mt-2 mb-1">Session Duration</label>
                    <input {...register("sessionDuration", {required: 'Session duration is required.'})} className="form-control text-white bg-dark rounded-pill" placeholder="Session Duration" type='number'></input>
                    {errors.sessionDuration && <ErrorMessage message={errors.sessionDuration?.message} />}

                    <label className="form-label mt-2 mb-1">Session Price</label>
                    <input {...register("sessionPrice", {required: 'Session price is required.'})} className="form-control text-white bg-dark rounded-pill" placeholder="Session Price" type="number" step="0.01" min="0" ></input>
                    {errors.sessionPrice && <ErrorMessage message={errors.sessionPrice?.message} />}



                    {/* <label className="form-label mt-2 mb-1">Email</label>
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
                        // See https://www.freecodecamp.org/news/how-to-create-forms-in-react-using-react-hook-form/ 
                        validate: {
                            checkLength: (value) => {
                                // See https://stackoverflow.com/a/71429960
                                if (value.length < 8) {
                                    return 'Password must have at least 8 characters.';
                                }
                            },
                            meetRequirements: (value) => {
                                const pattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)(?=.*[!@#$*])/;
                                if (! pattern.test(value)) {
                                    return 'Password must have at least one lowercase, uppercase, digit and special character.';
                                }
                            }
                        }
                    })} className="form-control text-white bg-dark rounded-pill" placeholder="Password"></input>
                    {errors.password && <ErrorMessage message={errors.password?.message} />} */}
                    
                    <input type="submit" value="Sign Up" className="form-control btn btn-light mt-4"/>
                    
                    <hr></hr>
                </form>
            </div>

            <div className="row justify-content-center">
                <div className="col-4">
                    <a className="btn btn-outline-dark col-12">
                        <img className="align-text-bottom me-2 p-0" width="18px" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"></img>
                        Sign Up with Google
                    </a>
                </div>
            </div>
        </div>
    );
}

export default SignupCoach;