/* eslint-disable react/prop-types */

import { InputNumber, Select, Tooltip } from 'antd'
import dayjs from 'dayjs'
import logo from '../../../assets/VTS-iSale.ico'
import * as apis from '../../../apis'
import { RETOKEN } from '../../../action/Actions'
import { DateField } from '@mui/x-date-pickers'
import { useEffect, useState } from 'react'
import ActionButton from '../../../components/util/Button/ActionButton'
import { toast } from 'react-toastify'
import { Spin } from 'antd'
import ModalOnlyPrint from '../../ModalOnlyPrint'

const { Option } = Select

const CreateThuChi = ({ actionType, data, typePage, namePage, dataHangMuc, dataDoiTuong, dataThongSo, isLoadingModal, loading, setHightLight, close }) => {
  const [isShowModalOnlyPrint, setIsShowModalOnlyPrint] = useState(false)
  const [SctCreate, setSctCreate] = useState(null)
  const [doiTuongInfo, setDoiTuongInfo] = useState({ Ten: '', DiaChi: '' })
  const [errors, setErrors] = useState({
    Ten: '',
    DiaChi: '',
    GhiChu: '',
    SoTien: '',
    HangMuc: null,
    MaDoiTuong: null,
  })

  const ngayChungTu = dayjs().format('YYYY-MM-DD')
  const defaultFormCreate = {
    NgayCTu: ngayChungTu,
    HangMuc: null,
    MaDoiTuong: null,
    TenDoiTuong: '',
    DiaChi: '',
    SoTien: 0,
    GhiChu: '',
  }

  const [formCreate, setFormCreate] = useState(defaultFormCreate)
  const [formCreateTT, setFormCreateTT] = useState({})

  //  set value default

  useEffect(() => {
    if (dataHangMuc) {
      setFormCreate({ ...formCreate, HangMuc: dataHangMuc[1]?.Ma })
    }
  }, [dataHangMuc])

  useEffect(() => {
    if (dataDoiTuong) {
      const ncvlDoiTuong = dataDoiTuong.find((item) => item.Ma === 'NCVL')
      const defaultMa = ncvlDoiTuong?.Ma || dataDoiTuong[0]?.Ma || ''
      handleDoiTuongFocus(defaultMa)
    }
  }, [dataDoiTuong])

  const handleCreateAndClose = async () => {
    const errors = handleValidation()

    if (Object.keys(errors).length > 0) {
      setErrors(errors)
      return
    }

    try {
      const tokenLogin = localStorage.getItem('TKN')
      let response
      switch (typePage) {
        case 'PCT':
          response = await apis.ThemPCT(tokenLogin, formCreate)
          break
        case 'PTT':
          response = await apis.ThemPTT(tokenLogin, formCreate)
          break

        default:
          break
      }
      if (response) {
        const { DataError, DataErrorDescription, DataResults } = response.data
        if (DataError === 0) {
          toast.success(DataErrorDescription)
          const soChungTu = DataResults[0].SoChungTu
          loading()
          setHightLight(soChungTu)
          close()
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{DataErrorDescription}</div>)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          handleCreateAndClose()
        } else {
          toast.error(DataErrorDescription)
        }
      }
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handleCreate = async () => {
    const errors = handleValidation()

    if (Object.keys(errors).length > 0) {
      setErrors(errors)
      return
    }

    try {
      const tokenLogin = localStorage.getItem('TKN')
      let response
      switch (typePage) {
        case 'PCT':
          response = await apis.ThemPCT(tokenLogin, formCreate)
          break
        case 'PTT':
          response = await apis.ThemPTT(tokenLogin, formCreate)
          break

        default:
          break
      }

      if (response) {
        const { DataError, DataErrorDescription, DataResults } = response.data
        if (DataError === 0) {
          toast.success(DataErrorDescription)
          const soChungTu = DataResults[0].SoChungTu
          loading()
          setHightLight(soChungTu)
          setSctCreate(soChungTu)
          setFormCreate(defaultFormCreate)
          setDoiTuongInfo({ Ten: '', DiaChi: '' })
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{DataErrorDescription}</div>)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          handleCreateAndClose()
        } else {
          toast.error(DataErrorDescription)
        }
      }
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handlePrintInCreate = async () => {
    const errors = handleValidation()

    if (Object.keys(errors).length > 0) {
      setErrors(errors)
      return
    }
    try {
      const tokenLogin = localStorage.getItem('TKN')
      let response
      switch (typePage) {
        case 'PCT':
          response = await apis.ThemPCT(tokenLogin, formCreate)
          break
        case 'PTT':
          response = await apis.ThemPTT(tokenLogin, formCreate)
          break

        default:
          break
      }

      if (response) {
        const { DataError, DataErrorDescription, DataResults } = response.data
        if (DataError === 0) {
          const soChungTu = DataResults[0].SoChungTu
          loading()
          setHightLight(soChungTu)
          setSctCreate(soChungTu)
          setFormCreate(defaultFormCreate)
          setDoiTuongInfo({ Ten: '', DiaChi: '' })
          setIsShowModalOnlyPrint(true)
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{DataErrorDescription}</div>)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          handlePrintInCreate()
        } else {
          toast.error(DataErrorDescription)
        }
      }
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handleDoiTuongFocus = (selectedValue) => {
    const selectedDoiTuongInfo = dataDoiTuong.find((item) => item.Ma === selectedValue)
    setDoiTuongInfo(selectedDoiTuongInfo || { Ten: '', DiaChi: '' })

    setFormCreate({
      ...formCreate,
      MaDoiTuong: selectedValue,
      TenDoiTuong: selectedDoiTuongInfo?.Ten,
      DiaChi: selectedDoiTuongInfo?.DiaChi,
    })
    setErrors({ ...errors, Ten: '', DiaChi: '', MaDoiTuong: null })
  }

  const handleValidation = () => {
    let errors = {}

    if (
      !formCreate?.HangMuc?.trim() ||
      !formCreate?.MaDoiTuong?.trim() ||
      !formCreate?.GhiChu?.trim() ||
      formCreate?.SoTien === null ||
      formCreate?.SoTien === 0 ||
      formCreate?.NgayCTu === 'Invalid Date'
    ) {
      errors.HangMuc = formCreate?.HangMuc?.trim() ? null : 'Hạng mục không được để trống'
      errors.MaDoiTuong = formCreate?.MaDoiTuong?.trim() ? null : 'Đối tượng không được để trống'
      errors.GhiChu = formCreate?.GhiChu?.trim() ? '' : 'Ghi chú không được để trống'
      errors.NgayCTu = 'Ngày không được để trống'
      errors.SoTien = formCreate?.SoTien === null ? null : formCreate?.SoTien === 0 && 0

      if (formCreate.MaDoiTuong === 'NCVL' || formCreate.MaDoiTuong === 'KHVL') {
        if (!formCreate?.TenDoiTuong?.trim() || !formCreate?.DiaChi?.trim() || !formCreate?.GhiChu?.trim() || formCreate?.SoTien === null || formCreate?.SoTien === 0) {
          errors.Ten = formCreate?.TenDoiTuong?.trim() ? '' : 'Tên không được để trống'
          errors.DiaChi = formCreate?.DiaChi?.trim() ? '' : 'Địa chỉ không được để trống'
          errors.GhiChu = formCreate?.GhiChu?.trim() ? '' : 'Ghi chú không được để trống'
          errors.SoTien = formCreate?.SoTien === null ? null : formCreate?.SoTien === 0 && 0
          return errors
        }
      }
    }

    return errors
  }

  return (
    <>
      <div className="px-4 py-2 absolute shadow-lg bg-white rounded-md flex flex-col ">
        <div className="w-[700px]">
          <div>
            <div className="flex gap-2">
              <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
              <label className="text-blue-700 font-semibold uppercase pb-1">Thêm - {namePage} </label>
            </div>
          </div>

          <Spin spinning={isLoadingModal}>
            <div className="border-1 border-gray-400 w-full h-[86%] rounded-[4px]-sm text-sm">
              <div className="flex flex-col px-2 ">
                <div className=" py-2 px-2 gap-2  grid grid-cols-1">
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="grid grid-cols-3  gap-1 items-center">
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className="required  min-w-[90px]  flex justify-end">Số phiếu chi</label>
                        <input type="text" className="h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300  outline-none  truncate" disabled />
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className="required  min-w-[60px] text-sm flex justify-end">Ngày</label>
                        <DateField
                          className="DatePicker_PMH  max-w-[132px]"
                          format="DD/MM/YYYY"
                          value={dayjs(formCreate?.NgayCTu)}
                          onChange={(newDate) => {
                            setFormCreate({
                              ...formCreate,
                              NgayCTu: dayjs(newDate).format('YYYY-MM-DD'),
                            }),
                              setFormCreateTT({
                                ...formCreateTT,
                                NgayCTu: dayjs(newDate).format('YYYY-MM-DD'),
                              })
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { border: '1px solid #007FFF' },
                            '& .MuiButtonBase-root': {
                              padding: '4px',
                            },
                            '& .MuiSvgIcon-root': {
                              width: '18px',
                              height: '18px',
                            },
                            '& .MuiInputBase-input': {
                              // fontSize: '14px',
                              textAlign: 'center',
                            },
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className="  min-w-[64px] text-sm flex justify-end">C.từ góc</label>
                        <input type="text" className="h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300 outline-none  truncate" disabled />
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Hạng mục</label>
                      <Select
                        status={errors.HangMuc ? 'error' : ''}
                        placeholder={errors.HangMuc}
                        className="w-full"
                        showSearch
                        size="small"
                        optionFilterProp="children"
                        onChange={(value) => {
                          setFormCreate({
                            ...formCreate,
                            HangMuc: value,
                          })
                          setErrors({ ...errors, HangMuc: null })
                        }}
                        value={formCreate.HangMuc}
                      >
                        {dataHangMuc?.map((item) => (
                          <Option key={item.Ma} value={item.Ma}>
                            {item.Ten}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap  ">
                      <label className="required min-w-[90px] text-sm flex justify-end">Khách hàng</label>
                      <Select
                        status={errors.MaDoiTuong ? 'error' : ''}
                        placeholder={errors.MaDoiTuong}
                        showSearch
                        size="small"
                        optionFilterProp="children"
                        onChange={(value) => handleDoiTuongFocus(value)}
                        style={{ width: '100%' }}
                        value={formCreate.MaDoiTuong}
                        // listHeight={280}
                      >
                        {dataDoiTuong?.map((item) => (
                          <Option key={item.Ma} value={item.Ma}>
                            {item.Ma} - {item.Ten}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap  ">
                      <label className="required min-w-[90px] text-sm flex justify-end">Tên</label>
                      <input
                        placeholder={errors?.Ten}
                        type="text"
                        value={formCreate.MaDoiTuong === 'NCVL' || formCreate.MaDoiTuong === 'KHVL' ? formCreate.TenDoiTuong : doiTuongInfo.Ten}
                        className={`h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none  hover:border-blue-500
                                           ${(formCreate.MaDoiTuong === 'NCVL' && errors.Ten) || (formCreate.MaDoiTuong === 'KHVL' && errors.Ten) ? 'border-red-500' : ''} `}
                        onChange={(e) => {
                          setFormCreate({
                            ...formCreate,
                            TenDoiTuong: e.target.value,
                          })
                          setErrors({ ...errors, Ten: '' })
                        }}
                        disabled={formCreate.MaDoiTuong !== 'KHVL' && formCreate.MaDoiTuong !== 'NCVL'}
                      />
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap  ">
                      <label className="required min-w-[90px] text-sm flex justify-end">Địa chỉ</label>
                      <input
                        placeholder={errors?.DiaChi}
                        type="text"
                        value={formCreate.MaDoiTuong === 'NCVL' || formCreate.MaDoiTuong === 'KHVL' ? formCreate.DiaChi : doiTuongInfo.DiaChi}
                        className={`h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none  hover:border-blue-500
                                           ${(formCreate.MaDoiTuong === 'NCVL' && errors.DiaChi) || (formCreate.MaDoiTuong === 'KHVL' && errors.DiaChi) ? 'border-red-500' : ''} `}
                        onChange={(e) => {
                          setFormCreate({
                            ...formCreate,
                            DiaChi: e.target.value,
                          })
                          setErrors({ ...errors, DiaChi: '' })
                        }}
                        disabled={formCreate.MaDoiTuong !== 'KHVL' && formCreate.MaDoiTuong !== 'NCVL'}
                      />
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap  ">
                      <label className="required min-w-[90px] text-sm flex justify-end">Số tiền </label>
                      <InputNumber
                        className={`w-[20%]   
                                           ${errors.SoTien === 0 || errors.SoTien === null ? 'border-red-500' : ''} `}
                        placeholder={errors.SoTien}
                        size="small"
                        min={0}
                        max={999999999999}
                        value={formCreate.SoTien}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => {
                          const parsedValue = parseFloat(value.replace(/\$\s?|(,*)/g, ''))
                          return isNaN(parsedValue) ? null : parseFloat(parsedValue.toFixed(dataThongSo.SOLESOTIEN))
                        }}
                        onChange={(e) => {
                          setFormCreate({
                            ...formCreate,
                            SoTien: e,
                          })
                          setErrors({ ...errors, SoTien: e })
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <label className="required min-w-[90px] text-sm flex justify-end">Ghi chú</label>
                      <textarea
                        placeholder={errors.GhiChu}
                        type="text"
                        value={formCreate.GhiChu}
                        onChange={(e) => {
                          setFormCreate({
                            ...formCreate,
                            GhiChu: e.target.value,
                          })
                          setErrors({ ...errors, GhiChu: '' })
                        }}
                        className={`h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none hover:border-blue-500
                                           ${errors.GhiChu ? 'border-red-500' : ''} `}
                      />
                    </div>
                    {/* thong tin */}
                    <div className="grid grid-cols-1 mt-4 gap-2 px-2 py-2.5 rounded-[4px] border-black-200 ml-[95px] relative border-[1px] border-gray-300 ">
                      <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                      <div className="flex justify-between ">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <label className=" text-sm min-w-[64px] ">Người tạo</label>
                          <Tooltip color="blue">
                            <input disabled type="text" className="h-[24px] w-[270px]  px-2 rounded-[4px] resize-none border-[1px] border-gray-300 outline-none truncate" />
                          </Tooltip>
                        </div>
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <label className=" text-sm">Lúc</label>
                          <Tooltip color="blue">
                            <input disabled type="text" className="px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none text-center truncate" />
                          </Tooltip>
                        </div>
                      </div>
                      <div className="flex justify-between text-end">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <label className=" text-sm min-w-[64px]">Sửa cuối</label>
                          <Tooltip color="blue">
                            <input disabled type="text" className="h-[24px]  w-[270px]  px-2 rounded-[4px] resize-none border-[1px] border-gray-300 outline-none truncate" />
                          </Tooltip>
                        </div>
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <label className=" text-sm">Lúc</label>
                          <Tooltip color="blue">
                            <input disabled type="text" className="px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none text-center truncate" />
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Spin>
          {/* button */}
          <div className="flex justify-between items-center pt-2 ">
            <div className="flex gap-x-3   ">
              <ActionButton
                color={'slate-50'}
                title={'In phiếu'}
                background={'purple-500'}
                bg_hover={'white'}
                color_hover={'purple-500'}
                handleAction={() => handlePrintInCreate()}
                isModal={true}
              />
            </div>
            <div className="flex gap-2">
              <ActionButton color={'slate-50'} title={'Lưu'} isModal={true} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} handleAction={handleCreate} />
              <ActionButton
                color={'slate-50'}
                title={'Lưu & đóng'}
                isModal={true}
                background={'bg-main'}
                bg_hover={'white'}
                color_hover={'bg-main'}
                handleAction={handleCreateAndClose}
              />
              <ActionButton color={'slate-50'} title={'Đóng'} isModal={true} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
            </div>
          </div>
        </div>
      </div>
      {isShowModalOnlyPrint && (
        <ModalOnlyPrint
          typePage={typePage}
          namePage={namePage}
          close={() => setIsShowModalOnlyPrint(false)}
          dataThongTin={formCreateTT}
          data={data}
          actionType={actionType}
          close2={() => close()}
          SctCreate={SctCreate}
        />
      )}
    </>
  )
}

export default CreateThuChi
