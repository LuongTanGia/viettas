import "./App.css";

import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Login from "./components/Auth/Login";
import Home from "./components/Home/Home";

import { DANHSACHCHUCNANG, DANHSACHHANGHOA } from "./action/Actions";
import API from "./API/API";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

function App() {
    const token = localStorage.getItem("TKN");
    console.log(token);
    const dispatch = useDispatch();
    useEffect(() => {
        console.log("LoadDataa");
        const getDANHSACH = async () =>
            await DANHSACHCHUCNANG(API.DANHSACHCHUCNANG, token, dispatch);
        getDANHSACH();

        const getDANHSACHHANGHOA = async () =>
            await DANHSACHHANGHOA(API.DANHSACHHANGHOA, token, dispatch);
        getDANHSACHHANGHOA();
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Home />} />
            </Routes>
        </Router>
    );
}

export default App;
