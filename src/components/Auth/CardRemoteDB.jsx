/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
function CardRemoteDB({ item, handleLogin }) {
  return (
    <div className="courses-container flex flex-1" onClick={() => handleLogin(item)}>
      <div className={`course flex-1 min-h-[225px]  ${item.RemoteDB}`}>
        <div className={`course-preview ${item.RemoteDB}`}>
          <h6>RemoteDB</h6>
          <h2>{item.RemoteDB}</h2>
          <h2>{item.NguoiLienHe}</h2>
        </div>
        <div className="course-info">
          <div className="progress-container">
            <span className="progress-text ">Mã kho: {item.MaKho || 'null'}</span>
          </div>
          <h6>{item.TenKho || 'Ten kho'}</h6>
          <h2>{item.RemoteDBDescription || 'Thông tin'}</h2>
          <h2>{item.TenDayDu || 'Tên đầy đủ'}</h2>
          <h2>{item.DienThoai || 'Điện thoại'}</h2>
          <h2>{item.DiaChi || 'Địa chỉ'}</h2>
        </div>
      </div>
    </div>
  )
}

export default CardRemoteDB
