import "./index.css";
import "./App.css";
import { useEffect } from "react";
import LoadingPage from "../src/components/util/Loading/LoadingPage";
import {
    Route,
    Routes,
    BrowserRouter as Router,
    Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Auth/Login";
import Home from "./components/Home/Home";

import { useState } from "react";
import {
    DANHSACHCHUCNANG,
    DANHSACHHANGHOA,
    KHOANNGAY,
    DATATONGHOP,
    DATADULIEU,
} from "./action/Actions";
import API from "./API/API";
import { useDispatch, useSelector } from "react-redux";
import { khoanNgaySelect } from "./redux/selector";

function App() {
    const token = localStorage.getItem("TKN");
    const tokenRF = localStorage.getItem("RTKN");

    const KhoanNgay = useSelector(khoanNgaySelect);

    const dispatch = useDispatch();
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            console.log("LoadDataa");
            await DANHSACHCHUCNANG(API.DANHSACHCHUCNANG, token, dispatch);
            await DANHSACHHANGHOA(API.DANHSACHHANGHOA, token, dispatch);
            await KHOANNGAY(API.KHOANNGAY, token, dispatch);
            await DATATONGHOP(API.TONGHOP, token, KhoanNgay, dispatch);
            await DATADULIEU(API.PHIEUMUAHANG, token, dispatch);

            // if (tokenRF) {
            //     setTimeout(async () => {
            //         await REFTOKEN(API.REFTOKEN, { TokenID: tokenRF });
            //     }, 10000);
            // }

            setDataLoaded(true);
        };

        loadData();
    }, [token, dispatch, tokenRF]);

    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    const handleToggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    const isLogged = localStorage.getItem("firstLogin");

    if (!dataLoaded) {
        return <LoadingPage />;
    }

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
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </Router>
    );
}

export default App;
