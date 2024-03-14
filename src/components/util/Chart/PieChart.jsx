import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import { DoanhSoHangHoa_TopChart, KHOANNGAY } from '../../../action/Actions'
import API from '../../../API/API'
import RateBar from './LoadingChart'
import { Empty } from 'antd'

ChartJS.register(ArcElement, Tooltip, Legend)

export const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
}

function DoughNut() {
  const token = localStorage.getItem('TKN')

  const [dataChart, setDataChart] = useState([])
  useEffect(() => {
    const loadData = async () => {
      const KhoanNgay = await KHOANNGAY(API.KHOANNGAY, token)
      const data = await DoanhSoHangHoa_TopChart(API.DoanhSoNhomHang, token, KhoanNgay)
      setDataChart(data)
    }

    loadData()
  }, [])

  const Labels = dataChart?.map((result) => result.ThongTinDoiTuong) || []
  const dataChart_list = dataChart?.map((result) => result.TyTrong) || []
  const backgroundColor_list = ['#FF0000', '#C850C0', '#FC00FF', '#97D9E1', '#85FFBD', '#FBAB7E', '#F7CE68', '#8BC6EC', '#00DBDE']
  const data = {
    labels: Labels,
    datasets: [
      {
        label: 'index',
        data: dataChart_list,
        backgroundColor: backgroundColor_list,
        borderColor: backgroundColor_list,
        // borderWidth: 10,
      },
    ],
  }
  return (
    <>
      {dataChart && dataChart?.length > 0 ? (
        <div className="pt-1 pb-3 flex justify-between gap-2">
          <div className="w-[40%] h-[40%]  pt-3">
            <Pie data={data} options={options} />
          </div>
          <div className="w-[60%] flex flex-col ">
            {dataChart?.map((item, index) => (
              <div key={index} className="flex items-center justify-center">
                <p className="w-[100%]" style={{ color: backgroundColor_list[index] }}>
                  {item.ThongTinDoiTuong}
                </p>
                <RateBar percentage={item.TyTrong} color={backgroundColor_list[index]} title={item.ThongTinDoiTuong} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Empty className="w-[100%] h-[100%]" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </>
  )
}
export default DoughNut
