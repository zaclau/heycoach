import { useState, Fragment } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import Listings from "./pages/listings/Listings";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";
import Bookings from "./pages/bookings/Bookings";
import CoachProfile from "./pages/coachProfile/CoachProfile";

const NotFound = () => <h1>Page Not Found</h1>;

function Contents() {
  const [user, setUser] = useState(null);

  const signIn = (user) => {
    setUser(user);
  }

  const signOut = () => {
    setUser(null);
  }

  const userManagement = {
    userStore: user,
    signInUser: signIn,
    signOutUser: signOut,
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup userManagement={userManagement}/>} />
      <Route path="/login" element={<Login userManagement={userManagement}/>} />
      <Route path="/listings" element={<Listings userManagement={userManagement}/>} />
      <Route path="/bookings" element={<Bookings userManagement={userManagement}/>} />
      <Route path="/coaches/:coachId" element={<CoachProfile userManagement={userManagement}/>} />
      <Route component={NotFound} />
    </Routes>
  );
}


export default function Pages() {
  return (
    <Fragment>
      <Navbar />
      <Contents />
    </Fragment>
  );
}