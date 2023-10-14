import "./navbar.css"
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="navbar justify-content-center">
      <div className="navContainer justify-content-between col-7">
        <div className="logo" onClick={goHome}>HeyCoach!</div>
        <div className="navItems">
          <button className="navButton">Login/Sign Up</button>
        </div>
      </div>
    </div>
  )
}

export default Navbar