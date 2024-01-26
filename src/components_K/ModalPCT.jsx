/* eslint-disable react/prop-types */
// import React from 'react'
// import ActionButton from '../components/util/Button/ActionButton'
// import { Checkbox, Tooltip } from 'antd'
import logo from '../assets/VTS-iSale.ico'
const ModalPCT = ({ actionType, namePage, close }) => {
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
        <div className="p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
          {actionType === 'view' && (
            <div className=" w-[60vw] h-[600px]">
              <div className="flex gap-2">
                <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
                <label className="text-blue-700 font-semibold uppercase pb-1">thông tin - {namePage}</label>
              </div>
              <div className="border w-full h-[90%] rounded-sm text-sm">
                <div className="flex  ">
                  {/* thong tin phieu */}
                  <div className="w-full">
                    <div className="flex p-1  ">
                      <div className=" flex items-center  ">
                        <label className="w-full">Số phiếu thu</label>
                        <input disabled type="text" className="w-full border border-gray-300 outline-none  px-2 rounded-[4px] h-[24px]" />
                      </div>
                      <div className=" flex items-center ">
                        <label className="w-full">Ngày</label>
                        <input disabled type="text" className="w-full border border-gray-300 outline-none  px-2 rounded-[4px] h-[24px]" />
                      </div>
                      <div className=" flex items-center ">
                        <label className="w-full">Chứng từ góc</label>
                        <input disabled type="text" className="w-full border border-gray-300 outline-none  px-2 rounded-[4px] h-[24px]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* button */}
              <div className="flex justify-between items-center pt-3">
                <div className="flex gap-x-3   ">
                  <button
                    //   onClick={() => setIsShowModalOnlyPrint(true)}
                    className="flex items-center  py-1 px-2  rounded-md  border-2 border-purple-500 text-slate-50 text-text-main font-bold  bg-purple-500 hover:bg-white hover:text-purple-500"
                  >
                    <div className="pr-1">{/* <TiPrinter size={20} /> */}</div>
                    <div>In phiếu</div>
                  </button>
                </div>
                <button
                  onClick={() => close()}
                  className="active:scale-[.98] active:duration-75 border-2 border-rose-500 text-slate-50 text-text-main font-bold  bg-rose-500 hover:bg-white hover:text-rose-500  rounded-md px-2 py-1 w-[80px] "
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ModalPCT
