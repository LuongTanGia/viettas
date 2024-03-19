/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect, useContext, useRef } from 'react'
import { Checkbox, Form, Input, Table, Tooltip, Typography } from 'antd'
const { Text } = Typography
import { CgCloseO } from 'react-icons/cg'
import { FaSearch } from 'react-icons/fa'
import { CloseSquareFilled } from '@ant-design/icons'
import { useSearch } from '../../components/hooks/Search'
import { RETOKEN } from '../../action/Actions'
import categoryAPI from '../../API/linkAPI'
import ActionButton from '../../components/util/Button/ActionButton'
import SimpleBackdrop from '../../components/util/Loading/LoadingPage'
import HighlightedCell from '../../components/hooks/HighlightedCell'

const PhanQuyen = () => {
  const navigate = useNavigate()
  const TokenAccess = localStorage.getItem('TKN')
  const [dataChucNang, setDataChucNang] = useState()
  const [dataUser, setDataUser] = useState()
  const [setSearchChucNang, filteredChucNang, searchChucNang] = useSearch(dataChucNang)
  const [setSearchUser, filteredUser, searchUser] = useSearch(dataUser)
  const [isShowNotify, setIsShowNotify] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [tableLoadLeft, setTableLoadLeft] = useState(true)
  const [tableLoadRight, setTableLoadRight] = useState(true)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [targetRow, setTargetRow] = useState([])
  const [dataCRUD, setDataCRUD] = useState()
  const innitProduct = {
    TenChucNang: '',
    VISIBLE: true,
    VIEW: true,
    ADD: true,
    DEL: true,
    EDIT: true,
    RUN: true,
    EXCEL: true,
    TOOLBAR: true,
  }
  const [PQForm, setPQForm] = useState(() => {
    return dataChucNang ? { ...dataChucNang } : innitProduct
  })

  useEffect(() => {
    const getDataQuyenHan = async () => {
      try {
        const response = await categoryAPI.QuyenHan('HeThong_PhanQuyen', TokenAccess)
        if (response.data.DataError === 0) {
          setDataCRUD(response.data)
          setIsLoading(true)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getDataQuyenHan()
        }
      } catch (error) {
        console.log(error)
        setIsLoading(true)
      }
    }
    getDataQuyenHan()
  }, [])

  useEffect(() => {
    const getDataNguoiDung = async () => {
      try {
        const response = await categoryAPI.ListHelperPhanQuyen_NguoiDung(TokenAccess)
        if (response.data.DataError === 0) {
          setDataUser(response.data.DataResults)
          setIsLoading(true)
          setTableLoadLeft(false)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getDataNguoiDung()
        } else {
          setDataUser([])
          setIsLoading(true)
          setTableLoadLeft(false)
        }
      } catch (error) {
        console.log(error)
        setIsLoading(true)
      }
    }
    getDataNguoiDung()
  }, [searchUser, targetRow])

  useEffect(() => {
    const getDataChucNang = async () => {
      try {
        const response = await categoryAPI.ListHelperPhanQuyen_ChucNang(TokenAccess)
        if (response.data.DataError === 0) {
          setDataChucNang(response.data.DataResults)
          setIsLoading(true)
          setTableLoadRight(false)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getDataChucNang()
        } else {
          setDataChucNang([])
          setIsLoading(true)
          setTableLoadRight(false)
        }
      } catch (error) {
        console.log(error)
        setIsLoading(true)
      }
    }
    getDataChucNang()
  }, [searchChucNang, targetRow])

  const handleCreate = () => {
    console.log('hi')
  }
  const handleSearch = (event) => {
    let timerId
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      setSearchChucNang(event.target.value)
      setSearchUser(event.target.value)
    }, 300)
  }
  const titlesUser = [
    {
      title: 'STT',
      dataIndex: 'STT',
      width: 40,
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'Ma',
      key: 'Ma',
      showSorterTooltip: false,
      width: 120,
      align: 'center',
      sorter: (a, b) => (a.Ma?.toString() || '').localeCompare(b.Ma?.toString() || ''),
      render: (text) => (
        <Tooltip title={text} color="blue">
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              textAlign: 'start',
            }}
          >
            <HighlightedCell text={text} search={searchUser} />
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Diễn giải',
      dataIndex: 'Ten',
      key: 'Ten',
      showSorterTooltip: false,
      width: 120,
      align: 'center',
      sorter: (a, b) => (a.Ten?.toString() || '').localeCompare(b.Ten?.toString() || ''),
      render: (text) => (
        <Tooltip title={text} color="blue">
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              textAlign: 'start',
            }}
          >
            <HighlightedCell text={text} search={searchUser} />
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Chọn',
      key: 'operation',
      width: 40,
      fixed: 'right',
      align: 'center',
      render: (record) => {
        return (
          <>
            <Checkbox className=" justify-center" id={record.key} />
          </>
        )
      },
    },
  ]
  const titlesChucNang = [
    {
      title: 'Tên chức năng',
      dataIndex: 'TenChucNang',
      fixed: 'left',
      align: 'center',
      render: (text) => (
        <div
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            textAlign: 'start',
          }}
        >
          <HighlightedCell text={text} search={searchChucNang} />
        </div>
      ),
    },
    {
      title: 'Hiển thị',
      dataIndex: 'VISIBLE',
      key: 'VISIBLE',
      align: 'center',
      width: 70,
      showSorterTooltip: false,
      render: (text, record) => {
        return (
          <Checkbox
            className=" justify-center"
            id={`VISIBLE_${record.key}`}
            checked={PQForm.VISIBLE}
            disabled={record.ALLOW_VISIBLE == false}
            onChange={() => {
              setPQForm({ ...record, VISIBLE: !PQForm.VISIBLE })
            }}
          />
        )
      },
    },
    {
      title: 'Xem',
      dataIndex: 'VIEW',
      key: 'VIEW',
      align: 'center',
      width: 70,
      showSorterTooltip: false,
      render: (text, record) => {
        return (
          <Checkbox
            className=" justify-center"
            id={`VIEW_${record.key}`}
            checked={PQForm.VIEW}
            disabled={record.ALLOW_VIEW == false}
            onChange={() => {
              setPQForm({ ...record, VIEW: !PQForm.VIEW })
            }}
          />
        )
      },
    },
    {
      title: 'Thêm',
      dataIndex: 'ADD',
      key: 'ADD',
      align: 'center',
      width: 70,
      showSorterTooltip: false,
      render: (text, record) => (
        <Checkbox
          className=" justify-center"
          id={`ADD_${record.key}`}
          checked={PQForm.ADD}
          disabled={record.ALLOW_ADD == false}
          onChange={() => {
            setPQForm({ ...record, ADD: !PQForm.ADD })
          }}
        />
      ),
    },
    {
      title: 'Xóa',
      dataIndex: 'DEL',
      key: 'DEL',
      align: 'center',
      width: 70,
      showSorterTooltip: false,
      render: (text, record) => {
        return <Checkbox className=" justify-center" id={`DEL_${record.key}`} checked={text} disabled={record.ALLOW_DEL == false} />
      },
    },
    {
      title: 'Sửa',
      dataIndex: 'EDIT',
      key: 'EDIT',
      align: 'center',
      width: 70,
      showSorterTooltip: false,
      render: (text, record) => {
        return <Checkbox className=" justify-center" id={`EDIT_${record.key}`} checked={text} disabled={record.ALLOW_EDIT == false} />
      },
    },
    {
      title: 'Chạy',
      dataIndex: 'RUN',
      key: 'RUN',
      align: 'center',
      width: 70,
      showSorterTooltip: false,
      render: (text, record) => {
        return <Checkbox className=" justify-center" id={`RUN_${record.key}`} checked={text} disabled={record.ALLOW_RUN == false} />
      },
    },
    {
      title: 'Excel',
      dataIndex: 'EXCEL',
      key: 'EXCEL',
      align: 'center',
      width: 70,
      showSorterTooltip: false,
      render: (text, record) => {
        return <Checkbox className=" justify-center" id={`EXCEL_${record.key}`} checked={text} disabled={record.ALLOW_EXCEL == false} />
      },
    },
    {
      title: 'Toolbar',
      dataIndex: 'TOOLBAR',
      key: 'TOOLBAR',
      align: 'center',
      width: 70,
      showSorterTooltip: false,
      render: (text, record) => {
        return <Checkbox className="justify-center" id={`TOOLBAR_${record.key}`} checked={text} disabled={record.ALLOW_TOOLBAR == false} />
      },
    },
  ]
  const data = filteredChucNang
    ? filteredChucNang
        .filter((item) => item.NhomChucNang === '10')
        .map((item, index) => ({
          key: index,
          TenChucNang: item.TenChucNang,
          VISIBLE: item.VISIBLE,
          VIEW: item.VIEW,
          ADD: item.ADD,
          DEL: item.DEL,
          EDIT: item.EDIT,
          RUN: item.RUN,
          EXCEL: item.EXCEL,
          TOOLBAR: item.TOOLBAR,
          ALLOW_VISIBLE: item.ALLOW_VISIBLE,
          ALLOW_VIEW: item.ALLOW_VIEW,
          ALLOW_ADD: item.ALLOW_ADD,
          ALLOW_DEL: item.ALLOW_DEL,
          ALLOW_EDIT: item.ALLOW_EDIT,
          ALLOW_RUN: item.ALLOW_RUN,
          ALLOW_EXCEL: item.ALLOW_EXCEL,
          ALLOW_TOOLBAR: item.ALLOW_TOOLBAR,
          children: filteredChucNang
            .filter((chir_data) => chir_data.NhomChucNang === item.MaChucNang)
            .map((chir_data) => ({
              key: chir_data.MaChucNang,
              TenChucNang: chir_data.TenChucNang,
              VISIBLE: chir_data.VISIBLE,
              VIEW: chir_data.VIEW,
              ADD: chir_data.ADD,
              DEL: chir_data.DEL,
              EDIT: chir_data.EDIT,
              RUN: chir_data.RUN,
              EXCEL: chir_data.EXCEL,
              TOOLBAR: chir_data.TOOLBAR,
              ALLOW_VISIBLE: chir_data.ALLOW_VISIBLE,
              ALLOW_VIEW: chir_data.ALLOW_VIEW,
              ALLOW_ADD: chir_data.ALLOW_ADD,
              ALLOW_DEL: chir_data.ALLOW_DEL,
              ALLOW_EDIT: chir_data.ALLOW_EDIT,
              ALLOW_RUN: chir_data.ALLOW_RUN,
              ALLOW_EXCEL: chir_data.ALLOW_EXCEL,
              ALLOW_TOOLBAR: chir_data.ALLOW_TOOLBAR,
              children:
                filteredChucNang.filter((chir_data_2) => chir_data_2.NhomChucNang === chir_data.MaChucNang).length > 0
                  ? filteredChucNang
                      .filter((chir_data_2) => chir_data_2.NhomChucNang === chir_data.MaChucNang)
                      .map((chir_data_2) => ({
                        key: chir_data_2.MaChucNang,
                        TenChucNang: chir_data_2.TenChucNang,
                        VISIBLE: chir_data_2.VISIBLE,
                        VIEW: chir_data_2.VIEW,
                        ADD: chir_data_2.ADD,
                        DEL: chir_data_2.DEL,
                        EDIT: chir_data_2.EDIT,
                        RUN: chir_data_2.RUN,
                        EXCEL: chir_data_2.EXCEL,
                        TOOLBAR: chir_data_2.TOOLBAR,
                        ALLOW_VISIBLE: chir_data_2.ALLOW_VISIBLE,
                        ALLOW_VIEW: chir_data_2.ALLOW_VIEW,
                        ALLOW_ADD: chir_data_2.ALLOW_ADD,
                        ALLOW_DEL: chir_data_2.ALLOW_DEL,
                        ALLOW_EDIT: chir_data_2.ALLOW_EDIT,
                        ALLOW_RUN: chir_data_2.ALLOW_RUN,
                        ALLOW_EXCEL: chir_data_2.ALLOW_EXCEL,
                        ALLOW_TOOLBAR: chir_data_2.ALLOW_TOOLBAR,
                      }))
                  : undefined,
            })),
        }))
    : []

  return (
    <>
      {dataCRUD?.RUN == false ? (
        <>
          {isShowNotify && (
            <div className="w-screen h-screen fixed top-0 left-0 right-0 bottom-0 z-10">
              <div className="overlay bg-gray-800 bg-opacity-80 w-screen h-screen fixed top-0 left-0 right-0 bottom-0"></div>
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col bg-white px-2 rounded shadow-custom overflow-hidden">
                <div className="flex flex-col gap-2 p-2 justify-between ">
                  <div className="flex flex-col gap-2 p-2">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <p className="text-blue-700 font-semibold uppercase">Kiểm tra quyền hạn người dùng</p>
                      </div>
                    </div>
                    <div className="flex gap-2 border-2 p-3 items-center">
                      <div>
                        <CgCloseO className="w-8 h-8 text-red-500" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="whitespace-nowrap">Bạn không có quyền thực hiện chức năng này!</p>
                        <p className="whitespace-nowrap">
                          Vui lòng liên hệ <span className="font-bold">Người Quản Trị</span> để được cấp quyền
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <ActionButton
                        handleAction={() => {
                          setIsShowNotify(false)
                          navigate(-1)
                        }}
                        title={'Đóng'}
                        isModal={true}
                        color={'slate-50'}
                        background={'red-500'}
                        color_hover={'red-500'}
                        bg_hover={'white'}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {!isLoading ? (
            <SimpleBackdrop />
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between gap-2 relative">
                  <div className="flex gap-2 items-center">
                    <div className="flex items-center gap-2 mt-1">
                      <h1 className="text-xl font-black uppercase">Phân Quyền</h1>
                      <FaSearch className="hover:text-red-400 cursor-pointer" onClick={() => setIsShowSearch(!isShowSearch)} />
                    </div>
                    <div className="flex">
                      {isShowSearch && (
                        <div className={`flex transition-all linear duration-700 ${isShowSearch ? 'w-[20rem]' : 'w-0'} overflow-hidden`}>
                          <Input
                            allowClear={{
                              clearIcon: <CloseSquareFilled />,
                            }}
                            placeholder="Nhập ký tự bạn cần tìm"
                            onBlur={handleSearch}
                            onPressEnter={handleSearch}
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="flex gap-2">
                    <ActionButton
                      handleAction={() => handleCreate()}
                      title={'Lưu'}
                      isModal={true}
                      color={'slate-50'}
                      background={'blue-500'}
                      color_hover={'blue-500'}
                      bg_hover={'white'}
                    />
                    <ActionButton
                      handleAction={() => handleCreate()}
                      title={'Lưu & Đóng'}
                      isModal={true}
                      color={'slate-50'}
                      background={'blue-500'}
                      color_hover={'blue-500'}
                      bg_hover={'white'}
                    />
                    <ActionButton
                      handleAction={() => {
                        navigate(-1)
                      }}
                      title={'Đóng'}
                      isModal={true}
                      color={'slate-50'}
                      background={'red-500'}
                      color_hover={'red-500'}
                      bg_hover={'white'}
                    />
                  </div>
                </div>
                <div className="flex gap-2" id="my-table">
                  <div className="w-[30vw]">
                    <Table
                      loading={tableLoadLeft}
                      className="setHeight"
                      columns={titlesUser}
                      dataSource={filteredUser?.map((record, index) => ({ ...record, key: index }))}
                      size="small"
                      scroll={{
                        x: 'max-content',
                        y: 300,
                      }}
                      pagination={{
                        defaultPageSize: parseInt(localStorage.getItem('pageSize') || 50),
                        showSizeChanger: true,
                        pageSizeOptions: ['50', '100', '1000'],
                        onShowSizeChange: (current, size) => {
                          localStorage.setItem('pageSize', size)
                        },
                      }}
                      rowClassName={(record) => (record.Thang == targetRow ? 'highlighted-row' : '')}
                      // onRow={(record) => ({
                      //   onDoubleClick: () => handleDoubleClick(record),
                      // })}
                      scrollToFirstRowOnChange
                      bordered
                      style={{
                        whiteSpace: 'nowrap',
                        fontSize: '24px',
                        borderRadius: '10px',
                      }}
                      summary={() => {
                        return (
                          <Table.Summary fixed>
                            <Table.Summary.Row>
                              {titlesUser
                                .filter((column) => column.render)
                                .map((column, index) => {
                                  const isNumericColumn = typeof filteredUser[0]?.[column.dataIndex] == 'number'
                                  return (
                                    <Table.Summary.Cell index={index} key={index} align={isNumericColumn ? 'right' : 'left'} className="text-end font-bold  bg-[#f1f1f1]">
                                      {column.dataIndex == 'STT' ? (
                                        <Text className="text-center flex justify-center" strong>
                                          {dataUser?.length}
                                        </Text>
                                      ) : null}
                                    </Table.Summary.Cell>
                                  )
                                })}
                            </Table.Summary.Row>
                          </Table.Summary>
                        )
                      }}
                    />
                  </div>
                  <div className="PhanQuyen w-[67vw]">
                    <Table
                      loading={tableLoadRight}
                      className="setHeight"
                      columns={titlesChucNang}
                      dataSource={data?.map((item, index) => ({ ...item, key: index }))}
                      size="small"
                      scroll={{
                        x: 'max-content',
                        y: '300',
                      }}
                      pagination={false}
                      scrollToFirstRowOnChange
                      bordered
                      style={{
                        whiteSpace: 'nowrap',
                        fontSize: '24px',
                        borderRadius: '10px',
                      }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}

export default PhanQuyen
