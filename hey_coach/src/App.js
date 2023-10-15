import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Listings from "./pages/listings/Listings";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";
import Bookings from "./pages/bookings/Bookings";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/listings" element={<Listings />}/>
        <Route path="/bookings" element={<Bookings />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
