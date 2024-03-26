import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
const Modals = ({ actionType, record, title, isShowModal, close }) => {
    const [data, setData] = useState([]);
    const [isLoad, setIsLoad] = useState(false);

    useEffect(() => {
        setData(record);
        setIsLoad(true);
    }, [record]);

    return (
        <>
            {isShowModal ? (
                <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center  zIndex">
                    <div className="  m-6 p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
                        {isLoad ? (
                            <div className=" w-[90vw] h-[600px] ">
                                <div className="flex justify-between  items-start pb-1">
                                    <label className="font-bold ">
                                        Xem thông tin - phiếu mua hàng{" "}
                                        {(actionType, title)}
                                    </label>
                                    <button
                                        onClick={() => close()}
                                        className="text-gray-500 p-1 border hover:border-gray-300 hover:bg-red-600 hover:text-white rounded-full"
                                    >
                                        x
                                    </button>
                                </div>
                                <div className="border w-full h-[96%] rounded-sm text-sm">
                                    <div className="flex">
                                        {/* thong tin phieu */}
                                        <div className="w-[60%]">
                                            <div className="flex p-3 gap-12 w-full ">
                                                <div className=" flex items-center gap-2">
                                                    <label className="">
                                                        Số chứng từ
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className=" border border-gray-300 outline-none  px-2"
                                                        value={data?.SoChungTu}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <label className="">
                                                        Ngày
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="border border-gray-300 outline-none px-2 "
                                                        value={data?.NgayCTu}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <label className="">
                                                        Đáo hạn
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="border border-gray-300 outline-none px-2 "
                                                        value={data?.DaoHan}
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-3 flex justify-between items-center">
                                                <label
                                                    form="doituong"
                                                    className="w-[86px]"
                                                >
                                                    Đối tượng
                                                </label>
                                                <select className=" bg-white border w-full outline-none border-gray-300  ">
                                                    <option value="MaDoiTuong_TenDoiTuong">
                                                        {data?.MaDoiTuong} -{" "}
                                                        {data?.TenDoiTuong}
                                                    </option>
                                                </select>
                                            </div>
                                            <div className="flex items-center justify-between p-3">
                                                <label className="w-[86px]">
                                                    Tên
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full border border-gray-300 outline-none px-2 "
                                                    value={data?.TenDoiTuong}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between p-3">
                                                <label className="w-[86px]">
                                                    Địa chỉ
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full border border-gray-300 outline-none px-2 "
                                                    value={data?.DiaChi}
                                                />
                                            </div>
                                            <div className="flex items-center  w-full">
                                                <div className="p-3 flex  items-center w-1/2">
                                                    <label
                                                        form="khohang"
                                                        className="w-[94px]"
                                                    >
                                                        Kho hàng
                                                    </label>
                                                    <select className=" bg-white border w-full  border-gray-300 hover:border-gray-500 ">
                                                        <option value="ThongTinKho">
                                                            {data?.MaKho} -{" "}
                                                            {data?.TenKho}
                                                        </option>
                                                    </select>
                                                </div>
                                                <div className="flex items-center p-3 w-1/2">
                                                    <label className="w-[86px]">
                                                        Ghi chú
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="w-full border border-gray-300 outline-none px-2 "
                                                        value={data?.GhiChu}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {/* thong tin cap nhat */}
                                        <div className="w-[40%] py-1">
                                            <div className="text-center p-2 font-medium">
                                                Thông tin cập nhật
                                            </div>
                                            <div className="border-2 rounded-md w-[98%] h-[80%] ">
                                                <div className="flex justify-between items-center ">
                                                    <div className="flex items-center p-3  ">
                                                        <label className="">
                                                            Người tạo
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className=" border border-gray-300 outline-none px-2"
                                                            value={
                                                                data?.NguoiTao
                                                            }
                                                        />
                                                    </div>
                                                    <div className="flex items-center p-3 w-1/2">
                                                        <label className="">
                                                            Lúc
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="w-full border border-gray-300 outline-none px-2 "
                                                            value={""}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center ">
                                                    <div className="flex items-center p-3  ">
                                                        <label className="">
                                                            Sửa cuối
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className=" border border-gray-300 outline-none px-2 "
                                                            value={
                                                                data?.NguoiSuaCuoi
                                                            }
                                                        />
                                                    </div>
                                                    <div className="flex items-center p-3 w-1/2">
                                                        <label className="">
                                                            Lúc
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="w-full border border-gray-300 outline-none px-2 "
                                                            value={""}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4"></div>
                                </div>
                            </div>
                        ) : (
                            <p>Loading.......</p>
                        )}
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default Modals;
