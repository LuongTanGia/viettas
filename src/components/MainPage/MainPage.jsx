import { Route, Routes } from "react-router-dom";
import ErrorPage from "../util/Erorr/ErrorPage";
import DashBoar from "../DashBoar/DashBoar";
// import Home from "../Home/Home";

// eslint-disable-next-line react/prop-types
function MainPage({ isSidebarVisible }) {
    return (
        <>
            <main
                id="main"
                className={isSidebarVisible ? "main" : "main show_main"}
            >
                <Routes>
                    <Route path="/" element={<DashBoar />} />
                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            </main>
        </>
    );
}

export default MainPage;
