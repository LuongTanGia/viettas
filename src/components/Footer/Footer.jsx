import logo from '../../assets/whitelogo_viettas.svg'
import BackGround from '../..//assets/login_background.svg'

const Footer = () => {
  return (
    <div
      className="fixed-bottom bg-center bg-cover bg-no-repeat z-[5] "
      style={{
        backgroundImage: `url(${BackGround})`,
      }}
    >
      <div className="flex  px-8 py-1">
        <img src={logo} alt="Công Ty Viettas" className="h-[40px] w-[100px] mr-16 object-fill" />

        <div className="text-sm text-white">
          <p className="text-sm">Viettas SaiGon JSC</p>
          <p>ĐC: 351/9 Nơ Trang Long P.13 Q.Bình Thạnh TPHCM</p>
        </div>
      </div>
    </div>
    // <footer className="flex bg-white fixed-bottom d-flex align-items-center z-[5] ">
    //   <div className="w-[229px]  bg-white flex justify-center ">
    //     <img src={logo} alt="" className=" w-[100px]  " />
    //   </div>
    //   <div className="w-full bg-blue-500 text-white pl-3 text-sm">
    //     <div>Viettas SaiGon JSC</div>
    //     <div>ĐC: 351/9 Nơ Trang Long, Phường 13, Quận Bình Thạnh, Thành phố Hồ Chí Minh</div>
    //   </div>
    // </footer>
  )
}

export default Footer
