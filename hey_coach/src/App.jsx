import { BrowserRouter } from "react-router-dom";
import Pages from "./Pages.jsx";
//import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <BrowserRouter>
      <Pages />
    </BrowserRouter>
  );
}

export default App;