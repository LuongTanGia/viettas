/* eslint-disable react-hooks/exhaustive-deps */
import QueryTable from '../util/Table/QueryTable'
import { useEffect, useState, useRef } from 'react'
import { CNDRTONGHOP, CNDRTONGHOP_listHelper, exportToExcel } from '../../action/Actions'
import API from '../../API/API'
import FilterCp from '../util/filterCP/FilterCp'
import Date from '../util/DateCP/DateCP'
import ActionButton from '../util/Button/ActionButton'
import { TfiMoreAlt } from 'react-icons/tfi'
import { RiFileExcel2Fill } from 'react-icons/ri'
import { FaEyeSlash } from 'react-icons/fa'
import { Button, Checkbox, Col, Empty, Row } from 'antd'
import { nameColumsCongNoDauVao } from '../util/Table/ColumnName'
function CongNoDauVao() {
  const token = localStorage.getItem('TKN')
  const [dataAPI, setDataAPI] = useState({
    NgayBatDau: '2023-12-15',
    NgayKetThuc: '2024-02-15',
    CodeValue1From: '',
    CodeValue1To: '',
    CodeValue1List: '',
  })
  const [data, setData] = useState([])
  const [dataDoiTuong, setDataDoiTuong] = useState([])
  const [dataNhomDoiTuong, setDataNhomDoiTuong] = useState([])
  const [isShowOption, setIsShowOption] = useState(false)
  const showOption = useRef(null)
  const [hiddenRow, setHiddenRow] = useState([])
  const [checkedList, setCheckedList] = useState([])
  const [selectVisible, setSelectVisible] = useState(false)
  const [tableLoad, setTableLoad] = useState(true)
  const [options, setOptions] = useState()

  useEffect(() => {
    const getDate = async () => {
      const listTongHop = await CNDRTONGHOP(API.CNDVTONGHOP, token, dataAPI)
      const listDoiTuong = await CNDRTONGHOP_listHelper(API.CNDVDoiTuong, token)
      const listNhomDoiTuong = await CNDRTONGHOP_listHelper(API.CNDRNhomDoiTuong, token)
      setData(listTongHop.DataResults || [])
      setDataDoiTuong(listDoiTuong.DataResults)
      setDataNhomDoiTuong(listNhomDoiTuong.DataResults)
    }
    getDate()
  }, [dataAPI.NgayBatDau, dataAPI.NgayKetThuc, dataAPI.CodeValue1From, dataAPI.CodeValue1To, dataAPI.CodeValue1List])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showOption.current && !showOption.current.contains(event.target)) {
        setIsShowOption(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    setHiddenRow(JSON.parse(localStorage.getItem('hiddenColumns')))
    setCheckedList(JSON.parse(localStorage.getItem('hiddenColumns')))
    const key = Object.keys(data[0] || []).filter((key) => key)
    setOptions(key)
    console.log(key)
  }, [selectVisible])

  const onChange = (checkedValues) => {
    setCheckedList(checkedValues)
  }
  const handleHidden = () => {
    setSelectVisible(!selectVisible)
  }
  const onClickSubmit = () => {
    setTableLoad(true)
    setTimeout(() => {
      setHiddenRow(checkedList)
      setTableLoad(false)
      localStorage.setItem('hiddenColumns', JSON.stringify(checkedList))
    }, 1000)
  }
  let nhomArray = dataDoiTuong?.map((customer) => customer.Nhom)

  return (
    <>
      <>
        <div className="flex justify-between relative">
          <div className=" flex items-center gap-x-4 ">
            <h1 className="text-xl font-black uppercase">Công Nợ Nhà cung cấp </h1>
          </div>
          <div className="flex justify-between" ref={showOption}>
            <div className="cursor-pointer hover:bg-slate-200 items-center rounded-full px-2 py-1.5  " onClick={() => setIsShowOption(!isShowOption)} title="Chức năng khác">
              <TfiMoreAlt className={`duration-300 rotate-${isShowOption ? '0' : '90'}`} />
            </div>
            {isShowOption && (
              <div className="absolute flex flex-col gap-2 bg-slate-200 p-3 top-0 right-[2.5%] rounded-lg z-10 duration-500 shadow-custom">
                <div className={`flex ${selectVisible ? '' : 'flex-col'} items-center gap-2`}>
                  <ActionButton
                    handleAction={() => exportToExcel()}
                    title={'Xuất Excel'}
                    icon={<RiFileExcel2Fill className="w-5 h-5" />}
                    color={'slate-50'}
                    background={'green-500'}
                    color_hover={'green-500'}
                    bg_hover={'white'}
                  />
                  <ActionButton
                    handleAction={() => handleHidden()}
                    title={'Ẩn Cột'}
                    icon={<FaEyeSlash className="w-5 h-5" />}
                    color={'slate-50'}
                    background={'red-500'}
                    color_hover={'red-500'}
                    bg_hover={'white'}
                  />
                </div>
                <div>
                  {selectVisible && (
                    <div>
                      <Checkbox.Group
                        style={{
                          width: '520px',
                          background: 'white',
                          padding: 10,
                          borderRadius: 10,
                          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                        }}
                        className="flex flex-col"
                        defaultValue={checkedList}
                        onChange={onChange}
                      >
                        <Row>
                          {options && options.length > 0 ? (
                            options?.map((item, index) => (
                              <Col span={8} key={(item, index)}>
                                <Checkbox value={item} checked={true}>
                                  {nameColumsCongNoDauVao[item]}
                                </Checkbox>
                              </Col>
                            ))
                          ) : (
                            <Empty className="w-[100%] h-[100%]" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                          )}
                        </Row>

                        <Button className="mt-2 w-full" onClick={onClickSubmit}>
                          Xác Nhận
                        </Button>
                      </Checkbox.Group>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-start items-center">
          <Date onDateChange={setDataAPI} dataDate={dataAPI} />
          <FilterCp
            title1={'Nhóm'}
            title2={'Đến'}
            title3={'Chọn'}
            option1={Array.from(new Set(nhomArray)).filter((element) => element !== '')}
            option2={Array.from(new Set(nhomArray)).filter((element) => element !== '')}
            option3={Array.from(new Set(dataNhomDoiTuong)).filter((element) => element !== '')}
            dataAPI={dataAPI}
            setDataAPI={setDataAPI}
            title={'DauVao'}
          />
        </div>
        <div id="my-table">
          <QueryTable param={data} columName={[]} height={'setHeight'} title={'DauVao'} hiden={hiddenRow} />
        </div>
      </>
    </>
  )
}

export default CongNoDauVao
