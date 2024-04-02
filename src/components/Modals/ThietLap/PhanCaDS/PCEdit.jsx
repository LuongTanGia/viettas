/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { toast } from 'react-toastify'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { Input, Select, Tooltip } from 'antd'
import categoryAPI from '../../../../API/linkAPI'
import logo from '../../../../assets/VTS-iSale.ico'
import ActionButton from '../../../util/Button/ActionButton'
import { RETOKEN } from '../../../../action/Actions'
import SimpleBackdrop from '../../../util/Loading/LoadingPage'
const PCEdit = ({ close, loadingData, setTargetRow, dataPC }) => {
  const TokenAccess = localStorage.getItem('TKN')
  const [dataQuay, setDataQuay] = useState(null)
  const [dataCa, setDataCa] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const innitProduct = {
    SoQuay: 0,
    MaNguoiDung: '',
    HieuLucTu: '',
    MaCa: '',
    GhiChu: '',
  }
  const [PCForm, setPCForm] = useState(() => {
    return dataPC ? { ...dataPC } : innitProduct
  })

  useEffect(() => {
    setTargetRow([])
  }, [])

  useEffect(() => {
    const getListHelperQuay = async () => {
      try {
        const response = await categoryAPI.ListHelperPC_QuayTinhTien(TokenAccess)
        if (response.data.DataError == 0) {
          setDataQuay(response.data.DataResults)
          setIsLoading(true)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getListHelperQuay()
        }
      } catch (error) {
        setIsLoading(true)
      }
    }
    if (!isLoading) {
      getListHelperQuay()
    }
  }, [isLoading])

  useEffect(() => {
    const getListHelperCa = async () => {
      try {
        const response = await categoryAPI.ListHelperPC_CaLamViec(TokenAccess)
        if (response.data.DataError == 0) {
          setDataCa(response.data.DataResults)
          setIsLoading(true)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getListHelperCa()
        }
      } catch (error) {
        setIsLoading(true)
      }
    }
    if (!isLoading) {
      getListHelperCa()
    }
  }, [isLoading])

  const handleEdit = async () => {
    try {
      const response = await categoryAPI.SuaPhanCa({ Ma: dataPC?.MaNguoiDung, HieuLuc: dataPC?.HieuLucTu, Data: { ...PCForm } }, TokenAccess)
      if (response.data.DataError == 0) {
        close()
        loadingData()
        toast.success('Sửa thành công', { autoClose: 1000 })
        setTargetRow(dataPC?.MaPC)
      } else {
        toast.error(response.data.DataErrorDescription, { autoClose: 1000 })
      }
    } catch (error) {
      console.log(error)
      toast.error('Lỗi Server vui lòng thử lại', { autoClose: 1000 })
      close()
    }
  }
  return (
    <>
      {!isLoading ? (
        <SimpleBackdrop />
      ) : (
        <>
          <div className="w-screen h-screen fixed top-0 left-0 right-0 bottom-0 z-10">
            <div className="overlay bg-gray-800 bg-opacity-80 w-screen h-screen fixed top-0 left-0 right-0 bottom-0"></div>
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col bg-white p-2 rounded shadow-custom overflow-hidden">
              <div className="flex flex-col gap-2 py-1 px-2 md:w-[80vw] lg:w-[65vw] xl:w-[55vw] 2xl:w-[45vw]">
                <div className="flex gap-2">
                  <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                  <p className="text-blue-700 font-semibold uppercase">Sửa - Phân Ca</p>
                </div>
                <div className="flex flex-col gap-2 border-2 px-3 py-2.5">
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Người dùng</label>
                    <Input readOnly disabled required size="small" className="w-full overflow-hidden whitespace-nowrap overflow-ellipsis" value={PCForm?.MaNguoiDung} />
                  </div>
                  <div className="flex items-center ml-[15px] ">
                    <div className="flex items-center gap-1 w-full">
                      <label className="required whitespace-nowrap text-sm">Kể từ ngày</label>
                      <Input
                        readOnly
                        disabled
                        required
                        size="small"
                        className="w-full overflow-hidden whitespace-nowrap overflow-ellipsis"
                        value={moment(dataPC?.HieuLucTu)?.format('DD/MM/YYYY')}
                      />
                    </div>
                    <div className="flex items-center gap-1 w-full">
                      <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Quầy</label>
                      <Select
                        style={{ width: '100%' }}
                        showSearch
                        required
                        className="text-end"
                        size="small"
                        value={PCForm?.SoQuay || undefined}
                        onChange={(value) => {
                          setPCForm({
                            ...PCForm,
                            SoQuay: value,
                          })
                        }}
                      >
                        {dataQuay &&
                          dataQuay.map((item, index) => (
                            <Select.Option key={index} value={item.Quay}>
                              {item.Quay}
                            </Select.Option>
                          ))}
                      </Select>
                    </div>
                    <div className="flex items-center gap-1 w-[90%]">
                      <label className=" whitespace-nowrap min-w-[90px] text-sm flex justify-end">Ca</label>
                      <Select
                        style={{ width: '100%' }}
                        showSearch
                        required
                        size="small"
                        value={PCForm?.MaCa || undefined}
                        onChange={(value) => {
                          setPCForm({
                            ...PCForm,
                            MaCa: value,
                          })
                        }}
                      >
                        {dataCa &&
                          dataCa.map((item, index) => (
                            <Select.Option key={index} value={item.Ma}>
                              {item.ThongTinCaLamViec}
                            </Select.Option>
                          ))}
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap  min-w-[90px] text-sm flex justify-end">Ghi chú</label>
                    <Input
                      size="small"
                      className="w-full overflow-hidden whitespace-nowrap overflow-ellipsis"
                      value={PCForm?.GhiChu}
                      onChange={(e) => {
                        setPCForm({
                          ...PCForm,
                          GhiChu: e.target.value,
                        })
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-1 mt-1 gap-2 px-2 py-2.5 rounded border-black-200 ml-[95px] relative border-[0.125rem]">
                    <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                    <div className="flex gap-1">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <label className=" text-sm">Người tạo</label>
                        <Tooltip title={dataPC?.NguoiTao} color="blue">
                          <input
                            value={dataPC?.NguoiTao || ''}
                            className="2xl:w-[17vw] lg:w-[18vw] md:w-[24vw] px-2 rounded resize-none border outline-none text-[1rem] truncate"
                            readOnly
                          />
                        </Tooltip>
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className=" text-sm">Lúc</label>
                        <Tooltip title={moment(dataPC?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss')} color="blue">
                          <input
                            value={moment(dataPC?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss') || ''}
                            type="text"
                            className="px-2 rounded w-full resize-none border outline-none text-[1rem] truncate"
                            readOnly
                          />
                        </Tooltip>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className=" text-sm">Người sửa</label>
                        <Tooltip title={dataPC?.NguoiSuaCuoi} color="blue">
                          <input
                            value={dataPC?.NguoiSuaCuoi || ''}
                            className="2xl:w-[17vw] lg:w-[18vw] md:w-[24vw] px-2 rounded  resize-none border outline-none text-[1rem] truncate"
                            readOnly
                          />
                        </Tooltip>
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className=" text-sm">Lúc</label>
                        <Tooltip title={dataPC?.NgaySuaCuoi ? moment(dataPC?.NgaySuaCuoi)?.format('DD/MM/YYYY HH:mm:ss') : ''} color="blue">
                          <input
                            value={dataPC?.NgaySuaCuoi ? moment(dataPC?.NgaySuaCuoi)?.format('DD/MM/YYYY HH:mm:ss') : '' || ''}
                            className="px-2 rounded w-full resize-none border outline-none text-[1rem] truncate"
                            readOnly
                          />
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end ">
                  <ActionButton
                    handleAction={() => handleEdit()}
                    title={'Xác nhận'}
                    isModal={true}
                    color={'slate-50'}
                    background={'blue-500'}
                    color_hover={'blue-500'}
                    bg_hover={'white'}
                  />
                  <ActionButton handleAction={close} title={'Đóng'} isModal={true} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default PCEdit
