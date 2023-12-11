import { useSelector } from "react-redux";
import { dataTONGHOPSelector } from "../../redux/selector";
import Card from "../util/CardTT/Card";
import PieChart from "../util/Chart/PieChart";
import RateBar from "../util/Chart/LoadingChart";

function DashBoar() {
    const data = useSelector(dataTONGHOPSelector);
    console.log(data);
    if (data?.DataResults?.length === 0) {
        return <p>Dữ liệu trống, vui lòng kiểm tra lại.</p>;
    }
    const groupedData = {};

    data?.DataResults?.forEach((item) => {
        const key = item["DataCode"].split("_")[0];
        if (!groupedData[key]) {
            groupedData[key] = [];
        }
        groupedData[key].push(item);
    });
    const formatter = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    });
    const resultArrays = Object.values(groupedData);

    return (
        <>
            <div className="pagetitle">
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <a href="index.html">Home</a>
                        </li>
                        <li className="breadcrumb-item active">Dashboard</li>
                    </ol>
                </nav>
            </div>

            <section className="section dashboard">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="row gridMain">
                            {resultArrays?.map((resultArray, arrayIndex) => (
                                <Card
                                    resultArray={resultArray}
                                    formatter={formatter}
                                    icon={
                                        resultArray[0]?.DataCode.split("_")[0]
                                    }
                                    key={arrayIndex}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="col-lg-3">
                        <div className="card">
                            <div className="filter"></div>

                            <div className="card-body pb-0">
                                <h5 className="card-title">
                                    Budget Report <span>| This Month</span>
                                </h5>

                                <div
                                    id="budgetChart"
                                    style={{ minHeight: "400px" }}
                                    className="echart"
                                >
                                    <PieChart />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="card">
                            <div className="filter">
                                <a
                                    className="icon"
                                    href="#"
                                    data-bs-toggle="dropdown"
                                >
                                    <i className="bi bi-three-dots"></i>
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                    <li className="dropdown-header text-start">
                                        <h6>Filter</h6>
                                    </li>

                                    <li>
                                        <a className="dropdown-item" href="#">
                                            Today
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="#">
                                            This Month
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="#">
                                            This Year
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className="card-body pb-0">
                                <h5 className="card-title">
                                    Recent Activity <span>| Today</span>
                                </h5>

                                <div
                                    className="activity"
                                    style={{ minHeight: "200px" }}
                                >
                                    <RateBar
                                        percentage={85}
                                        color={
                                            "linear-gradient( 135deg, #81FFEF 10%, #F067B4 100%)"
                                        }
                                    />
                                    <RateBar
                                        percentage={75}
                                        color={
                                            "linear-gradient( 135deg, #C2FFD8 10%, #465EFB 100%)"
                                        }
                                    />
                                    <RateBar
                                        percentage={85}
                                        color={
                                            "linear-gradient( 135deg, #90F7EC 10%, #32CCBC 100%)"
                                        }
                                    />
                                    <RateBar
                                        percentage={65}
                                        color={
                                            "linear-gradient( 135deg, #F97794 10%, #623AA2 100%)"
                                        }
                                    />
                                    <RateBar
                                        percentage={85}
                                        color={
                                            " linear-gradient( 135deg, #FAD7A1 10%, #E96D71 100%)"
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default DashBoar;
