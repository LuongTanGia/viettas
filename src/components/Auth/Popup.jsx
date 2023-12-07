import { useSelector, useDispatch } from "react-redux";
import { authDataSelector } from "../../redux/selector";
import { LOGIN } from "../../action/Actions";

import API from "../../API/API";
import { useState } from "react";
import Cookies from "js-cookie";
// eslint-disable-next-line react/prop-types
const CollectionCreateForm = ({ isShow, close }) => {
    const data = useSelector(authDataSelector);
    const [RemoteDB, setRemoteDB] = useState();
    const dispatch = useDispatch();
    const handleLogin = async () => {
        await LOGIN(API.DANGNHAP, data.TKN, RemoteDB, dispatch);
        window.localStorage.setItem("firstLogin", true);
        Cookies.set("user", true);
        window.location.href = "/";
    };
    const handleChangeRadio = (e) => {
        setRemoteDB(e.target.value);
    };
    console.log(isShow);
    return (
        <>
            {isShow ? (
                <div
                    className="modal fade show"
                    id="exampleModal"
                    // tabindex="-1"
                    aria-labelledby="exampleModalLabel"
                    // aria-hidden="true"
                    aria-modal="true"
                    style={isShow ? { display: "block" } : { display: "none" }}
                >
                    <div className="modal-dialog show">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1
                                    className="modal-title fs-5"
                                    id="exampleModalLabel"
                                >
                                    {data.DataResults
                                        ? "DANH SÁCH DỮ LIỆU"
                                        : "ERROR LOGIN"}
                                </h1>
                            </div>
                            <div className="modal-body">
                                {data.DataResults ? (
                                    data.DataResults.map((item, index) =>
                                        item.RemoteDB ? (
                                            <div key={index}>
                                                {item.RemoteDB}
                                                <input
                                                    type="radio"
                                                    value={item.RemoteDB}
                                                    checked={
                                                        RemoteDB ===
                                                        item.RemoteDB
                                                    }
                                                    name="remoteDB"
                                                    onChange={handleChangeRadio}
                                                />
                                            </div>
                                        ) : null
                                    )
                                ) : (
                                    <p className="error_login">
                                        {data.DataErrorDescription}
                                    </p>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                                    data-bs-dismiss="modal"
                                    onClick={() => close()}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    data-bs-dismiss="modal"
                                    onClick={handleLogin}
                                >
                                    Save changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default CollectionCreateForm;
