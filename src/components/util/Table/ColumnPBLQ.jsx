import moment from 'moment'
import HighlightedCell from '../../hooks/HighlightedCell'
import { Tooltip } from 'antd'

export const columns = [
  {
    title: 'Ngày',
    dataIndex: 'NgayCTu',
    key: 'NgayCTu',
    align: 'center',
    render: (text) => <HighlightedCell text={moment(text).format('DD/MM/YYYY')} search={searchDuLieuBLQ} />,
    width: 100,
    sorter: (a, b) => {
      const dateA = new Date(a.NgayCTu)
      const dateB = new Date(b.NgayCTu)
      return dateA - dateB
    },
    showSorterTooltip: false,
  },
  {
    title: 'Quầy',
    dataIndex: 'Quay',
    key: 'Quay',
    width: 80,
    showSorterTooltip: false,
    align: 'center',
    render: (text) => (
      <div className="truncate text-end">
        <Tooltip title={text} color="blue" placement="top">
          <span>
            <HighlightedCell text={text} search={searchDuLieuBLQ} />
          </span>
        </Tooltip>
      </div>
    ),
    sorter: (a, b) => a.Quay - b.Quay,
  },

  {
    title: 'Ca',
    dataIndex: 'Ca',
    key: 'Ca',
    align: 'center',
    width: 80,
    sorter: (a, b) => a.Ca.localeCompare(b.Ca),
    showSorterTooltip: false,
    render: (text) => (
      <div className="truncate ">
        <Tooltip title={text} color="blue" placement="top">
          <span>
            <HighlightedCell text={text} search={searchDuLieuBLQ} />
          </span>
        </Tooltip>
      </div>
    ),
  },
  {
    title: 'Nhân viên',
    dataIndex: 'NhanVien',
    key: 'NhanVien',
    width: 150,
    align: 'center',
    render: (text) => (
      <div className="text-start">
        <HighlightedCell text={text} search={searchDuLieuBLQ} />
      </div>
    ),
    sorter: (a, b) => a.NhanVien.localeCompare(b.NhanVien),
    showSorterTooltip: false,
  },
]
