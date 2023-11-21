import { useForm } from "react-hook-form"
import ErrorMessage from "../../components/errorMessage/ErrorMessage";
import { GoogleLogin } from '@react-oauth/google';

function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
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

                </form>
                <GoogleLogin
                    onSuccess={credentialResponse => {
                        console.log(credentialResponse);
                    }}
                    onError={() => {
                        console.log('Login Failed');
                    }}
                />;
            </div>
        </div>
    )
}

export default Login;