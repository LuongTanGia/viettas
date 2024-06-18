/* eslint-disable react/prop-types */
// eslint-disable-next-line react/prop-types
function Card({ resultArray, formatter, icon }) {
  const iconMapping = {
    DOANHSO: 'bi bi-bar-chart-line-fill blue',
    TONKHO: 'fa-solid fa-cart-flatbed blue',
    PHAITHU: 'fa-solid fa-hand-holding-dollar blue',
    PHAITRA: 'fa-solid fa-file-invoice blue',
    MUAHANG: 'fa-solid fa-cart-plus blue',
    XUATTRA: 'fa-solid fa-cart-arrow-down red',
    BANHANG: 'fa-solid fa-cart-shopping blue',
    NHAPTRA: 'fa-solid fa-cart-shopping red',
    THU: 'fa-solid fa-dollar-sign blue',
    CHI: 'fa-solid fa-dollar-sign red',
    QUYTIENMAT: 'fa-solid fa-dollar-sign red',
  }

  const nameMapping = {
    DOANHSO: 'Doanh Số',
    TONKHO: 'Tồn Kho',
    PHAITHU: 'Phải Thu',
    PHAITRA: 'Phải Trả',
    MUAHANG: 'Mua Hàng',
    XUATTRA: 'Xuất Trả Nhà Cung Cấp',
    BANHANG: 'Bán Hàng',
    NHAPTRA: 'Hàng Bán Trở Lại',
    THU: 'Thu Tiền',
    CHI: 'Chi Tiền',
    QUYTIENMAT: 'Quỹ Tiền Mặt',
  }
  return (
    <div
      className={`col-xxl-4 col-md-12 ${
        // eslint-disable-next-line react/prop-types
        resultArray[0]?.DataCode.split('_')[0]
      }`}
    >
      <div className="card info-card sales-card">
        <div className="card-body">
          <h5 className="card-title">
            {
              // eslint-disable-next-line react/prop-types
              nameMapping[resultArray[0]?.DataCode.split('_')[0]]
            }
            <i className={iconMapping[icon] || 'fa-solid fa-link'}></i>
          </h5>

          <div className="d-flex align-items-center">
            <div className="ps-3">
              {resultArray.map((item, itemIndex) => (
                <p className="textArray" key={itemIndex}>
                  <span>{item.DataName}:</span>
                  <span className={`small pt-1 fw-bold ${item.DataValue < 0 ? 'text-red-600 text-sm' : item.DataValue === 0 ? 'text-gray-300' : 'text-success'}`}>
                    {item.DataName === 'Số tiền' || item.DataName === 'Số Tiền' ? formatter.format(item.DataValue) : item.DataValue}
                  </span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card
