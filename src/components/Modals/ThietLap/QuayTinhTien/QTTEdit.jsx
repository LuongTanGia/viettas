/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import moment from 'moment'
import { toast } from 'react-toastify'
import { FaPlus } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { Checkbox, Input, InputNumber, Select, Tooltip } from 'antd'
import categoryAPI from '../../../../API/linkAPI'
import logo from '../../../../assets/VTS-iSale.ico'
import { RETOKEN } from '../../../../action/Actions'
import ActionButton from '../../../util/Button/ActionButton'
import SimpleBackdrop from '../../../util/Loading/LoadingPage'
import KHOCreate from '../KhoHang/KHOCreate'
const QTTEdit = ({ close, loadingData, setTargetRow, dataQTT }) => {
  const TokenAccess = localStorage.getItem('TKN')
  const [dataKho, setDataKho] = useState(null)
  const [dataNhomGia, setDataNhomGia] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isShowModal, setIsShowModal] = useState(false)
  const [isMaKHO, setIsMaKHO] = useState('')
  const innitProduct = {
    Quay: '',
    TenMayTinh: '',
    SQLServer: '',
    SQLDatabase: '',
    SQLUser: '',
    SQLPassword: '',
    MaKho: '',
    CungServer: false,
    CungHeThong: false,
    Loai: 1,
    NA: false,
    NhomGia: '',
    GhiChu: '',
  }
  const [QTTForm, setQTTForm] = useState(() => {
    return dataQTT ? { ...dataQTT } : innitProduct
  })
  const [errors, setErrors] = useState({
    Quay: '',
    TenMayTinh: '',
    SQLServer: '',
    SQLUser: '',
    MaKho: '',
  })
  useEffect(() => {
    setTargetRow([])
  }, [])

  useEffect(() => {
    const getListHelper = async () => {
      try {
        const response = await categoryAPI.ListHelper_Kho(TokenAccess)
        if (response.data.DataError == 0) {
          setDataKho(response.data.DataResults)
          setIsLoading(true)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getListHelper()
        }
      } catch (error) {
        setIsLoading(true)
      }
    }
    if (!isLoading) {
      getListHelper()
    }
  }, [isLoading])

  useEffect(() => {
    const getListHelper = async () => {
      try {
        const response = await categoryAPI.ListHelper_NhomGia(TokenAccess)
        if (response.data.DataError == 0) {
          setDataNhomGia(response.data.DataResults)
          setIsLoading(true)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getListHelper()
        }
      } catch (error) {
        setIsLoading(true)
      }
    }
    if (!isLoading) {
      getListHelper()
    }
  }, [isLoading])

  const handleLoading = () => {
    setIsLoading(false)
  }

  const handleEdit = async () => {
    if (!QTTForm?.TenMayTinh?.trim() || !QTTForm?.SQLServer?.trim() || !QTTForm?.SQLUser?.trim() || isMaKHO ? null : !QTTForm?.MaKho?.trim()) {
      setErrors({
        TenMayTinh: QTTForm?.TenMayTinh?.trim() ? null : 'Tên máy tính không được trống',
        SQLServer: QTTForm?.SQLServer?.trim() ? null : 'Trạm không được trống',
        SQLUser: QTTForm?.SQLUser?.trim() ? null : 'User không được trống',
        MaKho: isMaKHO ? null : QTTForm?.MaKho?.trim() ? null : 'Kho không được trống',
      })
      return
    }
    try {
      const response = await categoryAPI.SuaQuayTinhTien({ Ma: dataQTT?.Quay, Data: { ...QTTForm, MaKho: isMaKHO ? isMaKHO : QTTForm.MaKho } }, TokenAccess)
      if (response.data.DataError == 0) {
        close()
        loadingData()
        toast.success('Sửa thành công', { autoClose: 1000 })
        setTargetRow(dataQTT?.Quay)
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
              <div className="flex flex-col gap-2 py-1 px-2 md:w-[85vw] lg:w-[65vw] xl:w-[50vw] 2xl:w-[40vw]">
                <div className="flex gap-2">
                  <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                  <p className="text-blue-700 font-semibold uppercase">Sửa - Quầy tính tiền</p>
                </div>
                <div className="flex flex-col gap-2 border-2 px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Quầy</label>
                      <InputNumber required size="small" className="w-[100%] overflow-hidden whitespace-nowrap overflow-ellipsis" value={QTTForm?.Quay} readOnly disabled />
                    </div>
                    <div className="flex items-center">
                      <Checkbox
                        checked={QTTForm?.CungServer}
                        className="text-sm whitespace-nowrap"
                        onChange={(e) =>
                          setQTTForm({
                            ...QTTForm,
                            CungServer: e.target.checked,
                            CungHeThong: QTTForm.CungHeThong == true ? e.target.checked : false,
                          })
                        }
                      >
                        Cùng mạng
                      </Checkbox>
                    </div>
                    <div className="flex items-center">
                      <Checkbox
                        checked={QTTForm?.CungHeThong}
                        className="text-sm whitespace-nowrap"
                        onChange={(e) =>
                          setQTTForm({
                            ...QTTForm,
                            CungHeThong: e.target.checked,
                            CungServer: QTTForm.CungServer == false ? e.target.checked : true,
                          })
                        }
                      >
                        Cùng máy
                      </Checkbox>
                    </div>
                    <div className="flex items-center">
                      <Checkbox
                        checked={QTTForm?.NA}
                        className="text-sm whitespace-nowrap"
                        onChange={(e) =>
                          setQTTForm({
                            ...QTTForm,
                            NA: e.target.checked,
                          })
                        }
                      >
                        Ngưng dùng
                      </Checkbox>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <label className="whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Tên máy tính</label>
                    <Input
                      size="small"
                      placeholder={errors.TenMayTinh && errors.TenMayTinh}
                      className={`${errors.TenMayTinh ? 'border-red-500' : ''} w-[100%] overflow-hidden whitespace-nowrap overflow-ellipsis`}
                      value={QTTForm?.TenMayTinh}
                      onChange={(e) => {
                        setQTTForm({
                          ...QTTForm,
                          TenMayTinh: e.target.value,
                        })
                        setErrors({ ...errors, TenMayTinh: '' })
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <label className="whitespace-nowrap required min-w-[90px] text-sm flex justify-end">SQL trạm</label>
                    <Input
                      size="small"
                      placeholder={errors.SQLServer && errors.SQLServer}
                      className={`${errors.SQLServer ? 'border-red-500' : ''} w-[100%] overflow-hidden whitespace-nowrap overflow-ellipsis`}
                      value={QTTForm?.SQLServer}
                      onChange={(e) => {
                        setQTTForm({
                          ...QTTForm,
                          SQLServer: e.target.value,
                        })
                        setErrors({ ...errors, SQLServer: '' })
                      }}
                    />
                  </div>
                  <div className="flex">
                    <div className="flex items-center gap-1 w-[100%]">
                      <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">SQL user</label>
                      <Input
                        size="small"
                        placeholder={errors.SQLUser && errors.SQLUser}
                        className={`${errors.SQLUser ? 'border-red-500' : ''} w-[100%] overflow-hidden whitespace-nowrap overflow-ellipsis`}
                        value={QTTForm?.SQLUser}
                        onChange={(e) => {
                          setQTTForm({
                            ...QTTForm,
                            SQLUser: e.target.value,
                          })
                          setErrors({ ...errors, SQLUser: '' })
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-1 w-[100%]">
                      <label className="whitespace-nowrap min-w-[90px] text-sm flex justify-end">SQL pass</label>
                      <Input.Password
                        size="small"
                        className="w-full overflow-hidden whitespace-nowrap overflow-ellipsis"
                        value={QTTForm?.SQLPassword}
                        onChange={(e) => {
                          setQTTForm({
                            ...QTTForm,
                            SQLPassword: e.target.value,
                          })
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap  min-w-[90px] text-sm flex justify-end">Dữ liệu</label>
                    <Input
                      size="small"
                      className="w-full overflow-hidden whitespace-nowrap overflow-ellipsis"
                      value={QTTForm?.SQLDatabase}
                      onChange={(e) => {
                        setQTTForm({
                          ...QTTForm,
                          SQLDatabase: e.target.value,
                        })
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 w-[100%]">
                      <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Kho</label>
                      <Select
                        style={{ width: '100%' }}
                        showSearch
                        required
                        size="small"
                        status={errors.MaKho ? 'error' : ''}
                        placeholder={errors?.MaKho ? errors?.MaKho : ''}
                        value={isMaKHO ? isMaKHO : QTTForm?.MaKho || undefined}
                        onChange={(value) => {
                          setQTTForm({
                            ...QTTForm,
                            MaKho: value,
                          })
                          setErrors({ ...errors, MaKho: '' })
                        }}
                      >
                        {dataKho &&
                          dataKho?.map((item, index) => (
                            <Select.Option key={index} value={item.MaKho}>
                              {item.ThongTinKho}
                            </Select.Option>
                          ))}
                      </Select>
                    </div>
                    <div onClick={() => setIsShowModal(true)}>
                      <Tooltip title="Tạo kho mới" color="blue">
                        <FaPlus className=" w-5 h-5 cursor-pointer text-blue-500 border-2 border-blue-500 hover:bg-blue-500 hover:text-white" />
                      </Tooltip>
                    </div>
                  </div>

                  <div className="flex items-center gap-12 ml-[100px]">
                    <div className="flex items-center">
                      <Checkbox disabled checked={false} className="text-sm whitespace-nowrap">
                        Bán lẻ
                      </Checkbox>
                    </div>
                    <div className="flex items-center">
                      <Checkbox
                        checked={QTTForm?.Loai == 1 ? true : true}
                        className="text-sm whitespace-nowrap"
                        onChange={(e) =>
                          setQTTForm({
                            ...QTTForm,
                            Loai: e.target.checked ? 1 : 0,
                          })
                        }
                      >
                        Terminal
                      </Checkbox>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <label className="whitespace-nowrap min-w-[90px] text-sm flex justify-end">Nhóm giá</label>
                    <Select
                      style={{ width: '100%' }}
                      showSearch
                      size="small"
                      value={QTTForm?.NhomGia || undefined}
                      onChange={(value) => {
                        setQTTForm({
                          ...QTTForm,
                          NhomGia: value,
                        })
                      }}
                    >
                      {dataNhomGia &&
                        dataNhomGia?.map((item, index) => (
                          <Select.Option key={index} value={item.Ma}>
                            {item.ThongTinNhomGia}
                          </Select.Option>
                        ))}
                    </Select>
                  </div>
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap  min-w-[90px] text-sm flex justify-end">Ghi chú</label>
                    <Input
                      size="small"
                      className="w-full overflow-hidden whitespace-nowrap overflow-ellipsis"
                      value={QTTForm?.GhiChu}
                      onChange={(e) => {
                        setQTTForm({
                          ...QTTForm,
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
                        <Tooltip title={dataQTT?.NguoiTao} color="blue">
                          <input
                            value={dataQTT?.NguoiTao || ''}
                            className="2xl:w-[17vw] lg:w-[18vw] md:w-[24vw] px-2 rounded resize-none border outline-none text-[1rem] truncate"
                            readOnly
                          />
                        </Tooltip>
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className=" text-sm">Lúc</label>
                        <Tooltip title={moment(dataQTT?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss')} color="blue">
                          <input
                            value={moment(dataQTT?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss') || ''}
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
                        <Tooltip title={dataQTT?.NguoiSuaCuoi} color="blue">
                          <input
                            value={dataQTT?.NguoiSuaCuoi || ''}
                            className="2xl:w-[17vw] lg:w-[18vw] md:w-[24vw] px-2 rounded  resize-none border outline-none text-[1rem] truncate"
                            readOnly
                          />
                        </Tooltip>
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className=" text-sm">Lúc</label>
                        <Tooltip title={dataQTT?.NgaySuaCuoi ? moment(dataQTT?.NgaySuaCuoi)?.format('DD/MM/YYYY HH:mm:ss') : ''} color="blue">
                          <input
                            value={dataQTT?.NgaySuaCuoi ? moment(dataQTT?.NgaySuaCuoi)?.format('DD/MM/YYYY HH:mm:ss') : '' || ''}
                            className="px-2 rounded w-full resize-none border outline-none text-[1rem] truncate"
                            readOnly
                          />
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <ActionButton handleAction={() => handleEdit()} title={'Xác nhận'} color={'slate-50'} background={'blue-500'} color_hover={'blue-500'} bg_hover={'white'} />
                  <ActionButton handleAction={close} title={'Đóng'} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
                </div>
              </div>
            </div>
          </div>
          <div>{isShowModal && <KHOCreate close={() => setIsShowModal(false)} loadingData={handleLoading} setTargetRow={setTargetRow} isKHO={true} setIsMaKHO={setIsMaKHO} />}</div>
        </>
      )}
    </>
  )
}

export default QTTEdit
