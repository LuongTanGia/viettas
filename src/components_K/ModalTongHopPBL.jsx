/* eslint-disable react/prop-types */
import { Tooltip } from 'antd'
import dayjs from 'dayjs'
import logo from '../assets/VTS-iSale.ico'
import * as apis from '../apis'
import { RETOKEN, formatPrice } from '../action/Actions'
import { DateField } from '@mui/x-date-pickers'
import ActionButton from '../components/util/Button/ActionButton'
import { toast } from 'react-toastify'

import icons from '../untils/icons'
// import { toast } from 'react-toastify'
const { GoQuestion } = icons
const ModalTongHopPBL = ({ actionType, typePage, namePage, close, dataRecord, dataThongSo, loading, formSynthetics }) => {
  const formSynthetic = {
    NgayCTu: dataRecord ? dataRecord.NgayCTu : '',
    Quay: dataRecord ? dataRecord.Quay : 0,
    Ca: dataRecord ? dataRecord.Ca : '',
    NhanVien: dataRecord ? dataRecord.NhanVien : '',
  }

  const formDEL = {
    NgayCTu: dataRecord ? dataRecord.NgayCTu : '',
    Quay: dataRecord ? dataRecord.Quay : 0,
    Ca: dataRecord ? dataRecord.Ca : '',
    NhanVien: dataRecord ? dataRecord.NguoiTao : '',
  }

  const handleLapChungTu = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')

      let response
      switch (typePage) {
        case 'TongHopPBL':
          response = await apis.TongHopPBL(tokenLogin, formSynthetic)
          break
        // case 'SDR':
        //   response = await apis.ThemSDR(tokenLogin, formCreate)
        //   break
        default:
          break
      }

      if (response) {
        const { DataError, DataErrorDescription } = response.data
        if (DataError === 0) {
          toast.success(DataErrorDescription)
          loading()
          close()
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{DataErrorDescription}</div>)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          handleLapChungTu()
        } else {
          toast.error(DataErrorDescription)
        }
      }
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const formTest = [
    {
      NgayCTu: '2024-03-22T06:44:20.558Z',
      Quay: 2,
      Ca: '1',
      NhanVien: 'nhanvien1',
    },
    {
      NgayCTu: '2024-03-23T06:44:20.558Z',
      Quay: 2,
      Ca: '1',
      NhanVien: 'nhanvien2',
    },
    {
      NgayCTu: '2024-03-24T06:44:20.558Z',
      Quay: 2,
      Ca: '1',
      NhanVien: 'nhanvien3',
    },
    {
      NgayCTu: '2024-03-25T06:44:20.558Z',
      Quay: 2,
      Ca: '1',
      NhanVien: 'nhanvien4',
    },
  ]

  const handleSynthetics = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      let allSuccess = true
      for (const obj of formTest) {
        console.log('nooooo', obj)
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // let response
        // response = await apis.TongHopPBL(tokenLogin, obj)
        // if (response) {
        //   const { DataError } = response
        //   if (DataError === -1 || DataError === -2 || DataError === -3) {
        //     allSuccess = false
        //   } else if (DataError === -107 || DataError === -108) {
        //     await RETOKEN()
        //     handleSynthetics()
        //   } else {
        //     allSuccess = false
        //   }
        // }
      }

      // if (allSuccess) {
      //   toast.success('Xử lý dự liệu thành công')
      //   loading()
      //   close()
      // } else {
      //   toast.error('Xử lý dự liệu thất bại')
      // }
    } catch (error) {
      console.error('Error while saving data:', error)
      toast.error('Có lỗi xảy ra khi xử lý dữ liệu')
    }
  }

  // const handleSynthetics = async () => {
  //   try {
  //     const tokenLogin = localStorage.getItem('TKN')
  //     const apiCalls = formSynthetics.DanhSach.map(async (obj) => {
  //       let response
  //       switch (typePage) {
  //         case 'TongHopPBL':
  //           response = await apis.TongHopPBL(tokenLogin, obj)
  //           break

  //         default:
  //           break
  //       }
  //       return response?.data ?? null
  //     })

  //     const responses = await Promise.all(apiCalls)

  //     const allSuccessful = responses.every((response) => response && response.DataError === 0)

  //     if (allSuccessful) {
  //       toast.success('Xử lý dữ liệu thành công')
  //       loading()
  //       close()
  //     } else {
  //       toast.warning('Không thể xử lý dữ liệu')
  //     }
  //   } catch (error) {
  //     console.error('Error while saving data:', error)
  //   }
  // }

  const handleDelete = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      let response
      switch (typePage) {
        case 'GoChotCa':
          response = await apis.GoChotCa(tokenLogin, formDEL)
          break

        default:
          break
      }
      if (response) {
        const { DataError, DataErrorDescription } = response.data
        if (DataError === 0) {
          toast.success(DataErrorDescription)
          loading()
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{DataErrorDescription}</div>)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          handleDelete()
        } else {
          toast.error(DataErrorDescription)
        }
      }
      close()
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  return (
    <>
      <div className=" fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
        <div className="p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
          {actionType === 'view' && (
            <div className="w-[90vw] h-[600px]">
              <div className="flex gap-2">
                <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
                <label className="text-blue-700 font-semibold uppercase pb-1">{namePage}</label>
              </div>
              <div className="border w-full h-[90%] rounded-[4px]-sm text-sm">
                <div className="grid grid-cols-4  gap-3 m-2">
                  <div className="flex  items-center gap-1 ">
                    <label className="min-w-[90px] text-sm flex justify-end">Quầy</label>
                    <input
                      value={dataRecord.Quay}
                      type="text"
                      className="text-end h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300 outline-none  truncate"
                      disabled
                    />
                  </div>
                  <div className="flex items-center  gap-2 ">
                    <label className="text-sm ">Ngày</label>
                    <DateField
                      className="w-[135px] bg-[#fafafa]"
                      format="DD/MM/YYYY"
                      value={dayjs(dataRecord?.NgayCTu)}
                      disabled
                      sx={{
                        '& .MuiButtonBase-root': {
                          padding: '4px',
                        },

                        '& .MuiSvgIcon-root': {
                          width: '18px',
                          height: '18px',
                        },
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-1 ">
                    <label className="w-[30px] text-sm flex justify-end">Ca</label>
                    <input
                      value={dataRecord.Ca}
                      type="text"
                      className="text-end h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300 outline-none  truncate"
                      disabled
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4  gap-3 m-2">
                  <div className="flex items-center gap-1 ">
                    <label className="min-w-[90px] text-sm flex justify-end whitespace-nowrap">Nhân viên</label>
                    <input
                      value={dataRecord.NhanVien}
                      type="text"
                      className="text-end h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300 outline-none  truncate"
                      disabled
                    />
                  </div>
                  <div className="flex items-center gap-1 ">
                    <input
                      // value={dataRecord.SoChungTu}
                      type="text"
                      className="h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300 outline-none  truncate"
                      disabled
                    />
                  </div>
                  <div className="flex items-center gap-1 ">
                    <label className=" w-[30px] text-sm flex justify-end">Kho</label>
                    <input
                      // value={dataRecord.SoChungTu}
                      type="text"
                      className="h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300 outline-none  truncate"
                      disabled
                    />
                  </div>
                  <div className="flex items-center gap-1 ">
                    <input
                      // value={dataRecord.SoChungTu}
                      type="text"
                      className="h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300 outline-none  truncate"
                      disabled
                    />
                  </div>
                  <div className="flex items-center gap-1 ">
                    <label className="min-w-[90px] text-sm flex justify-end whitespace-nowrap">Tổng tiền bán</label>
                    <input
                      value={formatPrice(dataRecord.TongThanhTien, dataThongSo.SOLESOTIEN)}
                      type="text"
                      className="text-end h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300 outline-none  truncate"
                      disabled
                    />
                  </div>
                  <div className="flex items-center gap-1 ">
                    <label className="text-sm flex justify-end whitespace-nowrap">Thu khác tại quầy</label>
                    <input
                      value={formatPrice(dataRecord.TongThu, dataThongSo.SOLESOTIEN)}
                      type="text"
                      className="text-end h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300 outline-none  truncate"
                      disabled
                    />
                  </div>
                  <div className="flex items-center gap-1 ">
                    <label className=" text-sm flex justify-end whitespace-nowrap">Chi khác tại quầy</label>
                    <input
                      value={formatPrice(dataRecord.TongChi, dataThongSo.SOLESOTIEN)}
                      type="text"
                      className="text-end h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300 outline-none  truncate"
                      disabled
                    />
                  </div>
                  <div className="flex items-center gap-1 ">
                    <label className="   text-sm flex justify-end whitespace-nowrap">Số tiền phải nộp</label>
                    <input
                      value={formatPrice(dataRecord.TienPhaiNop, dataThongSo.SOLESOTIEN)}
                      type="text"
                      className="text-end h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300 outline-none  truncate"
                      disabled
                    />
                  </div>
                </div>
              </div>
              {/* button */}
              <div className="flex justify-end items-center pt-[10px] gap-2 ">
                <ActionButton
                  color={'slate-50'}
                  title={'Lập chứng từ'}
                  isModal={true}
                  background={'bg-main'}
                  bg_hover={'white'}
                  color_hover={'bg-main'}
                  handleAction={() => handleLapChungTu()}
                />
                <ActionButton color={'slate-50'} title={'Đóng'} isModal={true} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
              </div>
            </div>
          )}
          {actionType === 'delete' && (
            <div className=" items-center  ">
              <label className="text-blue-700 font-semibold uppercase pb-1">Kiểm tra dữ liệu</label>
              <div className="flex items-center  border p-3 gap-3">
                <div className="text-bg-main">
                  <GoQuestion size={40}></GoQuestion>
                </div>
                <div className="flex flex-col gap-1 ">
                  <label>Bạn đang gỡ dữ liệu của :</label>
                  <div className="px-4 ">
                    Ngày : <span>{dayjs(dataRecord.NgayCTu).format('DD/MM/YYYY')}</span>
                  </div>
                  <div className="px-4">
                    Quầy : <span>{dataRecord.Quay}</span>
                  </div>
                  <div className="px-4">
                    Ca : <span>{dataRecord.Ca}</span>
                  </div>
                  <div className="px-4">
                    Nhân viên : <span>{dataRecord.NguoiTao}</span>
                  </div>
                  <div>Bạn có chắc chắn muốn gỡ dữ liệu này không?</div>
                </div>
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <ActionButton
                  color={'slate-50'}
                  title={'Xác nhận'}
                  isModal={true}
                  background={'bg-main'}
                  bg_hover={'white'}
                  color_hover={'bg-main'}
                  handleAction={() => handleDelete(dataRecord)}
                />

                <ActionButton color={'slate-50'} title={'Đóng'} isModal={true} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
              </div>
            </div>
          )}
          {actionType === 'synthetics' && (
            <div className=" items-center  ">
              <label className="text-blue-700 font-semibold uppercase pb-1">Kiểm tra dữ liệu</label>
              <div className="flex items-center  border p-3 gap-3">
                <div className="text-bg-main">
                  <GoQuestion size={40}></GoQuestion>
                </div>
                <div className="flex flex-col gap-1 ">
                  <label>
                    Bạn đang tổng hợp nhanh <span className="font-bold">{formSynthetics.DanhSach.length}</span> dòng dữ liệu bán lẻ theo quầy :
                  </label>
                  <div>Chỉ những dòng dữ liệu không bị khóa và chưa được xử lý mới có thể tập hợp được </div>
                  <div>Bạn có chắc chắn không?</div>
                </div>
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <ActionButton
                  color={'slate-50'}
                  title={'Xác nhận'}
                  isModal={true}
                  background={'bg-main'}
                  bg_hover={'white'}
                  color_hover={'bg-main'}
                  handleAction={() => handleSynthetics()}
                  // handleAction={() => close()}
                />

                <ActionButton color={'slate-50'} title={'Đóng'} isModal={true} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ModalTongHopPBL
