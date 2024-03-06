/* eslint-disable react/prop-types */
// import { useEffect, useState } from 'react'

import logo from '../assets/VTS-iSale.ico'
import icons from '../untils/icons'

// import { DateField } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import ActionButton from '../components/util/Button/ActionButton'
import { DateField } from '@mui/x-date-pickers'
import { useRef, useState } from 'react'

const { MdOutlineFileUpload } = icons
const ModalImport = ({ close }) => {
  const [fileName, setFileName] = useState('')

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFileName(file.name)
    }
  }

  const handleButtonClick = () => {
    document.getElementById('fileInput').click()
  }

  return (
    <div className=" fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
      <div className="p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
        <div className=" w-[90vw] h-[600px] ">
          <div className="flex gap-2">
            <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
            <label className="text-blue-700 font-semibold uppercase pb-1">Nhập dữ liệu bảng giá thay đổi từ tập tin Excel</label>
          </div>

          {/* <Spin spinning={isLoadingModal}> */}
          <div className="border w-full h-[89%] rounded-sm text-sm">
            <div className="flex md:gap-0 lg:gap-1 pl-1 ">
              {/* thong tin phieu */}
              <div className="w-full">
                <div className="flex flex-col pt-3  ">
                  <div className="flex items-center p-1 gap-2">
                    <label className=" whitespace-nowrap  min-w-[90px] text-sm flex justify-end">Tập tin</label>
                    <input readOnly type="text" value={fileName} className="h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none  " />
                    <input type="file" style={{ display: 'none' }} id="fileInput" accept=".xlsx" onChange={handleFileChange} />
                    <ActionButton
                      color={'slate-50'}
                      icon={<MdOutlineFileUpload size={24} />}
                      background={'bg-main'}
                      bg_hover={'white'}
                      color_hover={'bg-main'}
                      handleAction={handleButtonClick}
                    />
                    <ActionButton color={'slate-50'} title={'Nạp dữ liệu'} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} />
                  </div>

                  <div className="flex items-center p-1 gap-2">
                    <label className="required w-[120px] text-end">Áp dụng từ ngày</label>
                    <DateField
                      className="DatePicker_PMH max-w-[110px]"
                      format="DD/MM/YYYY"
                      value={dayjs()}
                      // onChange={(newDate) => {
                      //   setFormPrint({
                      //     ...formPrint,
                      //     NgayBatDau: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
                      //   })
                      // }}
                      sx={{
                        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { border: '1px solid #007FFF' },
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
                </div>
              </div>
            </div>
            {/* table */}
            <div className=" pb-0  relative mt-1">
              {/* <TableEdit
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
          /> */}
            </div>
          </div>
          {/* </Spin> */}
          {/* button  */}
          <div className=" flex justify-between items-center">
            <div className=" flex  items-center gap-3  pt-3">
              <ActionButton color={'slate-50'} title={'Xuất file mẫu'} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} />
            </div>
            <div className="flex  items-center gap-3  pt-3">
              <ActionButton color={'slate-50'} title={'Kiểm tra'} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} />
              <ActionButton color={'slate-50'} title={'Điều chỉnh'} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} />
              <ActionButton color={'slate-50'} title={'Import'} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} />
              <ActionButton color={'slate-50'} title={'Đóng'} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalImport
