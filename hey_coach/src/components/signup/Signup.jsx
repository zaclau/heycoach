import React from 'react';
import "./signup.css"

const Signup = () => {
  return (
    <div className="mail">
      <h1 className="mailTitle">Learn a new skill, save money!</h1>
      <span className="mailDesc">Sign up and learn today.</span>
      <div className="mailInputContainer">
        <input type="text" placeholder="Your Email" />
        <button>Sign Up</button>
      </div>
    </div>
  )
}

export default Signup