import React from 'react';
import { BrowserRouter } from "react-router-dom";
import Pages from "./Pages.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
// require("dotenv").config();

function App() {
  console.log('Entered App!');
  return (
    <BrowserRouter>
      <GoogleOAuthProvider
        clientId="453091724462-34n2nq33sgu268q1r22hmllr4g8fnp0s.apps.googleusercontent.com"  
      >
        <Pages />
      </GoogleOAuthProvider> 
      
    </BrowserRouter>
  );
}

export default App;
