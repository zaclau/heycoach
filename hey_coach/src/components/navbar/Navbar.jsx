import "./navbar.css"

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navContainer">
        <span className="logo">HeyCoach!</span>
        <div className="navItems">
          <button className="navButton">Login/Sign Up</button>
        </div>
      </div>
    </div>
  )
}

export default Navbar