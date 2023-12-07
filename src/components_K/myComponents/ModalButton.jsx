import React from "react";

const ModalButton = () => {
  return (
    <div>
      <div className="flex gap-4 ">
        <div
          title="Xem"
          className="p-[3px] border-2 border-yellow-500 rounded-md text-yellow-500 hover:text-white hover:bg-yellow-500 "
        >
          <FaRegEye size={16} />
        </div>
        <div
          title="Sửa"
          className="p-[3px] text-purple-500 border  border-purple-500 rounded-md hover:text-white hover:bg-purple-500  "
        >
          <FaRegEdit size={16} />
        </div>
        <div
          onClick={handleDelete}
          title="Xóa"
          className="p-[3px] text-red-500 border  border-red-500 rounded-md hover:text-white hover:bg-red-500  "
        >
          <MdDelete size={16} />
        </div>
        <div
          title="In phiếu"
          className="p-[3px] text-blue-500 border  border-blue-500 rounded-md hover:text-white hover:bg-blue-500  "
        >
          <TiPrinter size={16} />
        </div>
      </div>
    </div>
  );
};

export default ModalButton;
