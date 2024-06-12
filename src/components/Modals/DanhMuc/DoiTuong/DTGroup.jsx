/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Select, Space } from 'antd'
import logo from '../../../../assets/VTS-iSale.ico'
import { toast } from 'react-toastify'
import ActionButton from '../../../util/Button/ActionButton'
import { useEffect, useState } from 'react'
import categoryAPI from '../../../../API/linkAPI'
import SimpleBackdrop from '../../../util/Loading/LoadingPage'
import { RETOKEN } from '../../../../action/Actions'

const DTGroup = ({ close, type, dataDT, loadingData, setTargetRow }) => {
  const TokenAccess = localStorage.getItem('TKN')
  const [selectedValue, setSelectedValue] = useState(null)
  const [nhomHang, setNhomHang] = useState('')
  const [nhomGia, setNhomGia] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [errors, setErrors] = useState({
    GiaTriMoi: '',
  })

  useEffect(() => {
    setTargetRow([])
  }, [])

  useEffect(() => {
    const getListHelper = async () => {
      try {
        const dataNH = await categoryAPI.ListNhomDoiTuong(TokenAccess)
        if (dataNH.data.DataError == 0) {
          setNhomHang(dataNH.data.DataResults)
        }
        const dataDVT = await categoryAPI.ListNhomGia(TokenAccess)
        if (dataDVT.data.DataError == 0) {
          setNhomGia(dataDVT.data.DataResults)
        }
        setIsLoading(true)
      } catch (error) {
        console.log(error)
      }
    }
    if (!isLoading) {
      getListHelper()
    }
  }, [isLoading])

  const handlePrice = async () => {
    if (!selectedValue) {
      setErrors({
        GiaTriMoi: selectedValue ? '' : 'Nhóm không được trống',
      })
      return
    }
    try {
      const response = await categoryAPI.GanNhomGia(
        {
          DanhSachMa: dataDT?.map((item) => ({ Ma: item })),
          GiaTriMoi: selectedValue,
        },
        TokenAccess,
      )
      if (response.data.DataError === 0) {
        toast.success(response.data.DataErrorDescription, { autoClose: 1000 })
        console.log(response.data)
        loadingData()
        close()
        setTargetRow(dataDT)
      } else {
        toast.warning(response.data.DataErrorDescription, { autoClose: 2000 })
      }
    } catch (error) {
      console.error(error)
      toast.error('Lỗi Server vui lòng thử lại', { autoClose: 1000 })
      close()
    }
  }

  const handleGroup = async () => {
    console.log(selectedValue)
    if (!selectedValue) {
      setErrors({
        GiaTriMoi: selectedValue ? '' : 'Nhóm không được trống',
      })
      return
    }
    try {
      const response = await categoryAPI.GanNhomDoiTuong(
        {
          DanhSachMa: dataDT?.map((item) => ({ Ma: item })),
          GiaTriMoi: selectedValue,
        },
        TokenAccess,
      )
      if (response.data.DataError === 0) {
        toast.success(response.data.DataErrorDescription, { autoClose: 1000 })
        loadingData()
        close()
        setTargetRow(dataDT)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        handleGroup()
      } else {
        toast.warning(response.data.DataErrorDescription, { autoClose: 2000 })
      }
    } catch (error) {
      console.error('API call failed:', error)
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
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col min-w-[40rem] min-h-[8rem] bg-white  p-2 rounded shadow-custom overflow-hidden">
              <div className="flex flex-col gap-2 p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                    <p className="text-blue-700 font-semibold uppercase">{type == 'price' ? 'Đổi nhóm giá - Đối Tượng' : 'Đổi nhóm đối tượng - Đối Tượng'}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-center border-1 border-gray-400 p-4 gap-2">
                    <div className="required whitespace-nowrap">Nhóm</div>
                    <Space wrap>
                      <Select
                        placeholder={errors?.GiaTriMoi ? errors?.GiaTriMoi : 'Chọn nhóm'}
                        required
                        style={{
                          width: 500,
                        }}
                        value={selectedValue || undefined}
                        status={errors.GiaTriMoi ? 'error' : ''}
                        onChange={(value) => {
                          setSelectedValue(value)
                          setErrors({ ...errors, GiaTriMoi: '' })
                        }}
                      >
                        {type === 'price'
                          ? nhomGia.map((item) => (
                              <Select.Option key={item.Ma} value={item.Ma}>
                                {item.ThongTinNhomGia}
                              </Select.Option>
                            ))
                          : nhomHang.map((item) => (
                              <Select.Option key={item.Ma} value={item.Ma}>
                                {item.ThongTinNhomDoiTuong}
                              </Select.Option>
                            ))}
                      </Select>
                    </Space>
                  </div>
                  <div className="flex justify-end gap-2">
                    <ActionButton
                      handleAction={type == 'price' ? handlePrice : handleGroup}
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
          </div>
        </>
      )}
    </>
  )
}

export default DTGroup
