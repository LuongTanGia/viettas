import "./index.css";
import "./App.css";

import {
    Route,
    Routes,
    BrowserRouter as Router,
    Navigate,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import Home from "./components/Home/Home";
import { useState } from "react";
import {
    DANHSACHCHUCNANG,
    DANHSACHHANGHOA,
    KHOANNGAY,
    DATATONGHOP,
} from "./action/Actions";
import API from "./API/API";
import { useDispatch } from "react-redux";

function App() {
    const token = localStorage.getItem("TKN");
    console.log(token);
    const dispatch = useDispatch();
    // useEffect(() => {
    //     console.log("LoadDataa");
    //     const getDANHSACH = async () =>
    //         await DANHSACHCHUCNANG(API.DANHSACHCHUCNANG, token, dispatch);
    //     getDANHSACH();

    //     const getDANHSACHHANGHOA = async () =>
    //         await DANHSACHHANGHOA(API.DANHSACHHANGHOA, token, dispatch);
    //     getDANHSACHHANGHOA();

    //     const getKHOANNGAY = async () =>
    //         await KHOANNGAY(API.KHOANNGAY, token, dispatch);
    //     getKHOANNGAY();

    //     const getDataTongHop = async () =>
    //         await DATATONGHOP(API.TONGHOP, token, dispatch);
    //     getDataTongHop();
    // }, []);

    (async function loadData() {
        console.log("LoadDataa");

        await DANHSACHCHUCNANG(API.DANHSACHCHUCNANG, token, dispatch);
        await DANHSACHHANGHOA(API.DANHSACHHANGHOA, token, dispatch);
        await KHOANNGAY(API.KHOANNGAY, token, dispatch);
        await DATATONGHOP(API.TONGHOP, token, dispatch);
    })();

    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    const handleToggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    const isLogged = localStorage.getItem("firstLogin");

    return (
        <Router>
            <Routes>
                <Route
                    path="*"
                    element={
                        isLogged === "true" ? (
                            <Home
                                handleToggleSidebar={handleToggleSidebar}
                                isSidebarVisible={isSidebarVisible}
                            />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
