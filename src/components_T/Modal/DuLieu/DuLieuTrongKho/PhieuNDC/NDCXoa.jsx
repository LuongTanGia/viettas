/* eslint-disable react/prop-types */
import { IoMdClose } from "react-icons/io";
import categoryAPI from "../../../../../API/linkAPI";
import { toast } from "react-toastify";

const NCKXoa = ({ close, dataNDC }) => {
  const TokenAccess = localStorage.getItem("TKN");

  const handleDelete = async () => {
    try {
      const response = await categoryAPI.NDCDelete(
        dataNDC?.SoChungTu,
        TokenAccess
      );
      if (response.data.DataError == 0) {
        toast.success(response.data.DataErrorDescription);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-screen h-screen fixed top-0 left-0 right-0 bottom-0 zIndex">
      <div
        onClick={close}
        className="overlay bg-gray-800 bg-opacity-80 w-screen h-screen fixed top-0 left-0 right-0 bottom-0"
      ></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col min-w-[40rem] min-h-[8rem] bg-white  p-2 rounded-xl shadow-custom overflow-hidden">
        <div className="flex flex-col gap-2 p-2">
          <div className="flex items-center justify-between">
            <p className="text-blue-700 font-semibold uppercase">Xóa dữ liệu</p>
            <div className="flex justify-end">
              <IoMdClose
                className="w-6 h-6 rounded-full border-current cursor-pointer hover:bg-slate-200 hover:text-red-500"
                onClick={close}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 border-2 p-3 font-bold text-lg">
            <div className="flex gap-1">
              <p className="text-blue-700 uppercase">Bạn có chắc muốn xóa</p>
              <p className="text-red-600">{dataNDC?.SoChungTu}</p>
              <p className="text-blue-700 uppercase">?</p>
            </div>
            <p className="text-slate-500 text-lg font-light">
              Thông tin sản phẩm không thể hoàn tác nếu bạn xóa !
            </p>
          </div>
          <div className="flex justify-end">
            <div
              className=" bg-blue-500 p-2 rounded-lg text-white cursor-pointer"
              onClick={handleDelete}
            >
              Xác nhận
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NCKXoa;
