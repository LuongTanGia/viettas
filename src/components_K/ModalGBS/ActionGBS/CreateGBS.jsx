/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react'
import { FloatButton, Spin, Tooltip } from 'antd'
import logo from '../../../assets/VTS-iSale.ico'
import * as apis from '../../../apis'
import icons from '../../../untils/icons'
import { RETOKEN } from '../../../action/Actions'
import TableEdit from '../../../components/util/Table/EditTable'
import ActionButton from '../../../components/util/Button/ActionButton'
import { nameColumsGBS } from '../../../components/util/Table/ColumnName'
import { toast } from 'react-toastify'
import ModalImport from '../../ModalImport'
import ModalSelectHH from '../../ModalSelectHH'
import ModalHHGBS from '../../ModalHHGBS'

const { IoMdAddCircle } = icons

const CreateGBS = ({ actionType, typePage, namePage, dataThongTin, dataHangHoa, dataThongSo, setHightLight, isLoadingModal, loading, close }) => {
  const [isShowModalHH, setIsShowModalHH] = useState(false)
  const [isShowSelectHH, setIsShowSelectHH] = useState(false)
  const [isShowImport, setIsShowImport] = useState(false)
  const [selectedRowData, setSelectedRowData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errors, setErrors] = useState({
    NhomGia: '',
    TenNhomGia: '',
  })

  const defaultFormCreate = {
    NhomGia: '',
    TenNhomGia: '',
    GhiChu: '',
    NhomGia_CTs: [],
  }
  const [formCreate, setFormCreate] = useState(defaultFormCreate)

  const isAdd = useMemo(() => selectedRowData.map((item) => item.MaHang).includes('Chọn mã hàng'), [selectedRowData])

  const datafilterHH = useMemo(
    () => (selectedRowData && dataHangHoa ? dataHangHoa.filter((item) => !selectedRowData.some((row) => row.MaHang === item.MaHang)) : dataHangHoa),
    [dataHangHoa, selectedRowData],
  )

  //  show modal HH = F9
  const handleKeyDown = (event) => {
    if (event.key === 'F9') {
      setIsShowModalHH(true)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // set default value
  useEffect(() => {
    if (dataThongTin?.NhomGia_CTs && actionType === 'clone') {
      setSelectedRowData(
        [...dataThongTin.NhomGia_CTs].map((item, index) => ({
          ...item,
          STT: index + 1,
          key: index + 1 + selectedRowData.length + dataHangHoa.length,
        })),
      )
    }
  }, [dataThongTin?.NhomGia_CTs])

  const columnName = ['STT', 'MaHang', 'TenHang', 'DVT', 'DonGia', 'CoThue', 'TyLeThue']

  // cập nhật danh sách các hàng hóa đã chọn từ list_helper_HangHoa
  const handleAddRow = (newRow) => {
    let dataNewRow
    setSelectedRowData((prevData) => {
      if (prevData.some((item) => item.MaHang === newRow.MaHang))
        dataNewRow = prevData.map((item) => {
          // if (item.MaHang === newRow.MaHang) {
          //   console.log('đã tồn tại')
          // }
          return item
        })
      else {
        dataNewRow = [...prevData, newRow]
      }
      return dataNewRow
    })
  }

  // cập nhật danh sách các hàng hóa đã chọn từ action thêm hàng hóa chưa có
  const handleAddSelectedRow = (newRow) => {
    setSelectedRowData([...selectedRowData, ...newRow])
  }

  // cập nhật danh sách các hàng hóa từ action Import
  const handleAddImportRow = (newRow) => {
    const newRowFiltered = newRow.filter((item) => !selectedRowData.some((row) => row.MaHang === item.MaHang))
    setSelectedRowData([...selectedRowData, ...newRowFiltered])
  }

  // tạo 1 hàng rỗng
  const handleAddEmptyRow = () => {
    if (selectedRowData.map((item) => item.MaHang).includes('Chọn mã hàng')) return

    let emptyRow = {
      MaHang: 'Chọn mã hàng',
      TenHang: 'Chọn tên hàng',
      DonGia: 0,
      CoThue: false,
      TyLeThue: 0,
      key: selectedRowData.length + 1 + dataHangHoa.length,
    }

    setSelectedRowData((prevData) => [...prevData, emptyRow])
  }

  const handleCreate = async () => {
    if (!formCreate?.NhomGia?.trim() || !formCreate?.TenNhomGia?.trim()) {
      setErrors({
        NhomGia: formCreate?.NhomGia?.trim() ? '' : 'Mã bảng giá không được để trống',
        TenNhomGia: formCreate?.TenNhomGia?.trim() ? '' : 'Tên bảng giá không được để trống',
      })
      return
    }

    try {
      const tokenLogin = localStorage.getItem('TKN')

      const response = await apis.ThemGBS(tokenLogin, { ...formCreate, NhomGia_CTs: selectedRowData })
      if (response) {
        const { DataError, DataErrorDescription } = response.data
        if (DataError === 0) {
          toast.success(DataErrorDescription)
          setHightLight(formCreate.NhomGia)
          loading()
          setFormCreate(defaultFormCreate)
          setSelectedRowData([])
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

  const handleCreateAndClose = async () => {
    if (!formCreate?.NhomGia?.trim() || !formCreate?.TenNhomGia?.trim()) {
      setErrors({
        NhomGia: formCreate?.NhomGia?.trim() ? '' : 'Mã bảng giá không được để trống',
        TenNhomGia: formCreate?.TenNhomGia?.trim() ? '' : 'Tên bảng giá không được để trống',
      })
      return
    }

    try {
      const tokenLogin = localStorage.getItem('TKN')

      const response = await apis.ThemGBS(tokenLogin, { ...formCreate, NhomGia_CTs: selectedRowData })
      if (response) {
        const { DataError, DataErrorDescription } = response.data
        if (DataError === 0) {
          toast.success(DataErrorDescription)
          setHightLight(formCreate.NhomGia)
          loading()
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

  const handleSelectHH = () => {
    setIsShowSelectHH(true)
  }

  const handleImport = () => {
    setIsShowImport(true)
  }

  const handleChangLoading = (newLoading) => {
    setIsLoading(newLoading)
  }

  const handleEditData = (data) => {
    setSelectedRowData(data)
  }

  return (
    <>
      <div className="p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
        <div className=" w-[90vw] h-[610px] ">
          <div className="flex gap-2">
            <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
            <label className="text-blue-700 font-semibold uppercase pb-1">Thêm - {namePage ? namePage : 'Phiếu ?'}</label>
          </div>

          <Spin spinning={isLoadingModal}>
            <div className="border w-full h-[89%] rounded-sm text-sm">
              <div className="flex md:gap-0 lg:gap-1 pl-1 ">
                {/* thong tin phieu */}
                <div className="w-[62%]">
                  <div className="flex flex-col pt-3  ">
                    <div className="flex items-center p-1 gap-2">
                      <label className="required w-[120px] text-end">Mã bảng giá</label>
                      <input
                        placeholder={errors?.NhomGia}
                        type="text"
                        className={`w-full border-[1px] border-gray-300 outline-none px-2 rounded-[4px] hover:border-hover-border-color h-[24px]
                             ${errors.NhomGia ? 'border-red-500' : ''}`}
                        value={formCreate.NhomGia}
                        onChange={(e) => {
                          setFormCreate({
                            ...formCreate,
                            NhomGia: e.target.value,
                          }),
                            setErrors({ ...errors, NhomGia: '' })
                        }}
                      />
                    </div>
                    <div className="flex items-center p-1 gap-2">
                      <label className="required w-[120px] text-end">Tên bảng giá</label>
                      <input
                        placeholder={errors?.TenNhomGia}
                        type="text"
                        className={`w-full border-[1px] border-gray-300 outline-none px-2 rounded-[4px] hover:border-hover-border-color h-[24px]
                             ${errors.TenNhomGia ? 'border-red-500' : ''}`}
                        value={formCreate.TenNhomGia}
                        onChange={(e) => {
                          setFormCreate({
                            ...formCreate,
                            TenNhomGia: e.target.value,
                          }),
                            setErrors({ ...errors, TenNhomGia: '' })
                        }}
                      />
                    </div>
                    <div className="flex items-center p-1 gap-2">
                      <label className=" w-[120px] text-end">Ghi chú</label>
                      <input
                        type="text"
                        className="w-full border-[1px] border-gray-300 outline-none px-2 rounded-[4px] hover:border-hover-border-color h-[24px]"
                        value={formCreate.GhiChu}
                        onChange={(e) =>
                          setFormCreate({
                            ...formCreate,
                            GhiChu: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                {/* thong tin cap nhat */}
                <div className="w-[38%] py-1 box_content">
                  <div className="text-center p-1 font-medium text_capnhat">Thông tin cập nhật</div>
                  <div className=" rounded-md w-[98%]  box_capnhat px-1 py-3">
                    <div className="flex justify-between items-center ">
                      <div className="flex items-center p-1  ">
                        <label className="md:w-[134px] lg:w-[104px]">Người tạo</label>
                        <input disabled type="text" className=" w-full border border-gray-300 outline-none px-2 rounded-[4px] h-[24px]" />
                      </div>

                      <div className="flex items-center p-1 ">
                        <label className="w-[30px] pr-1">Lúc</label>
                        <input disabled type="text" className="w-full  border border-gray-300 outline-none px-2 rounded-[4px] h-[24px]" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center ">
                      <div className="flex items-center p-1  ">
                        <label className="md:w-[134px] lg:w-[104px]">Sửa cuối</label>
                        <input disabled type="text" className="w-full border border-gray-300 outline-none px-2 rounded-[4px] h-[24px]" />
                      </div>
                      <div className="flex items-center p-1 ">
                        <label className="w-[30px] pr-1">Lúc</label>
                        <input disabled type="text" className="w-full border border-gray-300 outline-none px-2 rounded-[4px] h-[24px]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* table */}
              <div className=" pb-0  relative mt-1">
                <Tooltip
                  placement="topLeft"
                  title={isAdd ? 'Vui lòng chọn hàng hóa hoặc F9 để chọn từ danh sách' : 'Bấm vào đây để thêm hàng mới hoặc F9 để chọn từ danh sách!'}
                  color="blue"
                >
                  <FloatButton
                    className="absolute z-3 bg-transparent w-[26px] h-[26px]"
                    style={{
                      right: 12,
                      top: 8,
                    }}
                    type={`${isAdd ? 'default' : 'primary'}`}
                    icon={<IoMdAddCircle />}
                    onClick={handleAddEmptyRow}
                  />
                </Tooltip>
                <TableEdit
                  typeTable="create"
                  typeAction="create"
                  tableName="GBS"
                  className="table_create_GBS"
                  param={selectedRowData}
                  handleEditData={handleEditData}
                  ColumnTable={columnName}
                  columName={nameColumsGBS}
                  yourMaHangOptions={dataHangHoa}
                  yourTenHangOptions={dataHangHoa}
                />
              </div>
            </div>
          </Spin>
          {/* button  */}
          <div className=" flex justify-between items-center">
            <div className=" flex  items-center gap-3  pt-3">
              <ActionButton
                color={'slate-50'}
                title={'Thêm MH chưa có'}
                background={'bg-main'}
                bg_hover={'white'}
                color_hover={'bg-main'}
                isModal={true}
                handleAction={handleSelectHH}
              />

              <ActionButton color={'slate-50'} title={'Import'} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} isModal={true} handleAction={handleImport} />
            </div>
            <div className="flex  items-center gap-3  pt-3">
              {actionType === 'create' ? (
                <ActionButton color={'slate-50'} title={'Lưu'} isModal={true} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} handleAction={handleCreate} />
              ) : null}
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

      {isShowModalHH && (
        <ModalHHGBS
          close={() => setIsShowModalHH(false)}
          data={dataHangHoa}
          onRowCreate={handleAddRow}
          dataThongSo={dataThongSo}
          onChangLoading={handleChangLoading}
          loading={isLoading}
        />
      )}

      {isShowSelectHH && (
        <ModalSelectHH
          close={() => setIsShowSelectHH(false)}
          data={datafilterHH}
          onRowCreate={handleAddSelectedRow}
          dataThongSo={dataThongSo}
          onChangLoading={handleChangLoading}
          loading={isLoading}
        />
      )}

      {isShowImport && (
        <ModalImport typePage={typePage} close={() => setIsShowImport(false)} dataHangHoa={dataHangHoa} namePage={namePage} loading={isLoading} onRowCreate={handleAddImportRow} />
      )}
    </>
  )
}

export default CreateGBS
