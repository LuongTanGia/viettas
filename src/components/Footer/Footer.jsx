import logo from '../../assets/whitelogo_viettas.svg'
import BackGround from '../../assets/login_background.svg'

const Footer = () => {
  return (
    <div
      className="fixed-bottom bg-center bg-cover bg-no-repeat z-[5] px-[20px] "
      style={{
        backgroundImage: `url(${BackGround})`,
      }}
    >
      <div className="flex justify-start items-center py-1 gap-3">
        <img src={logo} alt="Công Ty Viettas" className="h-[40px] w-[100px]  object-fill min-h-[40px]" />

        <div className=" text-white">
          <p className="text-sm">Viettas SaiGon JSC</p>
          <p className="text-sm">ĐC: 351/9 Nơ Trang Long, P.13, Q.BT, Tp.HCM</p>
        </div>
      </div>
    </div>
  )
}

export default Footer
