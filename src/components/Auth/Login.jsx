import { useState, useEffect } from "react";
import { DANHSACHDULIEU, LOGIN } from "../../action/Actions";
import { GoogleLogin } from "@react-oauth/google";
import API from "../../API/API";
import { useDispatch } from "react-redux";
import VietTas from "../../assets/img/viettas.jfif";
import "./auth.css";
import CollectionCreateForm from "./Popup";
import { useSelector } from "react-redux";
import { authDataSelector } from "../../redux/selector";
import { toast } from "react-toastify";

const App = () => {
    const dispatch = useDispatch();
    const data = useSelector(authDataSelector);
    const [user, setUser] = useState({
        User: "",
        Pass: "",
    });

    // const [isShow, setIsShow] = useState(false);
    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    useEffect(() => {
        const fetchData = async () => {
            await DANHSACHDULIEU(API.DANHSACHDULIEU, user, dispatch);
        };
        fetchData();
    }, [dispatch, user, API]);

    const handleAddUser = async () => {
        console.log(data);
        if (data?.DataResults.length === 1) {
            const remoteDB = data.DataResults[0].RemoteDB;
            console.log(remoteDB);

            await LOGIN(API.DANGNHAP, data.TKN, remoteDB, dispatch);
            window.location.href = "/";
        } else if (data?.DataResults.length > 1) {
            setIsLoggedIn(true);
        }
        if (data?.DataResults && data?.DataResults.length == 0) {
            toast.error("Sai tài khoản hoặc mật khẩu");
        }
    };
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleGoogleLogin = async (TokenID) => {
        try {
            await DANHSACHDULIEU(
                API.DANHSACHDULIEU,
                { TokenId: TokenID.credential },
                dispatch
            );
            setIsLoggedIn(true);
        } catch (error) {
            console.error("Đăng nhập thất bại", error);
        }
    };
    const close = () => {
        setIsLoggedIn(false);
    };

    return (
        <main className="bg-color">
            <div className="container">
                <div className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                                <div className="card mb-3">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-center py-4">
                                            <a
                                                href="index.html"
                                                className="logo d-flex align-items-center w-auto"
                                            >
                                                <img
                                                    src={VietTas}
                                                    alt="VietTas"
                                                />
                                            </a>
                                        </div>
                                        <div className="pt-4 pb-2">
                                            <h5 className="card-title text-center pb-0 fs-4">
                                                Login to Your Account
                                            </h5>
                                            <p className="text-center small">
                                                Enter your username & password
                                                to login
                                            </p>
                                        </div>

                                        <div className="row g-3 needs-validation">
                                            <div className="col-12">
                                                <label className="form-label">
                                                    Username
                                                </label>
                                                <div className="input-group has-validation">
                                                    <span className="input-group-text">
                                                        @
                                                    </span>
                                                    <input
                                                        className="form-control"
                                                        type="email"
                                                        name="User"
                                                        required
                                                        //   autoComplete="on"
                                                        placeholder="Email *"
                                                        value={user.User}
                                                        onChange={onChangeInput}
                                                    />
                                                    <div className="invalid-feedback">
                                                        Please enter your
                                                        username.
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <label className="form-label">
                                                    Password
                                                </label>

                                                <input
                                                    className="form-control"
                                                    type="password"
                                                    name="Pass"
                                                    required
                                                    // autoComplete="on"
                                                    placeholder="Password *"
                                                    value={user.Pass}
                                                    onChange={onChangeInput}
                                                />
                                                <div className="invalid-feedback">
                                                    Please enter your password!
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="remember"
                                                        value="true"
                                                        id="rememberMe"
                                                    />
                                                    <label className="form-check-label">
                                                        Remember me
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="flex justify-center items-center w-full">
                                                    <GoogleLogin
                                                        onSuccess={
                                                            handleGoogleLogin
                                                        }
                                                        onError={() => {
                                                            console.log(
                                                                "Login Failed"
                                                            );
                                                        }}
                                                    />
                                                </div>
                                                <button
                                                    className="btn btn-primary w-100"
                                                    onClick={handleAddUser}
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#exampleModal"
                                                >
                                                    Login
                                                </button>
                                            </div>
                                            <div className="col-12">
                                                <p className="small mb-0">
                                                    {" Don't have account? "}
                                                    <a href="pages-register.html">
                                                        Create an account
                                                    </a>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <CollectionCreateForm /> */}
                                {isLoggedIn ? (
                                    <CollectionCreateForm
                                        isShow={isLoggedIn}
                                        close={close}
                                    />
                                ) : null}
                                <div className="credits">
                                    {"Designed by "}
                                    <a href="https://bootstrapmade.com/">
                                        BootstrapMade
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};
export default App;
