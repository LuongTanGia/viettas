import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import { DoanhSoHangHoa_TopChart, KHOANNGAY } from '../../../action/Actions'
import API from '../../../API/API'
import RateBar from './LoadingChart'

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
  const tokenRF = localStorage.getItem('RTKN')
  const [dataChart, setDataChart] = useState([])
  useEffect(() => {
    const loadData = async () => {
      const KhoanNgay = await KHOANNGAY(API.KHOANNGAY, token)
      const data = await DoanhSoHangHoa_TopChart(API.DoanhSoHangHoa_TopChart, token, KhoanNgay)
      setDataChart(data)
    }

    loadData()
  }, [token, tokenRF])
  const Labels = dataChart?.map((result) => result.DataName)
  const dataChart_list = dataChart?.map((result) => result.DataValue)
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
      <div className="pt-1 pb-3 flex justify-between gap-2">
        <div className="w-[40%] h-[40%]  pt-3">
          <Pie data={data} options={options} />
        </div>
        <div className="w-[60%] flex flex-col ">
          {dataChart?.map((item, index) => (
            <div key={index} className="flex items-center justify-center">
              <p className="w-[100%]" style={{ color: backgroundColor_list[index] }}>
                {item.DataName}
              </p>
              <RateBar percentage={item.DataPerc} color={backgroundColor_list[index]} title={item.DataName} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
export default DoughNut
