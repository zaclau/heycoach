// import "./navbar.css"
import React from 'react';
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const goHome = () => {
    navigate("/");
  }

  const goSignup = () => {
    navigate("/signup");
  }

  const goLogin = () => {
    navigate("/login");
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
                <button className="btn btn-link link-dark fw-bold" onClick={ goLogin }>Login</button>
                <button className="btn btn-link link-dark fw-bold" onClick={ goSignup }>Sign Up</button>
            </div>
        </div>
    </div>
  )
}

export default Navbar