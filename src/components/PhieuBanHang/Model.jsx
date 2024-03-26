/* eslint-disable react/prop-types */
function Model({ isShow, handleClose, record, ActionDelete, typeModel, ActionPay }) {
  return (
    <>
      {isShow ? (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
          <div className="  m-4 p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
            <div className=" flex justify-between items-center ">
              <label>
                {typeModel === 'Delete' ? ' Bạn có chắc muốn xóa phiếu' : 'Bạn có muốn lập phiếu thu tiền'}
                <span className="font-bold mx-1">{record.SoChungTu}</span>
                không ?
              </label>
              <div></div>
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => (typeModel === 'Delete' ? ActionDelete(record) : typeModel === 'Pay' ? ActionPay(record) : null)}
                className="active:scale-[.98] active:duration-75 red-500 border-2 border-bg-main text-slate-50 text-text-main font-bold  bg-bg-main hover:bg-white hover:text-bg-main rounded-md px-2 py-1  w-[80px] "
              >
                Xác nhận
              </button>
              <button
                onClick={handleClose}
                className="active:scale-[.98] active:duration-75  border-2 border-rose-500 text-slate-50 text-text-main font-bold  bg-rose-500 hover:bg-white hover:text-rose-500 rounded-md px-2 py-1 w-[80px] "
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default Model
