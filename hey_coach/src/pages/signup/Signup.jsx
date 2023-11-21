import React from 'react';
import { useForm } from "react-hook-form"
import ErrorMessage from "../../components/errorMessage/ErrorMessage";

function Signup() {
    const { register, handleSubmit, formState: { errors } } = useForm();    // See https://www.react-hook-form.com/get-started/#ReactWebVideoTutorial
    return (
        <div className="container-xxl bd-gutter">
            <h1 className="text-center fw-bolder my-5">
                You're one click <br></br> away to exclusive <br></br> 1:1 Sessions
            </h1>

            <div className="row justify-content-center">
                <form onSubmit={handleSubmit((data) => {
                    console.log(data)   // TODO: Replace with backend call to signup endpoint
                })} className="col-4">
                    
                    <label className="form-label mt-2 mb-1">First Name</label>
                    <input {...register("firstName", {required: 'First name is required.'})} className="form-control text-white bg-dark rounded-pill" placeholder="First Name"></input>
                    {errors.firstName && <ErrorMessage message={errors.firstName?.message} />}
                    
                    <label className="form-label mt-2 mb-1">Last Name</label>
                    <input {...register("lastName", {required: 'Last Name is required.'})} className="form-control text-white bg-dark rounded-pill" placeholder="Last Name"></input>
                    {errors.lastName && <ErrorMessage message={errors.lastName?.message} />}

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
                    {errors.password && <ErrorMessage message={errors.password?.message} />}
                    
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

export default Signup;