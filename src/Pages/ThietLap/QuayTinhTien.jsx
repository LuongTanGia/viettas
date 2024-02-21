/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { Button, Checkbox, Col, Input, Row, Spin, Table, Tooltip, Typography } from 'antd'
const { Text } = Typography
import moment from 'moment'
import { CgCloseO } from 'react-icons/cg'
import { TfiMoreAlt } from 'react-icons/tfi'
import { RiFileExcel2Fill } from 'react-icons/ri'
import { IoMdAddCircleOutline } from 'react-icons/io'
import { FaSearch, FaEyeSlash } from 'react-icons/fa'
import { CloseSquareFilled } from '@ant-design/icons'
import { MdEdit, MdDelete } from 'react-icons/md'
import { useSearch } from '../../components/hooks/Search'
import { RETOKEN, exportToExcel } from '../../action/Actions'
import categoryAPI from '../../API/linkAPI'
import HighlightedCell from '../../components/hooks/HighlightedCell'
import ActionButton from '../../components/util/Button/ActionButton'
import SimpleBackdrop from '../../components/util/Loading/LoadingPage'
import { nameColumsQuayTinhTien } from '../../components/util/Table/ColumnName'

const QuayTinhTien = () => {
  return <div>QuayTinhTien</div>
}

export default QuayTinhTien
