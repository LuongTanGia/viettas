/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { toast } from 'react-toastify'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { Checkbox, Input, Select, Tooltip } from 'antd'
import categoryAPI from '../../../../API/linkAPI'
import logo from '../../../../assets/VTS-iSale.ico'
import { RETOKEN } from '../../../../action/Actions'
import ActionButton from '../../../util/Button/ActionButton'
import SimpleBackdrop from '../../../util/Loading/LoadingPage'
const DTEdit = ({ close, loadingData, setTargetRow, dataDT }) => {
  const TokenAccess = localStorage.getItem('TKN')
  const [isLoading, setIsLoading] = useState(false)
  const [nhomDT, setNhomDT] = useState()

  const innitProduct = {
    Loai: 2,
    Nhom: '',
    Ma: '',
    Ten: '',
    DiaChi: '',
    QuanHuyen: '',
    TinhThanh: '',
    NguoiLienHe: '',
    DienThoai: '',
    Fax: '',
    Email: '',
    MST: '',
    GhiChu: '',
  }
  const [DTForm, setDTForm] = useState(() => {
    return dataDT ? { ...dataDT } : innitProduct
  })

  useEffect(() => {
    setTargetRow([])
  }, [])

  useEffect(() => {
    const getListHelper = async () => {
      try {
        const response = await categoryAPI.ListNhomDoiTuong(TokenAccess)
        if (response.data.DataError == 0) {
          setNhomDT(response.data.DataResults)
          setIsLoading(true)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getListHelper()
        }
      } catch (error) {
        console.error(error)
        setIsLoading(true)
      }
    }
    if (!isLoading) {
      getListHelper()
    }
  }, [isLoading])

  const handleEdit = async () => {
    console.log({ Ma: dataDT?.Ma, Data: { ...DTForm } })
    try {
      const response = await categoryAPI.SuaDoiTuong({ Ma: dataDT?.Ma, Data: { ...DTForm } }, TokenAccess)
      if (response.data.DataError == 0) {
        close()
        loadingData()
        console.log(response.data)
        toast.success('Sửa thành công', { autoClose: 1000 })
        setTargetRow(dataDT.Ma)
      } else {
        toast.error(response.data.DataErrorDescription, { autoClose: 1000 })
      }
    } catch (error) {
      console.log(error)
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
              <div className="flex flex-col gap-2 py-1 px-2 w-[50vw]">
                <div className="flex gap-2">
                  <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                  <p className="text-blue-700 font-semibold uppercase">Sửa - Đối Tượng</p>
                </div>
                <div className="flex flex-col gap-2 border-2 px-3 py-2.5">
                  <div className="flex gap-8 justify-around">
                    <div className="flex items-center">
                      <Checkbox
                        checked={DTForm?.Loai === 1}
                        className="text-sm"
                        onChange={(e) =>
                          setDTForm({
                            ...DTForm,
                            Loai: e.target.checked ? 1 : 2,
                          })
                        }
                      >
                        Nhà Cung Cấp
                      </Checkbox>
                    </div>
                    <div className="flex items-center">
                      <Checkbox
                        checked={DTForm?.Loai === 2}
                        className="text-sm"
                        onChange={(e) =>
                          setDTForm({
                            ...DTForm,
                            Loai: e.target.checked ? 2 : 1,
                          })
                        }
                      >
                        Khách Hàng
                      </Checkbox>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap min-w-[90px] text-sm flex justify-end">Nhóm</label>
                    <Select
                      style={{ width: '100%' }}
                      showSearch
                      required
                      size="small"
                      value={DTForm?.Nhom || undefined}
                      onChange={(value) => {
                        setDTForm({
                          ...DTForm,
                          Nhom: value,
                        })
                      }}
                    >
                      {nhomDT &&
                        nhomDT?.map((item) => (
                          <Select.Option key={item.Ma} value={item.Ma}>
                            {item.ThongTinNhomDoiTuong}
                          </Select.Option>
                        ))}
                    </Select>
                  </div>
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Mã</label>
                    <Input
                      required
                      size="small"
                      className=" w-full overflow-hidden whitespace-nowrap overflow-ellipsis"
                      value={DTForm?.Ma}
                      onChange={(e) => {
                        setDTForm({
                          ...DTForm,
                          Ma: e.target.value,
                        })
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Tên</label>
                    <Input
                      required
                      size="small"
                      className="w-full overflow-hidden whitespace-nowrap overflow-ellipsis"
                      value={DTForm?.Ten}
                      onChange={(e) => {
                        setDTForm({
                          ...DTForm,
                          Ten: e.target.value,
                        })
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap min-w-[90px] text-sm flex justify-end">Địa chỉ</label>
                    <Input
                      required
                      size="small"
                      className="w-full overflow-hidden whitespace-nowrap overflow-ellipsis"
                      value={DTForm?.DiaChi}
                      onChange={(e) => {
                        setDTForm({
                          ...DTForm,
                          DiaChi: e.target.value,
                        })
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap min-w-[90px] text-sm flex justify-end">Quận huyện</label>
                    <Input
                      required
                      size="small"
                      className="w-full overflow-hidden whitespace-nowrap overflow-ellipsis"
                      value={DTForm?.QuanHuyen}
                      onChange={(e) => {
                        setDTForm({
                          ...DTForm,
                          QuanHuyen: e.target.value,
                        })
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap min-w-[90px] text-sm flex justify-end">Tỉnh thành</label>
                    <Input
                      required
                      size="small"
                      className="w-full overflow-hidden whitespace-nowrap overflow-ellipsis"
                      value={DTForm?.TinhThanh}
                      onChange={(e) => {
                        setDTForm({
                          ...DTForm,
                          TinhThanh: e.target.value,
                        })
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Mã số thuế</label>
                    <Input
                      required
                      size="small"
                      className=" w-full overflow-hidden whitespace-nowrap overflow-ellipsis"
                      value={DTForm?.MST}
                      onChange={(e) => {
                        setDTForm({
                          ...DTForm,
                          MST: e.target.value,
                        })
                      }}
                    />{' '}
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1">
                      <label className=" whitespace-nowrap min-w-[90px] text-sm flex justify-end">Điện thoại</label>
                      <Input
                        required
                        size="small"
                        className="w-full overflow-hidden whitespace-nowrap overflow-ellipsis"
                        value={DTForm?.DienThoai}
                        onChange={(e) => {
                          setDTForm({
                            ...DTForm,
                            DienThoai: e.target.value,
                          })
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <label className=" whitespace-nowrap text-sm flex justify-end">Fax</label>
                      <Input
                        required
                        size="small"
                        className="w-full overflow-hidden whitespace-nowrap overflow-ellipsis"
                        value={DTForm?.Fax}
                        onChange={(e) => {
                          setDTForm({
                            ...DTForm,
                            Fax: e.target.value,
                          })
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap  min-w-[90px] text-sm flex justify-end">Người liên hệ</label>
                    <Input
                      required
                      size="small"
                      className="w-full overflow-hidden whitespace-nowrap overflow-ellipsis"
                      value={DTForm?.NguoiLienHe}
                      onChange={(e) => {
                        setDTForm({
                          ...DTForm,
                          NguoiLienHe: e.target.value,
                        })
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap  min-w-[90px] text-sm flex justify-end">Ghi chú</label>
                    <Input
                      required
                      size="small"
                      className="w-full overflow-hidden whitespace-nowrap overflow-ellipsis"
                      value={DTForm?.GhiChu}
                      onChange={(e) => {
                        setDTForm({
                          ...DTForm,
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
                        <Tooltip title={dataDT?.NguoiTao} color="blue">
                          <input
                            value={dataDT?.NguoiTao || ''}
                            className="2xl:w-[20vw] lg:w-[18vw] md:w-[15vw] px-2 rounded resize-none border-[0.125rem] outline-none text-[1rem] truncate"
                            readOnly
                          />
                        </Tooltip>
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className=" text-sm">Lúc</label>
                        <Tooltip title={moment(dataDT?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss')} color="blue">
                          <input
                            value={moment(dataDT?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss') || ''}
                            type="text"
                            className="px-2 rounded w-full resize-none border-[0.125rem] outline-none text-[1rem] truncate"
                            readOnly
                          />
                        </Tooltip>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className=" text-sm">Người sửa</label>
                        <Tooltip title={dataDT?.NguoiSuaCuoi} color="blue">
                          <input
                            value={dataDT?.NguoiSuaCuoi || ''}
                            className="2xl:w-[20vw] lg:w-[18vw] md:w-[15vw] px-2 rounded  resize-none border-[0.125rem] outline-none text-[1rem] truncate"
                            readOnly
                          />
                        </Tooltip>
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className=" text-sm">Lúc</label>
                        <Tooltip title={dataDT?.NgaySuaCuoi ? moment(dataDT?.NgaySuaCuoi)?.format('DD/MM/YYYY HH:mm:ss') : ''} color="blue">
                          <input
                            value={dataDT?.NgaySuaCuoi ? moment(dataDT?.NgaySuaCuoi)?.format('DD/MM/YYYY HH:mm:ss') : '' || ''}
                            className="px-2 rounded w-full resize-none border-[0.125rem] outline-none text-[1rem] truncate"
                            readOnly
                          />
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end ">
                  <ActionButton handleAction={() => handleEdit()} title={'Xác nhận'} color={'slate-50'} background={'blue-500'} color_hover={'blue-500'} bg_hover={'white'} />
                  <ActionButton handleAction={close} title={'Đóng'} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default DTEdit
