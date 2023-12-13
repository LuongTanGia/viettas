import logo from "../../assets/bluelogo_viettas.svg";

const Footer = () => {
    return (
        <footer className="flex bg-white fixed-bottom d-flex align-items-center z-0">
            <div className="w-[229px]  bg-white flex justify-center ">
                <img src={logo} alt="" className=" w-[100px]  " />
            </div>
            <div className="w-full bg-blue-500 text-white pl-3 text-sm">
                <div>Viettas SaiGon JSC</div>
                <div>
                    ĐC: 351/9 Nơ Trang Long, Phường 13, Quận Bình Thạnh, Thành
                    phố Hồ Chí Minh
                </div>
            </div>
        </footer>
    );
};

export default Footer;
