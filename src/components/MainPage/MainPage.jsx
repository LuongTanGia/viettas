import { Route, Routes } from "react-router-dom";
import ErrorPage from "../util/Erorr/ErrorPage";
import DashBoar from "../DashBoar/DashBoar";
// import Home from "../Home/Home";

function MainPage() {
    return (
        <>
            <Routes>
                <Route path="/" element={<DashBoar />} />
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </>
    );
}

export default MainPage;
