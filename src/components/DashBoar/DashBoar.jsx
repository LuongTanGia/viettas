import { useSelector } from 'react-redux'
import { dataTONGHOPSelector } from '../../redux/selector'
import Card from '../util/CardTT/Card'
import PieChart from '../util/Chart/PieChart'
import DateTimeClock from '../util/testComponents/DateTime'

function DashBoar() {
  const data = useSelector(dataTONGHOPSelector)
  if (data?.DataResults?.length === 0) {
    return <p>Dữ liệu trống, vui lòng kiểm tra lại.</p>
  }
  const groupedData = {}

  data?.DataResults?.forEach((item) => {
    const key = item['DataCode'].split('_')[0]
    if (!groupedData[key]) {
      groupedData[key] = []
    }
    groupedData[key].push(item)
  })
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
  })
  const resultArrays = Object.values(groupedData)

  return (
    <>
      {/* <div className="pagetitle">
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <a href="index.html">Home</a>
                        </li>
                        <li className="breadcrumb-item active">Dashboard</li>
                    </ol>
                </nav>
            </div> */}

      <section className="section dashboard">
        <div className="row">
          <div className="col-lg-6">
            <div className="">
              <div className="card h-[140px] bgDash bg-transparent">
                <DateTimeClock />
              </div>
            </div>
            <div className="card">
              <div className="filter"></div>
              <div className="card-body pb-0">
                <h5 className="card-title">Doanh Số Hàng Hóa</h5>
                <PieChart />
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="row gridMain">
              {resultArrays?.map((resultArray, arrayIndex) => (
                <Card resultArray={resultArray} formatter={formatter} icon={resultArray[0]?.DataCode.split('_')[0]} key={arrayIndex} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default DashBoar
