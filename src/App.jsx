import "./index.css";
import "./App.css";
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
import Test from "./components/util/testComponents/Test";
import { useState } from "react";

function App() {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    const handleToggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    const isLogged = localStorage.getItem("firstLogin");

    // if (!dataLoaded) {
    //     return <LoadingPage />;
    // }

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
                <Route path="/test" element={<Test />} />
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
