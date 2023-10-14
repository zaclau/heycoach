// import "./navbar.css"
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
            <div className="navbar-brand fw-bold" onClick={ goHome }>HeyCoach!</div>
            <div className="navItems">
                <button className="btn btn-link link-dark fw-bold" onClick={ goLogin }>Login</button>
                <button className="btn btn-link link-dark fw-bold" onClick={ goSignup }>Sign Up</button>
            </div>
        </div>
    </div>
  )
}

export default Navbar