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
import SignupCoachee from "./pages/signup/SignupCoachee.jsx";
import UserLanding from "./pages/userLanding/UserLanding";
import Settings from './pages/settings/Settings.jsx';
import Success from './pages/success/Success.jsx';
import Instagram from './pages/Instagram.jsx';
import { AuthRequired } from './auth/auth.jsx';

const NotFound = () => <h1>Page Not Found</h1>;

function Contents() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signup/coach" element={ <SignupCoach /> } />
      <Route path="/signup/user" element={ <SignupCoachee /> } />
      <Route path="/login" element={<Login />} />
      <Route path="/settings" element={
        <AuthRequired>
          <Settings />
        </AuthRequired>} />
      <Route path="/listings" element={<Listings />} />
      {/* <Route path="/userLanding" element={<UserLanding />} /> */}
      <Route path="/bookings" element={
        <AuthRequired>
          <Bookings />
        </AuthRequired>} />
      <Route path="/coaches/:coachId" element={<CoachProfile />} />
      <Route path="/success" element={<Success />} />
      <Route path="/instagram-success" element={<Instagram />} />
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