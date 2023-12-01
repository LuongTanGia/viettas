import "./App.css";

import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Login from "./components/Auth/Login";
import Home from "./components/Home/Home";
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
            </Routes>
        </Router>
    );
}

export default App;
