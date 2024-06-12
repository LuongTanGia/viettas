/* eslint-disable react/prop-types */
// import { useEffect, useState } from 'react'

import logo from '../assets/VTS-iSale.ico'
// import icons from '../untils/icons'
import dayjs from 'dayjs'
import ActionButton from '../components/util/Button/ActionButton'
import { DateField } from '@mui/x-date-pickers'
import { useState } from 'react'
import * as XLSX from 'xlsx'
import { toast } from 'react-toastify'
import TableEdit from '../components/util/Table/EditTable'
import { nameColumsImport } from '../components/util/Table/ColumnName'
import { RETOKEN, exportSampleExcel } from '../action/Actions'
import * as apis from '../apis'
import { Input } from 'antd'

// const { MdDelete } = icons
const ModalImport = ({ close, dataHangHoa, typePage, loading, onRowCreate }) => {
  const [excelFile, setExcelFile] = useState(null)
  const [excelData, setExcelData] = useState(null)
  const [fileName, setFileName] = useState('')

  const ngayhieuluc = dayjs().format('YYYY-MM-DD')

  const [formImport, setFormImport] = useState({
    HieuLucTu: ngayhieuluc,
    Datas: [],
  })

  const columnName = ['STT', 'MaHang', 'TenHang', 'DVT', 'DonGia', 'CoThue', 'TyLeThue']

  const sheet1Data = [['MAHANG', 'GIABAN']]

  const sheet2Data = [
    ['Mã', 'Tên hàng', 'ĐVT'],
    ['mã hàng 1', 'tên hàng 1', 'đơn vị tính 1'],
  ]

  // Duyệt qua từng phần tử trong HangHoa để thay thế giá trị tương ứng trong sheet2Data
  for (let i = 0; i < dataHangHoa?.length; i++) {
    sheet2Data[i + 1] = [dataHangHoa[i].MaHang, dataHangHoa[i].TenHang, dataHangHoa[i].DVT]
  }

  const handleFile = (e) => {
    let fileTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv']
    let selectedFile = e.target.files[0]
    console.table(selectedFile)
    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        // setTypeError(null)

        let reader = new FileReader()
        reader.readAsArrayBuffer(selectedFile)
        reader.onload = (e) => {
          setExcelFile(e.target.result)
        }
        setFileName(selectedFile.name)
      } else {
        toast.error('Vui lòng chỉ chọn loại file excel')
        setExcelFile([])
        setFileName('')
      }
    } else {
      toast.error('Vui lòng chọn file')
      setExcelFile([])
      setFileName('')
    }
  }

  const handleFileSubmit = (e) => {
    if (fileName === '') {
      toast.warning('Vui lòng chọn file!')
      return
    }
    e.preventDefault()
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: 'buffer' })
      const sheet1Name = workbook.SheetNames[0]
      const sheet1 = workbook.Sheets[sheet1Name]
      const dataSheet1 = XLSX.utils.sheet_to_json(sheet1)

      // Tạo một đối tượng để lưu trữ thông tin từ sheet 2 dựa trên Mahang
      const mahangInfo = {}
      dataHangHoa.forEach((item) => {
        const mahang = item['MaHang']
        const tenhang = item['TenHang']
        const dvt = item['DVT']
        mahangInfo[mahang] = { tenhang, dvt }
      })

      // Xử lý dữ liệu từ sheet 1 và kết hợp với thông tin từ dataHangHoa
      const processedData = dataSheet1.map((item, index) => ({
        STT: index + 1,
        MaHang: item['MAHANG'] ? item['MAHANG'].toString().trim() : null,
        DonGia: item[' GIABAN '] ? parseFloat(item[' GIABAN '].toString().trim()) : item['GIABAN'] ? parseFloat(item['GIABAN'].toString().trim()) : null,
        TenHang: mahangInfo[item['MAHANG']] ? mahangInfo[item['MAHANG']].tenhang : '',
        DVT: mahangInfo[item['MAHANG']] ? mahangInfo[item['MAHANG']].dvt : '',
        TyLeThue: 0,
        CoThue: false,
      }))

      // Loại bỏ các MaHang không hợp lệ từ processedData
      const mahangSet = new Set()
      const validProcessedData = processedData.filter((item) => {
        if (!mahangSet.has(item.MaHang) && mahangInfo[item.MaHang] && !isNaN(item.DonGia) && item.DonGia > 0) {
          mahangSet.add(item.MaHang)
          return true
        }
        return false
      })
      // Kiểm tra nếu không có dữ liệu MAHANG hoặc GIABAN
      if (validProcessedData.length <= 0) {
        toast.error('Không có dữ liệu mã hàng hoặc giá bán trong file')
        setExcelData([])
        setFileName('')
      } else {
        setExcelData(validProcessedData)
      }
    }
  }

  const handleEditData = (data) => {
    setExcelData(data)
  }

  const controlImport = () => {
    if (fileName === '') {
      toast.warning('Vui lòng chọn file!')
      return
    }
    if (!excelData.length) {
      toast.warning('Bảng chi tiết không được để trống')
      return
    }

    if (typePage === 'GBS') {
      handleImportClipboard()
    } else {
      handleImport()
    }
  }

  const handleImport = async () => {
    if (formImport?.HieuLucTu === 'Invalid Date') {
      return
    }
    try {
      const tokenLogin = localStorage.getItem('TKN')
      let response
      switch (typePage) {
        case 'GBL':
          response = await apis.ImportGBL(tokenLogin, { ...formImport, Datas: excelData })
          break

        default:
          break
      }
      if (response) {
        const { DataError, DataErrorDescription } = response.data
        if (DataError === 0) {
          toast.success(DataErrorDescription)
          // setHightLight(`${formImport?.Datas?.MaHang}/${formImport?.Datas?.HieuLucTu}T00:00:00`)
          loading()
          close()
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{DataErrorDescription}</div>)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          handleImport()
        } else {
          toast.error(DataErrorDescription)
        }
      }
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handleImportClipboard = () => {
    const dataTable = excelData?.map((item) => ({
      key: item.MaHang,
      ...item,
    }))
    onRowCreate(dataTable)
    close()
  }

  const handleCustomFileUpload = () => {
    document.getElementById('fileInput').click()
  }

  return (
    <div className=" fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
      <div className="p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
        <div className="md:w-[90vw] lg:w-[70vw] h-[600px] ">
          <div className="flex gap-2">
            <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
            <label className="text-blue-700 font-semibold uppercase pb-1">Nhập dữ liệu bảng giá thay đổi từ tập tin Excel</label>
          </div>

          {/* <Spin spinning={isLoadingModal}> */}
          <div className="border-1 border-gray-400 w-full h-[89%] rounded-sm text-sm">
            <div className="flex md:gap-0 lg:gap-1 pl-1 ">
              {/* thong tin phieu */}
              <div className="w-full">
                <div className="flex flex-col pt-3  ">
                  <div className="flex items-center p-1 gap-2">
                    <label className=" w-[120px] text-sm flex justify-end">Tập tin</label>
                    <Input value={fileName} readOnly />
                    <input id="fileInput" type="file" className="hidden" accept=".xlsx,.xls" onChange={handleFile} value="" />
                    <button
                      onClick={handleCustomFileUpload}
                      className="w-[130px] flex justify-center py-1 px-2 rounded-md text-slate-50 text-base border-2 border-bg-main bg-bg-main hover:bg-white hover:text-bg-main"
                    >
                      Chọn File
                    </button>
                    <button
                      onClick={(e) => handleFileSubmit(e)}
                      className="flex items-center py-1 px-2 rounded-md text-slate-50 text-base border-2 border-bg-main bg-bg-main hover:bg-white hover:text-bg-main"
                    >
                      Upload
                    </button>
                  </div>

                  <div className="flex justify-between items-center p-1 gap-2">
                    <div>
                      <label className="required w-[120px] text-end pr-2">Áp dụng từ ngày</label>
                      <DateField
                        className=" max-w-[132px] min-w-[132px]
"
                        format="DD/MM/YYYY"
                        value={dayjs(formImport?.HieuLucTu)}
                        onChange={(newDate) => {
                          setFormImport({
                            ...formImport,
                            HieuLucTu: dayjs(newDate).format('YYYY-MM-DD'),
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
                    <div className="italic font-bold text-red-400">( Những hàng hóa không hợp lệ trong file Excel sẽ bị loại bỏ )</div>
                  </div>
                </div>
              </div>
            </div>
            {/* table */}
            <div className=" pb-0  relative mt-1">
              <TableEdit
                param={excelData}
                handleEditData={handleEditData}
                ColumnTable={columnName}
                typeTable={'edit'}
                tableName="Import"
                columName={nameColumsImport}
                yourMaHangOptions={dataHangHoa}
                yourTenHangOptions={dataHangHoa}
              />
            </div>
          </div>
          {/* </Spin> */}
          {/* button  */}
          <div className=" flex justify-between items-center">
            <div className="flex items-center gap-3 pt-3">
              <ActionButton
                color={'slate-50'}
                title={'Xuất file mẫu'}
                background={'bg-main'}
                bg_hover={'white'}
                color_hover={'bg-main'}
                isModal={true}
                handleAction={() => exportSampleExcel(sheet1Data, sheet2Data)}
              />
            </div>
            <div className="flex  items-center gap-3  pt-3">
              <ActionButton color={'slate-50'} title={'Import'} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} isModal={true} handleAction={controlImport} />
              <ActionButton color={'slate-50'} title={'Đóng'} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} isModal={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalImport
