import React from 'react';
import { useState, Fragment } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar.jsx";
import Home from "./pages/home/Home.jsx";
import Listings from "./pages/listings/Listings.jsx";
import Signup from "./pages/signup/Signup.jsx";
import Login from "./pages/login/Login.jsx";
import Bookings from "./pages/bookings/Bookings.jsx";
import CoachProfile from "./pages/coachProfile/CoachProfile.jsx";
import SignupCoach from "./pages/signup/SignupCoach.jsx";

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
      <Route path="/signup" element={<Signup userManagement={userManagement}  signUpInfo={null}/>} />
      <Route path="/signup/coach" element={ <SignupCoach userManagement={userManagement} /> } />
      {/* <Route path="/signup/user" element={ <SignupCoachee userManagement={userManagement} /> } /> */}
      <Route path="/login" element={<Login userManagement={userManagement}/>} />
      <Route path="/listings" element={<Listings userManagement={userManagement}/>} />
      <Route path="/bookings" element={<Bookings userManagement={userManagement}/>} />
      <Route path="/coaches/:coachId" element={<CoachProfile userManagement={userManagement}/>} />
      <Route path="*" element={<NotFound />} /> {/* Adjusted for handling 404 pages */}
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


// import React from 'react';
// import { useState, Fragment } from "react";
// import { Routes, Route } from "react-router-dom";
// import Navbar from "./components/navbar/Navbar.jsx";
// import Home from "./pages/home/Home.jsx";
// import Listings from "./pages/listings/Listings.jsx";
// import Signup from "./pages/signup/Signup.jsx";
// import Login from "./pages/login/Login.jsx";
// import Bookings from "./pages/bookings/Bookings.jsx";
// import CoachProfile from "./pages/coachProfile/CoachProfile.jsx";
//
// const NotFound = () => <h1>Page Not Found</h1>;
//
// function Contents() {
//   const [user, setUser] = useState(null);
//
//   const signIn = (user) => {
//     setUser(user);
//   }
//
//   const signOut = () => {
//     setUser(null);
//   }
//
//   const userManagement = {
//     userStore: user,
//     signInUser: signIn,
//     signOutUser: signOut,
//   }
//
//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/signup" element={<Signup userManagement={userManagement}/>} />
//       <Route path="/login" element={<Login userManagement={userManagement}/>} />
//       <Route path="/listings" element={<Listings userManagement={userManagement}/>} />
//       {/* change listings to have a query parameter */}
//       <Route path="/bookings" element={<Bookings userManagement={userManagement}/>} />
//       <Route path="/coaches/:coachId" element={<CoachProfile userManagement={userManagement}/>} />
//       <Route component={NotFound} />
//     </Routes>
//   );
// }
//
//
// export default function Pages() {
//   return (
//     <Fragment>
//       <Navbar />
//       <Contents />
//     </Fragment>
//   );
// }