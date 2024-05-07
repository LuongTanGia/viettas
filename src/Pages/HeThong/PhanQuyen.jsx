/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect, useMemo } from 'react'
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
import { toast } from 'react-toastify'

const PhanQuyen = () => {
  const navigate = useNavigate()
  const TokenAccess = localStorage.getItem('TKN')
  const [dataChucNang, setDataChucNang] = useState()
  const [dataUser, setDataUser] = useState()
  const [setSearchChucNang, filteredChucNang, searchChucNang] = useSearch(dataChucNang)
  const [setSearchUser, filteredUser, searchUser] = useSearch(dataUser)
  const [isShowNotify, setIsShowNotify] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isHandle, setIsHandle] = useState(false)
  const [tableLoadLeft, setTableLoadLeft] = useState(true)
  const [tableLoadRight, setTableLoadRight] = useState(true)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [targetRow, setTargetRow] = useState([])
  const [dataCRUD, setDataCRUD] = useState()
  const [checkedValue, setCheckedValue] = useState([])
  const [dataSource, setDataSource] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
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
    return dataSource && dataSource?.length > 0 ? { ...dataSource[0] } : innitProduct
  })

  useEffect(() => {
    const getDataNguoiDung = async () => {
      try {
        const response = await categoryAPI.ListHelperPhanQuyen_NguoiDung(TokenAccess)
        if (response.data.DataError === 0) {
          setDataUser(response.data.DataResults)
          setIsLoading(true)
          setTableLoadLeft(false)
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

  const handleCreate = async () => {
    try {
      console.log({
        DanhSachNguoiDung: selectedRowKeys?.map((item) => ({ Ma: item })),
        DuLieuPhanQuyen:
          PQForm?.children && PQForm.children.length > 0
            ? PQForm.children.map((child) => ({
                ...PQForm,
                ...child,
                children:
                  child.children && child.children.length > 0
                    ? child.children.map((subChild) => ({
                        ...child,
                        ...subChild,
                      }))
                    : [child],
              }))
            : [PQForm],
      })

      // const response = await categoryAPI.DieuChinhQuyenHan({ DanhSachNguoiDung: selectedRowKeys, DuLieuPhanQuyen: PQForm }, TokenAccess)
      // if (response.data.DataError == 0) {
      //   setPQForm([])
      //   // loadingData()
      //   toast.success('Tạo thành công', { autoClose: 1000 })
      //   setTargetRow(selectedRowKeys)
      // } else {
      // toast.warning(response.data.DataErrorDescription, { autoClose: 2000 })
      // }
    } catch (error) {
      toast.error('Lỗi Server vui lòng thử lại', { autoClose: 1000 })
    }
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
      fixed: 'left',
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
  ]

  const handleCheckboxChange = (checked, recordKey, value) => {
    const updatedDataSource = dataSource.map((record) => {
      if (isNaN(recordKey)) {
        const updatedChildren = record?.children.map((child) => {
          const updateSubChildren = child?.children?.map((subChild) => {
            if (subChild.key === recordKey) {
              if (value === 'VISIBLE') {
                const updatedSubChildVISIBLE = {
                  ...subChild,
                  [value]: checked,
                  VIEW: subChild.ALLOW_VIEW == true ? checked : null,
                  ADD: subChild.ALLOW_ADD == true ? checked : null,
                  DEL: subChild.ALLOW_DEL == true ? checked : null,
                  EDIT: subChild.ALLOW_EDIT == true ? checked : null,
                  RUN: subChild.ALLOW_RUN == true ? checked : null,
                  EXCEL: subChild.ALLOW_EXCEL == true ? checked : null,
                  TOOLBAR: subChild.ALLOW_TOOLBAR == true ? checked : null,
                }
                setPQForm(updatedSubChildVISIBLE)
                return updatedSubChildVISIBLE
              } else if (value === 'VIEW') {
                const updatedSubChildVIEW = {
                  ...subChild,
                  [value]: checked,
                  ADD: subChild.ALLOW_ADD == true ? checked : null,
                  DEL: subChild.ALLOW_DEL == true ? checked : null,
                  EDIT: subChild.ALLOW_EDIT == true ? checked : null,
                  RUN: subChild.ALLOW_RUN == true ? checked : null,
                  EXCEL: subChild.ALLOW_EXCEL == true ? checked : null,
                  TOOLBAR: subChild.ALLOW_TOOLBAR == true ? checked : null,
                }
                setPQForm(updatedSubChildVIEW)
                return updatedSubChildVIEW
              } else {
                setPQForm({ ...subChild, [value]: checked })
                return { ...subChild, [value]: checked }
              }
            }
            return subChild
          })
          if (child.key === recordKey) {
            if (value === 'VISIBLE') {
              const updatedChildVISIBLE = {
                ...child,
                [value]: checked,
                VIEW: child.ALLOW_VIEW == true ? checked : null,
                ADD: child.ALLOW_ADD == true ? checked : null,
                DEL: child.ALLOW_DEL == true ? checked : null,
                EDIT: child.ALLOW_EDIT == true ? checked : null,
                RUN: child.ALLOW_RUN == true ? checked : null,
                EXCEL: child.ALLOW_EXCEL == true ? checked : null,
                TOOLBAR: child.ALLOW_TOOLBAR == true ? checked : null,
                children: updateSubChildren?.map((subChild) => {
                  if (value === 'VISIBLE' || value === 'VIEW') {
                    return {
                      ...subChild,
                      [value]: checked,
                      VIEW: subChild.ALLOW_VIEW === true ? checked : null,
                      ADD: subChild.ALLOW_ADD === true ? checked : null,
                      DEL: subChild.ALLOW_DEL === true ? checked : null,
                      EDIT: subChild.ALLOW_EDIT === true ? checked : null,
                      RUN: subChild.ALLOW_RUN === true ? checked : null,
                      EXCEL: subChild.ALLOW_EXCEL === true ? checked : null,
                      TOOLBAR: subChild.ALLOW_TOOLBAR === true ? checked : null,
                    }
                  } else {
                    setPQForm({ ...subChild, [value]: checked })
                    return { ...subChild, [value]: checked }
                  }
                }),
              }
              setPQForm(updatedChildVISIBLE)
              return updatedChildVISIBLE
            } else if (value === 'VIEW') {
              const updatedChildVIEW = {
                ...child,
                [value]: checked,
                ADD: child.ALLOW_ADD == true ? checked : null,
                DEL: child.ALLOW_DEL == true ? checked : null,
                EDIT: child.ALLOW_EDIT == true ? checked : null,
                RUN: child.ALLOW_RUN == true ? checked : null,
                EXCEL: child.ALLOW_EXCEL == true ? checked : null,
                TOOLBAR: child.ALLOW_TOOLBAR == true ? checked : null,
                children: updateSubChildren?.map((subChild) => {
                  if (value === 'VISIBLE' || value === 'VIEW') {
                    return {
                      ...subChild,
                      [value]: checked,
                      VIEW: subChild.ALLOW_VIEW === true ? checked : null,
                      ADD: subChild.ALLOW_ADD === true ? checked : null,
                      DEL: subChild.ALLOW_DEL === true ? checked : null,
                      EDIT: subChild.ALLOW_EDIT === true ? checked : null,
                      RUN: subChild.ALLOW_RUN === true ? checked : null,
                      EXCEL: subChild.ALLOW_EXCEL === true ? checked : null,
                      TOOLBAR: subChild.ALLOW_TOOLBAR === true ? checked : null,
                    }
                  } else {
                    setPQForm({ ...subChild, [value]: checked })
                    return { ...subChild, [value]: checked }
                  }
                }),
              }
              setPQForm(updatedChildVIEW)
              return updatedChildVIEW
            } else if (updateSubChildren?.length > 0) {
              const updatedChild = {
                ...child,
                [value]: child[`ALLOW_${value}`] === true ? checked : null,
                children: updateSubChildren.map((subChild) => {
                  if (value === 'VISIBLE' || value === 'VIEW') {
                    return {
                      ...subChild,
                      [value]: subChild[`ALLOW_${value}`] === true ? checked : null,
                      VIEW: subChild.ALLOW_VIEW === true ? checked : null,
                      ADD: subChild.ALLOW_ADD === true ? checked : null,
                      DEL: subChild.ALLOW_DEL === true ? checked : null,
                      EDIT: subChild.ALLOW_EDIT === true ? checked : null,
                      RUN: subChild.ALLOW_RUN === true ? checked : null,
                      EXCEL: subChild.ALLOW_EXCEL === true ? checked : null,
                      TOOLBAR: subChild.ALLOW_TOOLBAR === true ? checked : null,
                    }
                  } else {
                    setPQForm({ ...subChild, [value]: subChild[`ALLOW_${value}`] === true ? checked : null })
                    return { ...subChild, [value]: subChild[`ALLOW_${value}`] === true ? checked : null }
                  }
                }),
              }
              setPQForm(updatedChild)
              return updatedChild
            } else {
              setPQForm({ ...child, [value]: checked })
              return { ...child, [value]: checked }
            }
          }
          checkedValue.push((pre) => {
            pre.child
          })
          return { ...child, children: updateSubChildren }
        })
        return { ...record, children: updatedChildren }
      } else {
        const updateRecord = (item) => {
          if (item.key === recordKey) {
            const updatedItem = {
              ...item,
              [value]: checked,
              children: item.children.map((child) => {
                const updatedChild = {
                  ...child,
                  [value]: child[`ALLOW_${value}`] === true ? checked : null,
                  children:
                    child.children?.map((subChild) => {
                      const updateSubChildren = {
                        ...subChild,
                        [value]: subChild[`ALLOW_${value}`] === true ? checked : null,
                      }
                      return value === 'VISIBLE'
                        ? {
                            ...updateSubChildren,
                            VIEW: subChild.ALLOW_VIEW === true ? checked : null,
                            ADD: subChild.ALLOW_ADD === true ? checked : null,
                            DEL: subChild.ALLOW_DEL === true ? checked : null,
                            EDIT: subChild.ALLOW_EDIT === true ? checked : null,
                            RUN: subChild.ALLOW_RUN === true ? checked : null,
                            EXCEL: subChild.ALLOW_EXCEL === true ? checked : null,
                            TOOLBAR: subChild.ALLOW_TOOLBAR === true ? checked : null,
                          }
                        : value === 'VIEW'
                          ? {
                              ...updateSubChildren,
                              ADD: subChild.ALLOW_ADD === true ? checked : null,
                              DEL: subChild.ALLOW_DEL === true ? checked : null,
                              EDIT: subChild.ALLOW_EDIT === true ? checked : null,
                              RUN: subChild.ALLOW_RUN === true ? checked : null,
                              EXCEL: subChild.ALLOW_EXCEL === true ? checked : null,
                              TOOLBAR: subChild.ALLOW_TOOLBAR === true ? checked : null,
                            }
                          : updateSubChildren
                    }) || null,
                }
                return value === 'VISIBLE'
                  ? {
                      ...updatedChild,
                      VIEW: child.ALLOW_VIEW === true ? checked : null,
                      ADD: child.ALLOW_ADD === true ? checked : null,
                      DEL: child.ALLOW_DEL === true ? checked : null,
                      EDIT: child.ALLOW_EDIT === true ? checked : null,
                      RUN: child.ALLOW_RUN === true ? checked : null,
                      EXCEL: child.ALLOW_EXCEL === true ? checked : null,
                      TOOLBAR: child.ALLOW_TOOLBAR === true ? checked : null,
                    }
                  : value === 'VIEW'
                    ? {
                        ...updatedChild,
                        ADD: child.ALLOW_ADD === true ? checked : null,
                        DEL: child.ALLOW_DEL === true ? checked : null,
                        EDIT: child.ALLOW_EDIT === true ? checked : null,
                        RUN: child.ALLOW_RUN === true ? checked : null,
                        EXCEL: child.ALLOW_EXCEL === true ? checked : null,
                        TOOLBAR: child.ALLOW_TOOLBAR === true ? checked : null,
                      }
                    : updatedChild
              }),
            }
            setPQForm(updatedItem)
            return value === 'VISIBLE'
              ? {
                  ...updatedItem,
                  VIEW: item.ALLOW_VIEW === true ? checked : null,
                  ADD: item.ALLOW_ADD === true ? checked : null,
                  DEL: item.ALLOW_DEL === true ? checked : null,
                  EDIT: item.ALLOW_EDIT === true ? checked : null,
                  RUN: item.ALLOW_RUN === true ? checked : null,
                  EXCEL: item.ALLOW_EXCEL === true ? checked : null,
                  TOOLBAR: item.ALLOW_TOOLBAR === true ? checked : null,
                }
              : value === 'VIEW'
                ? {
                    ...updatedItem,
                    ADD: item.ALLOW_ADD === true ? checked : null,
                    DEL: item.ALLOW_DEL === true ? checked : null,
                    EDIT: item.ALLOW_EDIT === true ? checked : null,
                    RUN: item.ALLOW_RUN === true ? checked : null,
                    EXCEL: item.ALLOW_EXCEL === true ? checked : null,
                    TOOLBAR: item.ALLOW_TOOLBAR === true ? checked : null,
                  }
                : updatedItem
          }
          return item
        }
        return updateRecord(record)
      }
    })
    setDataSource(updatedDataSource)
  }
  const isParentRecord = (record) => {
    return record?.children && record?.children?.length > 0
  }

  const titlesChucNang = [
    {
      title: 'Tên chức năng',
      dataIndex: 'TenChucNang',
      fixed: 'left',
      align: 'center',
      render: (text, record) => (
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
        const filteredChildrenVISIBLE = dataSource[record.key]?.children.filter((child) => child.VISIBLE === true)

        return (
          <Checkbox
            className=" justify-center"
            indeterminate={
              filteredChildrenVISIBLE?.length == 0
                ? false
                : isParentRecord(record) &&
                  checkedValue.length > 0 &&
                  filteredChildrenVISIBLE?.length < dataSource[record.key]?.children.filter((child) => child?.ALLOW_VISIBLE !== false)?.length
            }
            checked={text}
            id={`VISIBLE_${record?.key}`}
            disabled={record?.ALLOW_VISIBLE == false}
            onChange={(e) => handleCheckboxChange(e.target.checked, record?.key, 'VISIBLE')}
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
        const filteredChildrenVIEW = dataSource[record.key]?.children.filter((child) => child?.VIEW === true)
        return (
          <Checkbox
            indeterminate={
              filteredChildrenVIEW?.length === 0
                ? false
                : isParentRecord(record) &&
                  checkedValue.length > 0 &&
                  filteredChildrenVIEW?.length < dataSource[record.key]?.children.filter((child) => child?.ALLOW_VIEW !== false)?.length
            }
            className=" justify-center"
            id={`VIEW_${record?.key}`}
            checked={text}
            disabled={record?.ALLOW_VIEW == false}
            onChange={(e) => handleCheckboxChange(e.target.checked, record?.key, 'VIEW')}
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
      render: (text, record) => {
        const filteredChildrenADD = dataSource[record.key]?.children.filter((child) => child?.ADD === true)
        return (
          <Checkbox
            indeterminate={
              filteredChildrenADD?.length === 0
                ? false
                : isParentRecord(record) &&
                  checkedValue.length > 0 &&
                  filteredChildrenADD?.length < dataSource[record.key]?.children.filter((child) => child?.ALLOW_ADD !== false)?.length
            }
            className=" justify-center"
            id={`ADD_${record?.key}`}
            checked={text}
            disabled={record?.ALLOW_ADD == false}
            onChange={(e) => handleCheckboxChange(e.target.checked, record?.key, 'ADD')}
          />
        )
      },
    },
    {
      title: 'Xóa',
      dataIndex: 'DEL',
      key: 'DEL',
      align: 'center',
      width: 70,
      showSorterTooltip: false,
      render: (text, record) => {
        const filteredChildrenDEL = dataSource[record.key]?.children.filter((child) => child?.DEL === true)
        return (
          <Checkbox
            indeterminate={
              filteredChildrenDEL?.length === 0
                ? false
                : isParentRecord(record) &&
                  checkedValue.length > 0 &&
                  filteredChildrenDEL?.length < dataSource[record.key]?.children.filter((child) => child?.ALLOW_DEL !== false)?.length
            }
            className=" justify-center"
            id={`DEL_${record?.key}`}
            checked={text}
            disabled={record?.ALLOW_DEL == false}
            onChange={(e) => handleCheckboxChange(e.target.checked, record?.key, 'DEL')}
          />
        )
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
        const filteredChildrenEDIT = dataSource[record.key]?.children.filter((child) => child?.EDIT === true)
        return (
          <Checkbox
            indeterminate={
              filteredChildrenEDIT?.length === 0
                ? false
                : isParentRecord(record) &&
                  checkedValue.length > 0 &&
                  filteredChildrenEDIT?.length < dataSource[record.key]?.children.filter((child) => child?.ALLOW_EDIT !== false)?.length
            }
            className=" justify-center"
            id={`EDIT_${record?.key}`}
            checked={text}
            disabled={record?.ALLOW_EDIT == false}
            onChange={(e) => handleCheckboxChange(e.target.checked, record?.key, 'EDIT')}
          />
        )
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
        const filteredChildrenRUN = dataSource[record.key]?.children.filter((child) => child?.RUN === true)
        return (
          <Checkbox
            indeterminate={
              filteredChildrenRUN?.length === 0
                ? false
                : isParentRecord(record) &&
                  checkedValue.length > 0 &&
                  filteredChildrenRUN?.length < dataSource[record.key]?.children.filter((child) => child?.ALLOW_RUN !== false)?.length
            }
            className=" justify-center"
            id={`RUN_${record?.key}`}
            checked={text}
            disabled={record?.ALLOW_RUN == false}
            onChange={(e) => handleCheckboxChange(e.target.checked, record?.key, 'RUN')}
          />
        )
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
        const filteredChildrenEXCEL = dataSource[record.key]?.children.filter((child) => child?.EXCEL === true)
        return (
          <Checkbox
            indeterminate={
              filteredChildrenEXCEL?.length === 0
                ? false
                : isParentRecord(record) &&
                  checkedValue.length > 0 &&
                  filteredChildrenEXCEL?.length < dataSource[record.key]?.children.filter((child) => child?.ALLOW_EXCEL !== false)?.length
            }
            className=" justify-center"
            id={`EXCEL_${record?.key}`}
            checked={text}
            disabled={record?.ALLOW_EXCEL == false}
            onChange={(e) => handleCheckboxChange(e.target.checked, record?.key, 'EXCEL')}
          />
        )
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
        const filteredChildrenTOOLBAR = dataSource[record.key]?.children.filter((child) => child?.TOOLBAR === true)
        return (
          <Checkbox
            indeterminate={
              filteredChildrenTOOLBAR?.length === 0
                ? false
                : isParentRecord(record) &&
                  checkedValue.length > 0 &&
                  filteredChildrenTOOLBAR?.length < dataSource[record.key]?.children.filter((child) => child?.ALLOW_TOOLBAR !== false)?.length
            }
            className=" justify-center"
            id={`TOOLBAR_${record?.key}`}
            checked={text}
            disabled={record?.ALLOW_TOOLBAR == false}
            onChange={(e) => handleCheckboxChange(e.target.checked, record?.key, 'TOOLBAR')}
          />
        )
      },
    },
  ]

  useEffect(() => {
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

    setDataSource(data)
  }, [isHandle, tableLoadRight])

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
                      title={'Lưu & đóng'}
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
                      rowSelection={{
                        selectedRowKeys,
                        showSizeChanger: true,
                        onChange: (selectedKeys) => {
                          setSelectedRowKeys(selectedKeys)
                        },
                      }}
                      rowKey={(record) => record.Ma}
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
                      rowClassName={(record) => (record?.Ma == targetRow ? 'highlighted-row' : '')}
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
                              <Table.Summary.Cell className="bg-gray-100"></Table.Summary.Cell>
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
                      dataSource={dataSource?.map((item, index) => ({ ...item, key: index }))}
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
