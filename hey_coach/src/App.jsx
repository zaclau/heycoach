import React from 'react';
import { BrowserRouter, HashRouter } from "react-router-dom";
import Pages from "./Pages.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthContextProvider } from './auth/auth.jsx';

function App() {
  const clientId = process.env.REACT_APP_GAPI_CLIENT_ID;
  return (
    <HashRouter>
      <GoogleOAuthProvider clientId={clientId}>
        <AuthContextProvider>
          <Pages />
        </AuthContextProvider>
      </GoogleOAuthProvider> 
      
    </HashRouter>
  );
}

export default App;
