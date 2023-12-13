import Table from "../util/Table/Table";
import { useSelector } from "react-redux";
import { danhSachPBS } from "../../redux/selector";
import { nameColumsPhieuBanHang } from "../util/Table/ColumnName";
import ActionModals from "./ActionModals";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { THONGTINPHIEU } from "../../action/Actions";
import API from "../../API/API";

function PhieuBanHang() {
    const dispatch = useDispatch();
    const token = localStorage.getItem("TKN");
    const data = useSelector(danhSachPBS);
    const [isShow, setIsShow] = useState(false);
    const [type, setType] = useState();

    const [dataRecord, setDataRecord] = useState([]);
    const handleView = async (record) => {
        await THONGTINPHIEU(API.CHITIETPBS, token, record?.SoChungTu, dispatch);
        setIsShow(true);
        setType("view");
        setDataRecord(record);
    };
    const handleEdit = async (record) => {
        await THONGTINPHIEU(API.CHITIETPBS, token, record?.SoChungTu, dispatch);
        setIsShow(true);
        setType("edit");
        setDataRecord(record);
    };
    const handleClose = () => {
        setIsShow(false);
        console.log("he");
    };
    return (
        <>
            <div>Phiếu Bán Hàng List</div>

            <Table
                param={data.DataResults}
                columName={nameColumsPhieuBanHang}
                handleView={handleView}
                handleEdit={handleEdit}
                height={"h400"}
            />
            <ActionModals
                isShow={isShow}
                handleClose={handleClose}
                dataRecord={dataRecord}
                typeAction={type}
            />
        </>
    );
}

export default PhieuBanHang;
