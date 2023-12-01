// import "./navbar.css"
import React from 'react';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from '../../auth/auth';

const Navbar = () => {
  const userManagement = useAuthContext();
  const navigate = useNavigate();
  const goHome = () => {
    navigate("/");
  }

  const goLogin = () => {
    navigate("/login");
  }

  const goLogout = () => {
    userManagement.signOutUser();
    navigate("/");
  }


  return (
    <div className="navbar navbar-expand justify-content-center">
        <div className="container-xxl bd-gutter">
            <a className="navbar-brand fw-bold" onClick={ goHome }>
              <img 
                  src="https://cdn.icon-icons.com/icons2/2172/PNG/512/spring_sprout_plant_garden_growth_leaves_seedling_icon_133303.png"
                  width="25px"
                  className="me-1 pe-1"
              ></img>
                HeyCoach!
            </a>
            <div className="navItems">
                {userManagement && userManagement.userStore 
                    ? <div>
                        <a href='/#/settings'>
                          <img 
                              className='rounded-circle' 
                              width="30px"
                              src={ userManagement.userStore.profilePicture }></img>
                        </a>
                        <button className="btn btn-link link-dark fw-bold" onClick={ goLogout }>
                          Logout
                        </button>
                      </div>
                    : <button className="btn btn-link link-dark fw-bold" onClick={ goLogin }>Login/Signup with Google</button>
                }
            </div>
        </div>
    </div>
  )
}

export default Navbar