import { useState } from "react";

import "./test.css";

const MyComponent = () => {
    // State chứa mảng dữ liệu đối tượng
    const [dataList, setDataList] = useState([]);

    const handleItemChange = (index, property, newValue) => {
        const newDataList = [...dataList];
        newDataList[index][property] = newValue;
        setDataList(newDataList);
    };

    return (
        <div>
            <div className="mainTest">
                {dataList.map((item, index) => (
                    <div key={index} className="testCp">
                        <select
                            value={item.Ma}
                            onChange={(e) =>
                                handleItemChange(index, "Ma", e.target.value)
                            }
                        >
                            <option value="Item 1">Item 1</option>
                            <option value="Item 2">Item 2</option>
                            <option value="Item 3">Item 3</option>
                        </select>
                        <input
                            type="number"
                            value={item.SoLuong}
                            onChange={(e) =>
                                handleItemChange(
                                    index,
                                    "SoLuong",
                                    parseInt(e.target.value, 10)
                                )
                            }
                        />
                    </div>
                ))}
            </div>
            <button
                onClick={() =>
                    setDataList([...dataList, { Ma: "", SoLuong: 1 }])
                }
            >
                Thêm
            </button>
            <p>DataList: {JSON.stringify(dataList)}</p>
        </div>
    );
};

export default MyComponent;
