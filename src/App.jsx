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
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            console.log("LoadDataa");

            await DANHSACHCHUCNANG(API.DANHSACHCHUCNANG, token, dispatch);
            await DANHSACHHANGHOA(API.DANHSACHHANGHOA, token, dispatch);
            await KHOANNGAY(API.KHOANNGAY, token, dispatch);
            await DATATONGHOP(API.TONGHOP, token, dispatch);

            setDataLoaded(true);
        };

        loadData();
    }, [token, dispatch]);

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
        </Router>
    );
}

export default App;
