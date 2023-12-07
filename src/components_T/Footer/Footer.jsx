import logo from "/icons/whitelogo_viettas.svg";
import BackGround from "/icons/login_background.svg";
const Footer = () => {
  return (
    <div
      className="bg-center bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url(${BackGround})`,
      }}
    >
      <div className="flex gap-16 items-center px-8 py-1">
        <div>
          <img src={logo} alt="Công Ty Viettas" className="w-[100px]" />
        </div>
        <div className="text-xs text-white">
          <p className="text-sm">Viettas SaiGon JSC</p>
          <p>ĐC: 351/9 Nơ Trang Long P.13 Q.Bình Thạnh TPHCM</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
