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
      <Route path="/listings" element={<Listings />} />
      <Route path="/bookings" element={
        <AuthRequired>
          <Bookings />
        </AuthRequired>} />
      <Route path="/coaches/:coachId" element={<CoachProfile />} />
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