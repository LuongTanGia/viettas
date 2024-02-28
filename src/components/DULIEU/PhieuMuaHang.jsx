import { useState, useEffect } from 'react'
import { Form, DatePicker, Space, Table } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import moment from 'moment'
const { RangePicker } = DatePicker
import icons from '../../assets/icon/Icon'
import { useSelector } from 'react-redux'
import { dataDuLieuSelector } from '../../redux/selector'
import Modal from './actionPage/actionPage'

const { IoAddCircleOutline, TiPrinter, FaRegEye, MdDelete, FaRegEdit } = icons
const PhieuMuaHang = () => {
  const dataDuLieu = useSelector(dataDuLieuSelector)
  console.log(dataDuLieu)

  const [isShow, setIsShow] = useState(false)
  const [recordData, setRecordData] = useState(null)

  const [form] = Form.useForm()
  const [isValidDate, setIsValidDate] = useState()
  const [isLoadingPopup, setIsLoadingPopup] = useState(false)
  const [isShowModal, setIsShowModal] = useState(false)
  const handleKeyDown = (e) => {
    const validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '/', 'Backspace']
    if (!validKeys.includes(e.key)) {
      e.preventDefault()
    }
  }

  const validateDate = (_, value) => {
    const isValid = moment(value, 'DD/MM/YYYY', true).isValid()
    setIsValidDate(isValid)

    return isValid ? Promise.resolve() : Promise.reject('Ngày tháng không hợp lệ')
  }

  const handleCalendarChange = (_, dateString) => {
    form.setFieldsValue({ dateRange: dateString })
    const isValid = moment(dateString[0], 'DD/MM/YYYY', true).isValid() && moment(dateString[1], 'DD/MM/YYYY', true).isValid()

    setIsValidDate(isValid)
  }
  const data = [...dataDuLieu.DataResults]
  const columns = [
    {
      title: 'STT',
      dataIndex: 'STT',
      key: 'STT',
      width: 60,
      hight: 10,
      fixed: 'left',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Số Chứng Từ',
      dataIndex: 'SoChungTu',
      key: 'SoChungTu',
      width: 150,
      fixed: 'left',
      sorter: true,
    },
    {
      title: 'Ngày Chứng Từ',
      dataIndex: 'NgayCTu',
      key: 'NgayCTu',
      render: (text) => moment(text).format('DD/MM/YYYY'),
      width: 150,
    },
    {
      title: 'Mã Đối Tượng',
      dataIndex: 'MaDoiTuong',
      key: 'MaDoiTuong',
      width: 150,
    },
    {
      title: 'Tên đối tượng',
      dataIndex: 'TenDoiTuong',
      key: 'TenDoiTuong',
      width: 300,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'DiaChi',
      key: 'DiaChi',
      width: 300,
    },
    {
      title: 'Mã số thuế',
      dataIndex: 'MaSoThue',
      key: 'MaSoThue',
      width: 150,
    },
    {
      title: 'Mã kho',
      dataIndex: 'MaKho',
      key: 'MaKho',
      width: 150,
    },
    {
      title: 'Thông tin kho',
      dataIndex: 'ThongTinKho',
      key: 'ThongTinKho',
      width: 150,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'GhiChu',
      key: 'GhiChu',
      width: 150,
    },
    {
      title: 'Tổng mặt hàng',
      dataIndex: 'TongMatHang',
      key: 'TongMatHang',
      width: 150,
    },
    {
      title: 'Tổng số lượng',
      dataIndex: 'TongSoLuong',
      key: 'TongSoLuong',
      width: 150,
    },
    {
      title: 'Tổng tiền hàng',
      dataIndex: 'TongTienHang',
      key: 'TongTienHang',
      width: 150,
    },
    {
      title: 'Tổng tiền thuế',
      dataIndex: 'TongTienThue',
      key: 'TongTienThue',
      width: 150,
    },
    {
      title: 'Tổng thành tiền',
      dataIndex: 'TongThanhTien',
      key: 'TongThanhTien',
      width: 150,
    },

    {
      title: 'Thanh toán tiền mặt',
      dataIndex: 'TTTienMat',
      key: 'TTTienMat',
      width: 150,
    },
    {
      title: 'Phiếu chi',
      dataIndex: 'PhieuChi',
      key: 'PhieuChi',
      width: 150,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'NgayTao',
      key: 'NgayTao',
      render: (text) => moment(text).format('DD/MM/YYYY'),
      width: 150,
    },
    {
      title: 'Người tạo',
      dataIndex: 'NguoiTao',
      key: 'NguoiTao',
      width: 300,
    },
    {
      title: 'Ngày sửa cuối',
      dataIndex: 'NgaySuaCuoi',
      key: 'NgaySuaCuoi',
      render: (text) => moment(text).format('DD/MM/YYYY'),
      width: 150,
    },
    {
      title: 'Người sửa cuối',
      dataIndex: 'NguoiSuaCuoi',
      key: 'NguoiSuaCuoi',
      width: 300,
    },
    {
      title: 'Chức năng',
      key: 'operation',
      fixed: 'right',
      width: 120,
      align: 'center',
      render: (record) => {
        return (
          <>
            <div className=" flex gap-1 items-center justify-center ">
              <div
                onClick={() => handelView(record)}
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#verticalycentered"
                title="Xem"
                className="p-[3px] border border-yellow-400 rounded-md text-yellow-400 hover:text-white hover:bg-yellow-400 cursor-pointer"
              >
                <FaRegEye size={16} />
              </div>
              <div
                onClick={() => handleEdit(record)}
                title="Sửa"
                data-bs-toggle="modal"
                data-bs-target="#verticalycentered"
                className="p-[3px] text-purple-500 border  border-purple-500 rounded-md hover:text-white hover:bg-purple-500  "
              >
                <FaRegEdit size={16} />
              </div>
              <div
                onClick={() => handleDelete()}
                title="Xóa"
                data-bs-toggle="modal"
                data-bs-target="#verticalycentered"
                className="p-[3px] text-red-500 border  border-red-500 rounded-md hover:text-white hover:bg-red-500  "
              >
                <MdDelete size={16} />
              </div>
              <div
                //   onClick={() => handlePrint(record)}
                title="In phiếu"
                className="p-[3px] text-blue-500 border  border-blue-500 rounded-md hover:text-white hover:bg-blue-500  "
              >
                <TiPrinter size={16} />
              </div>
              {/* <div
                      onClick={() => setIsOption(!isOption)}
                      title="option"
                      className="p-[3px] border-2  rounded-md  hover:text-white hover:bg-gray-500  cursor-pointer"
                    >
                      <SlOptions size={16} />
                    </div> */}
            </div>
            {/* {isOption && <Options />} */}
          </>
        )
      },
    },
  ]
  const handelView = (record) => {
    setRecordData(record)
    setIsShow(true)
    setIsShowModal(true)
  }
  const handleEdit = (record) => {
    setRecordData(record)
    setIsShow(false)
    setIsShowModal(true)
  }
  const handleDelete = () => {
    setRecordData(null)
  }

  useEffect(() => {
    setIsShow(true)
  }, [recordData])
  return (
    <div className="w-full ">
      <div className="text-lg font-bold mx-4 my-2 "> Phiếu mua hàng</div>
      <div className="flex justify-between items-center px-4">
        {/* date rang */}
        <div className="">
          <Form form={form}>
            <Form.Item
              name="dateRange"
              label="Ngày Tháng"
              rules={[
                {
                  validator: validateDate,
                },
              ]}
            >
              <Space>
                <RangePicker format="DD/MM/YYYY" picker="date" onKeyDown={handleKeyDown} onCalendarChange={handleCalendarChange} />
                {isValidDate ? <CheckCircleOutlined style={{ color: 'green' }} /> : <CloseCircleOutlined style={{ color: 'red' }} />}
              </Space>
            </Form.Item>
          </Form>
        </div>
        <div className="">
          <button className="flex items-center  py-1 px-2 bg-bg-main rounded-md text-white text-sm hover:opacity-80">
            <div className="pr-1">
              <IoAddCircleOutline size={20} />
            </div>
            <div>Thêm phiếu mua hàng</div>
          </button>
        </div>
      </div>
      <div className="custom-table p-2  w-full">
        <Table
          columns={columns}
          dataSource={data}
          scroll={{
            x: 1200,
            y: 350,
          }}
          size="small"
        ></Table>
      </div>
      {recordData != null ? (
        <Modal
          close={() => {
            setIsShowModal(false), setIsLoadingPopup(!isLoadingPopup)
            setRecordData(null)
          }}
          actionType={isShow}
          record={recordData}
          isShowModal={isShowModal}
          title={''}
          isLoadingModel={isLoadingPopup}
        />
      ) : (
        <Modal
          close={() => {
            setIsShowModal(false), setIsLoadingPopup(!isLoadingPopup)
          }}
          actionType={isShow}
          record={recordData}
          isLoadingModel={isLoadingPopup}
          title={'thêm'}
        />
      )}
    </div>
  )
}

export default PhieuMuaHang
