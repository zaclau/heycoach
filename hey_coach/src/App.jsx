import { BrowserRouter } from "react-router-dom";
import Pages from "./Pages.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
// require("dotenv").config();

function App() {
  const clientId = process.env.REACT_APP_GAPI_CLIENT_ID;
  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId={clientId}>
        <Pages />
      </GoogleOAuthProvider> 
      
    </BrowserRouter>
  );
}

export default App;
