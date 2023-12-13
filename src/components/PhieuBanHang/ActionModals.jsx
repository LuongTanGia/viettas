/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import icons from "../../untils/icons";
import { chiTietPBS } from "../../redux/selector";
import "./phieumuahang.css";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import Tables from "../util/Table/Table";
import { DatePicker, Space } from "antd";
const { IoMdClose } = icons;
const { RangePicker } = DatePicker;
// eslint-disable-next-line react/prop-types
function ActionModals({ isShow, handleClose, dataRecord, typeAction }) {
    const [isModalOpen, setIsModalOpen] = useState(isShow);
    const data_chitiet = useSelector(chiTietPBS);
    console.log(data_chitiet);
    useEffect(() => {
        setIsModalOpen(isShow);
    }, [isShow, dataRecord, data_chitiet]);
    const dateFormat = "YYYY/MM/DD";

    // Action Sửa

    return (
        <>
            {isModalOpen ? (
                <div>
                    <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
                        <div className="m-6 p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
                            <div className=" w-[90vw] h-[600px] ">
                                <div className="flex justify-between  items-start pb-1">
                                    <label className="font-bold ">
                                        Xem thông tin - phiếu mua hàng
                                    </label>
                                    <button
                                        onClick={() => handleClose()}
                                        className="text-gray-500 p-1  hover: hover:bg-red-600 hover:text-white rounded-full"
                                    >
                                        <IoMdClose />
                                    </button>
                                </div>
                                <div className=" w-full h-[96%] rounded-sm text-sm border border-gray-300">
                                    <div className="flex box_thongtin">
                                        {/* thong tin phieu */}
                                        <div className="w-[60%]">
                                            <div className="flex p-1 gap-12 w-full justify-between">
                                                <div className=" flex items-center ">
                                                    <label className="">
                                                        Số chứng từ
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className=" outline-none  px-2"
                                                        value={
                                                            dataRecord.SoChungTu
                                                        }
                                                        readOnly={
                                                            typeAction ===
                                                                "view" ||
                                                            typeAction ===
                                                                "edit"
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                </div>
                                                <Space
                                                    direction="vertical"
                                                    size={12}
                                                >
                                                    <RangePicker
                                                        className={
                                                            typeAction ===
                                                            "edit"
                                                                ? "date_edit"
                                                                : ""
                                                        }
                                                        style={
                                                            typeAction ===
                                                            "edit"
                                                                ? {
                                                                      background:
                                                                          "white",
                                                                  }
                                                                : {}
                                                        }
                                                        disabled={
                                                            typeAction ===
                                                            "view"
                                                                ? true
                                                                : false
                                                        }
                                                        size="large"
                                                        format="DD/MM/YYYY"
                                                        defaultValue={
                                                            data_chitiet
                                                                ? [
                                                                      dayjs(
                                                                          data_chitiet
                                                                              ?.DataResult
                                                                              ?.NgayCTu,
                                                                          dateFormat
                                                                      ),
                                                                      dayjs(
                                                                          data_chitiet
                                                                              ?.DataResult
                                                                              ?.DaoHan,
                                                                          dateFormat
                                                                      ),
                                                                  ]
                                                                : []
                                                        }
                                                    />
                                                </Space>
                                            </div>
                                            <div className="p-1 flex justify-between items-center">
                                                <label
                                                    form="doituong"
                                                    className="w-[86px]"
                                                >
                                                    Đối tượng
                                                </label>
                                                <select
                                                    className="   w-full outline-none "
                                                    value={`${data_chitiet?.DataResult?.MaDoiTuong} - ${data_chitiet?.DataResult?.TenDoiTuong}`}
                                                    readOnly={
                                                        typeAction === "view" ||
                                                        typeAction === "edit"
                                                            ? true
                                                            : false
                                                    }
                                                >
                                                    <option value="MaDoiTuong_TenDoiTuong">
                                                        {
                                                            data_chitiet
                                                                ?.DataResult
                                                                ?.MaDoiTuong
                                                        }
                                                        -
                                                        {
                                                            data_chitiet
                                                                ?.DataResult
                                                                ?.TenDoiTuong
                                                        }
                                                    </option>
                                                </select>
                                            </div>
                                            <div className="flex items-center justify-between p-1">
                                                <label className="w-[86px]">
                                                    Tên
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full   outline-none px-2 "
                                                    value={
                                                        data_chitiet?.DataResult
                                                            ?.TenDoiTuong
                                                    }
                                                    readOnly={
                                                        typeAction === "view" ||
                                                        typeAction === "edit"
                                                            ? true
                                                            : false
                                                    }
                                                />
                                            </div>
                                            <div className="flex items-center justify-between p-1">
                                                <label className="w-[86px]">
                                                    Địa chỉ
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full   outline-none px-2 "
                                                    value={
                                                        data_chitiet?.DataResult
                                                            ?.DiaChi
                                                    }
                                                    readOnly={
                                                        typeAction === "view" ||
                                                        typeAction === "edit"
                                                            ? true
                                                            : false
                                                    }
                                                />
                                            </div>
                                            <div className="flex items-center  w-full">
                                                <div className="p-1 flex  items-center w-1/2 ">
                                                    <label
                                                        form="khohang"
                                                        className="w-[94px]"
                                                    >
                                                        Kho hàng
                                                    </label>
                                                    <select
                                                        className={`w-full hover:-gray-500 ${
                                                            typeAction ===
                                                            "edit"
                                                                ? "bg-white"
                                                                : ""
                                                        }`}
                                                        readOnly={
                                                            typeAction ===
                                                            "view"
                                                                ? true
                                                                : false
                                                        }
                                                    >
                                                        <option value="ThongTinKho">
                                                            {
                                                                data_chitiet
                                                                    ?.DataResult
                                                                    ?.MaKho
                                                            }{" "}
                                                            -{" "}
                                                            {
                                                                data_chitiet
                                                                    ?.DataResult
                                                                    ?.TenKho
                                                            }
                                                        </option>
                                                    </select>
                                                </div>
                                                <div className="flex items-center p-1 w-1/2">
                                                    <label className="w-[86px]">
                                                        Ghi chú
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className={`w-full   outline-none px-2 ${
                                                            typeAction ===
                                                            "edit"
                                                                ? "bg-white"
                                                                : ""
                                                        }`}
                                                        value={
                                                            data_chitiet
                                                                ?.DataResult
                                                                ?.GhiChu
                                                        }
                                                        readOnly={
                                                            typeAction ===
                                                            "view"
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {/* thong tin cap nhat */}
                                        <div className="w-[40%] py-1 box_content">
                                            <div className="text-center p-1 font-medium text_capnhat">
                                                Thông tin cập nhật
                                            </div>
                                            <div className="-2 rounded-md w-[98%] h-[80%] box_capnhat">
                                                <div className="flex justify-between items-center ">
                                                    <div className="flex items-center p-1  ">
                                                        <label className="">
                                                            Người tạo
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="   outline-none px-2"
                                                            value={
                                                                data_chitiet
                                                                    ?.DataResult
                                                                    ?.NguoiTao
                                                            }
                                                            readOnly={
                                                                typeAction ===
                                                                    "view" ||
                                                                typeAction ===
                                                                    "edit"
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                    </div>
                                                    <div className="flex items-center p-1 w-1/2">
                                                        <label className="">
                                                            Lúc
                                                        </label>
                                                        <input
                                                            readOnly={
                                                                typeAction ===
                                                                    "view" ||
                                                                typeAction ===
                                                                    "edit"
                                                                    ? true
                                                                    : false
                                                            }
                                                            type="text"
                                                            className="w-full   outline-none px-2 "
                                                            value={
                                                                data_chitiet
                                                                    ?.DataResult
                                                                    ?.NgayTao
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center ">
                                                    <div className="flex items-center p-1  ">
                                                        <label className="">
                                                            Sửa cuối
                                                        </label>
                                                        <input
                                                            readOnly={
                                                                typeAction ===
                                                                    "view" ||
                                                                typeAction ===
                                                                    "edit"
                                                                    ? true
                                                                    : false
                                                            }
                                                            type="text"
                                                            className="   outline-none px-2 "
                                                            value={
                                                                data_chitiet
                                                                    ?.DataResult
                                                                    ?.NguoiSuaCuoi
                                                            }
                                                        />
                                                    </div>
                                                    <div className="flex items-center p-1 w-1/2">
                                                        <label className="">
                                                            Lúc
                                                        </label>
                                                        <input
                                                            readOnly={
                                                                typeAction ===
                                                                    "view" ||
                                                                typeAction ===
                                                                    "edit"
                                                                    ? true
                                                                    : false
                                                            }
                                                            type="text"
                                                            className="w-full   outline-none px-2 "
                                                            value={
                                                                data_chitiet
                                                                    ?.DataResult
                                                                    ?.NguoiSuaCuoi
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        {data_chitiet ? (
                                            <Tables
                                                param={
                                                    data_chitiet?.DataResult
                                                        ?.DataDetails
                                                }
                                                columName={""}
                                                height={"h250"}
                                            />
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
}

export default ActionModals;
