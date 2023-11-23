function CoachProfileForm() {
    const userManagement = useAuthContext();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const formSubmit = async (data) => {};
    return (
        <form onSubmit={handleSubmit(formSubmit)}>
                        
            <label className="form-label mt-2 mb-1">First Name</label>
            <input {...register("firstName", {value: userManagement.userStore.firstName, required: 'First name is required.'})} className="form-control text-white bg-dark rounded-pill" placeholder="First Name"></input>
            
            <label className="form-label mt-2 mb-1">Last Name</label>
            <input {...register("lastName", {value: userManagement.userStore.lastName})} className="form-control text-white bg-dark rounded-pill" placeholder="Last Name"></input>

            <input type="submit" value="Save Changes" className="form-control btn btn-light mt-4"/>
            
            <hr></hr>
        </form>
    )
}

export default CoachProfileForm;