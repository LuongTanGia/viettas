import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import categoryAPI from "../../API/linkAPI";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { IoCartOutline } from "react-icons/io5";
import { LuFolderOutput, LuFolderInput } from "react-icons/lu";
import { MdPayment } from "react-icons/md";
import { BsCollectionFill } from "react-icons/bs";
import { CgInsights } from "react-icons/cg";
import { GiPayMoney } from "react-icons/gi";
import { AiFillMoneyCollect } from "react-icons/ai";
import { FaWarehouse } from "react-icons/fa";
import PieChart from "../../Charts/PieChart";

const TongHop = () => {
  const navigate = useNavigate();
  const [data, setData] = useState();
  const getTkn = localStorage.getItem("tokenAccess");
  const getTknRefresh = localStorage.getItem("rfTokenAccess");

  useEffect(() => {
    reloadTongHop();
  }, []);

  const reloadTongHop = async () => {
    try {
      const responseReload = await categoryAPI.TongHop(getTkn);
      if (responseReload.data && responseReload.data.DataError == "0") {
        setData(responseReload.data.DataResults);
      } else if (
        responseReload.data &&
        responseReload.data.DataError == "-108"
      ) {
        const responseRefresh = await categoryAPI.Refresh(getTknRefresh);
        if (responseRefresh.data && responseRefresh.data.DataError == "0") {
          const newToken = responseRefresh.data.TKN;
          categoryAPI.TongHop(newToken);
          const refreshedResponse = await categoryAPI.TongHop(newToken);
          setData(refreshedResponse.data.DataResults);
        } else if (
          responseRefresh.data &&
          responseRefresh.data.DataError == "-107"
        ) {
          navigate("/");
          localStorage.clear();
        }
      } else {
        // eslint-disable-next-line no-self-assign
        window.location.href = window.location.href;
        navigate("/");
        localStorage.clear();
      }
    } catch (error) {
      console.log(error);
      // eslint-disable-next-line no-self-assign
      window.location.href = window.location.href;
      navigate("/");
      localStorage.clear();
    }
  };
  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-US").format(number);
  };
  return (
    <div className="p-4 flex flex-col gap-2">
      <div className="uppercase text-xl font-extrabold text-zinc-700">
        Tổng Hợp
      </div>
      {data && data.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          <div className="grid grid-cols-2 gap-2">
            {/* Thu */}
            <div className="px-2 py-2 rounded-lg flex gap-2 shadow-custom">
              <div
                className="flex items-center justify-center text-lg bg-slate-200 px-6  rounded-full "
                title="Tiền phải thu"
              >
                <AiFillMoneyCollect className="w-16 h-16 text-blue-600 " />
              </div>
              <div className="flex flex-col gap-2 justify-center ">
                <div className="flex justify-center px-10">
                  <p className="text-lg uppercase font-semibold text-gray-500">
                    Tiền Phải Thu
                  </p>
                </div>
                {data.map((item, index) => (
                  <>
                    {item.DataCode.includes("PHAITHU_") ? (
                      <div
                        key={index}
                        className="text-xl flex gap-2 justify-center items-center text-blue-600 font-bold"
                      >
                        <p className="block truncate ">
                          {formatNumber(item.DataValue)}đ
                        </p>
                      </div>
                    ) : null}
                  </>
                ))}
              </div>
            </div>
            {/* Trả */}
            <div className="px-2 py-2 rounded-lg flex gap-2 shadow-custom">
              <div
                className="flex items-center justify-center text-lg bg-slate-200 px-6 rounded-full "
                title="Tiền phải trả"
              >
                <GiPayMoney className="w-16 h-16 text-red-600 " />
              </div>
              <div className="flex flex-col gap-2 justify-center ">
                <div className="flex justify-center px-10">
                  <p className="text-lg uppercase font-semibold text-gray-500">
                    Tiền Phải Trả
                  </p>
                </div>
                {data.map((item, index) => (
                  <>
                    {item.DataCode.includes("PHAITRA_") ? (
                      <div
                        key={index}
                        className="text-xl flex gap-2 justify-center items-center text-red-600 font-bold"
                      >
                        <p className="block truncate ">
                          {formatNumber(item.DataValue)}đ
                        </p>
                      </div>
                    ) : null}
                  </>
                ))}
              </div>
            </div>
            <div className="shadow-custom p-2 ">
              <div>
                <CgInsights />
                <p>Doanh Số</p>
              </div>
              {data.map((item, index) => (
                <div key={index}>
                  {item.DataCode.startsWith("DOANHSO_") && (
                    <div>
                      {item.DataName}:{item.DataValue}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="shadow-custom">
              <div>
                <FaWarehouse />
                <p>Tồn Kho</p>
              </div>
              {data.map((item, index) => (
                <div key={index}>
                  {item.DataCode.startsWith("TONKHO_") && (
                    <div>
                      {item.DataName}:{item.DataValue}
                    </div>
                  )}
                </div>
              ))}
              <div>
                <PieChart />
              </div>
            </div>
          </div>
          <div className="grid gap-2 grid-cols-2">
            {/* Chi tiền */}
            <div className="border-2 p-2 rounded-lg flex flex-col gap-2 shadow-custom">
              <div className="flex items-center justify-center gap-2 bg-slate-200">
                <div className="flex items-center" title="Chi tiền mặt ">
                  <MdPayment className="w-12 h-12 bg-white text-blue-600 rounded-full p-2" />
                </div>
                <div className="flex justify-center font-bold uppercase text-blue-600 ">
                  Chi tiền
                </div>
              </div>
              <div className="flex flex-col gap-1 justify-center ">
                {data.map((item, index) => (
                  <>
                    {item.DataCode.includes("CHI_") ? (
                      <div
                        key={index}
                        className="flex gap-2 justify-start items-center"
                      >
                        <p>{item.DataName}</p>
                        <p className="block truncate ">
                          {formatNumber(item.DataValue)}
                        </p>
                      </div>
                    ) : null}
                  </>
                ))}
              </div>
            </div>
            {/* Thu Tiền */}
            <div className="border-2 p-2 rounded-lg flex flex-col gap-2 shadow-custom">
              <div className="flex items-center justify-center gap-2 bg-slate-200">
                <div className="flex items-center" title="Chi tiền mặt ">
                  <BsCollectionFill className="w-12 h-12 bg-white text-red-600 rounded-full px-3" />
                </div>
                <div className="flex justify-center font-bold uppercase text-red-600 ">
                  Thu tiền
                </div>
              </div>
              <div className="flex flex-col gap-1 justify-center ">
                {data.map((item, index) => (
                  <>
                    {item.DataCode.startsWith("THU_") ? (
                      <div
                        key={index}
                        className="flex gap-2 justify-start items-center"
                      >
                        <p>{item.DataName}</p>
                        <p className="block truncate ">
                          {formatNumber(item.DataValue)}
                        </p>
                      </div>
                    ) : null}
                  </>
                ))}
              </div>
            </div>
            {/* Mua Hàng */}
            <div className="border-2 p-2 rounded-lg flex flex-col gap-2 shadow-custom">
              <div className="flex items-center justify-center gap-2 bg-slate-200">
                <div className="flex items-center" title="Chi tiền mặt ">
                  <IoCartOutline className="w-12 h-12 bg-white text-blue-600 rounded-full p-2" />
                </div>
                <div className="flex justify-center font-bold uppercase text-blue-600 ">
                  Mua hàng
                </div>
              </div>
              <div className="flex flex-col gap-1 justify-center ">
                {data.map((item, index) => (
                  <>
                    {item.DataCode.includes("MUAHANG_") ? (
                      <div
                        key={index}
                        className="flex gap-2 justify-start items-center"
                      >
                        <p>{item.DataName}</p>
                        <p className="block truncate ">
                          {formatNumber(item.DataValue)}
                        </p>
                      </div>
                    ) : null}
                  </>
                ))}
              </div>
            </div>
            {/* Xuất trả */}
            <div className="border-2 p-2 rounded-lg flex flex-col gap-2 shadow-custom">
              <div className="flex items-center justify-center gap-2 bg-slate-200">
                <div className="flex items-center" title="Chi tiền mặt ">
                  <LuFolderOutput className="w-12 h-12 bg-white text-red-600 rounded-full p-2.5" />
                </div>
                <div className="flex justify-center font-bold uppercase text-red-600 ">
                  Xuất trả
                </div>
              </div>
              <div className="flex flex-col gap-1 justify-center ">
                {data.map((item, index) => (
                  <>
                    {item.DataCode.includes("XUATTRA_") ? (
                      <div
                        key={index}
                        className="flex gap-2 justify-start items-center"
                      >
                        <p>{item.DataName}</p>
                        <p className="block truncate ">
                          {formatNumber(item.DataValue)}
                        </p>
                      </div>
                    ) : null}
                  </>
                ))}
              </div>
            </div>
            {/* Bán hàng */}
            <div className="border-2 p-2 rounded-lg flex flex-col gap-2 shadow-custom">
              <div className="flex items-center justify-center gap-2 bg-slate-200">
                <div className="flex items-center" title="Chi tiền mặt ">
                  <BiSolidPurchaseTag className="w-12 h-12 bg-white text-blue-600 rounded-full p-2" />
                </div>
                <div className="flex justify-center font-bold uppercase text-blue-600 ">
                  Bán hàng
                </div>
              </div>
              <div className="flex flex-col gap-1 justify-center ">
                {data.map((item, index) => (
                  <>
                    {item.DataCode.includes("BANHANG_") ? (
                      <div
                        key={index}
                        className="flex gap-2 justify-start items-center"
                      >
                        <p>{item.DataName}</p>
                        <p className="block truncate ">
                          {formatNumber(item.DataValue)}
                        </p>
                      </div>
                    ) : null}
                  </>
                ))}
              </div>
            </div>
            {/* Nhập trả */}
            <div className="border-2 p-2 rounded-lg flex flex-col gap-2 shadow-custom">
              <div className="flex items-center justify-center gap-2 bg-slate-200">
                <div className="flex items-center" title="Chi tiền mặt ">
                  <LuFolderInput className="w-12 h-12 bg-white text-blue-600 rounded-full p-2.5" />
                </div>
                <div className="flex justify-center font-bold uppercase text-blue-600 ">
                  Nhập trả
                </div>
              </div>
              <div className="flex flex-col gap-1 justify-center ">
                {data.map((item, index) => (
                  <>
                    {item.DataCode.includes("NHAPTRA_") ? (
                      <div
                        key={index}
                        className="flex gap-2 justify-start items-center"
                      >
                        <p>{item.DataName}</p>
                        <p className="block truncate ">
                          {formatNumber(item.DataValue)}
                        </p>
                      </div>
                    ) : null}
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Link to={"/login"}></Link>
      )}
    </div>
  );
};

export default TongHop;
