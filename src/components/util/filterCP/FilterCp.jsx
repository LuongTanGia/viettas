/* eslint-disable react/prop-types */
import { Select, Tooltip } from 'antd'
import { useState } from 'react'
function FilterCp({ title1, title2, title3, option1, option2, option3, dataAPI, setDataAPI, title, title_DS }) {
  const [value, setValue] = useState(null)
  const [valueFrom, setValueFrom] = useState(null)
  const [valueTo, setValueTo] = useState(null)
  const [count, setCount] = useState(0)

  const options_1 = []
  const options_2 = []
  const options_3 = []

  for (let i = 0; i < option1.length; i++) {
    options_1.push(
      title !== 'DoiTuong'
        ? {
            value: title === 'DauVao' || title === 'DauRa' ? option1[i].split(' - ')[0] : option1[i].NhomHang,
            label: option1[i].NhomHang,
          }
        : { value: option1[i].Ma, label: ` ${option1[i].Ma} - ${option1[i].Ten} ` },
    )
  }

  for (let i = 0; i < option2.length; i++) {
    options_2.push(
      title !== 'DoiTuong'
        ? {
            value: title === 'DauVao' || title === 'DauRa' ? option2[i].split(' - ')[0] : option2[i].NhomHang,
            label: option2[i].NhomHang,
          }
        : { value: option2[i].Ma, label: ` ${option2[i].Ma} - ${option2[i].Ten} ` },
    )
  }
  for (let i = 0; i < option3.length; i++) {
    options_3.push({
      value: option3[i].Ma,
      label: option3[i].ThongTinNhomDoiTuong,
    })
  }
  const handleChange = () => {
    title_DS !== 'DoiTuong'
      ? setDataAPI({ ...dataAPI, CodeValue1List: `${typeof value === 'string' ? value : ''}`, CodeValue1From: valueFrom, CodeValue1To: valueTo })
      : setDataAPI({ ...dataAPI, CodeValue2List: `${typeof value === 'string' ? value : ''}`, CodeValue2From: valueFrom, CodeValue2To: valueTo })
  }
  const handleChangeValue = (value) => {
    setValue(`${value}`)
  }
  const handleChangeValueFrom = (value) => {
    setValueFrom(typeof value === 'string' ? `${value.split(' - ')[0]}` : null)
  }
  const handleChangeValueTo = (value) => {
    setValueTo(typeof value === 'string' ? `${value.split(' - ')[0]}` : null)
  }
  const handleChangeFromTo = () => {
    if (valueFrom !== null && valueTo !== null) {
      title_DS !== 'DoiTuong'
        ? setDataAPI({ ...dataAPI, CodeValue1List: `${typeof value === 'string' ? value : ''}`, CodeValue1From: valueFrom, CodeValue1To: valueTo })
        : setDataAPI({ ...dataAPI, CodeValue2List: `${typeof value === 'string' ? value : ''}`, CodeValue2From: valueFrom, CodeValue2To: valueTo })
    } else if (valueFrom === null && valueTo !== null && count === 0) {
      setCount(1)
      setValueFrom(valueTo)
      title_DS !== 'DoiTuong'
        ? setDataAPI({ ...dataAPI, CodeValue1List: `${typeof value === 'string' ? value : ''}`, CodeValue1From: valueTo, CodeValue1To: valueTo })
        : setDataAPI({ ...dataAPI, CodeValue2List: `${typeof value === 'string' ? value : ''}`, CodeValue2From: valueTo, CodeValue2To: valueTo })
    } else if (valueFrom !== null && valueTo === null && count === 0) {
      setCount(1)
      setValueTo(valueFrom)
      title_DS !== 'DoiTuong'
        ? setDataAPI({ ...dataAPI, CodeValue1List: `${typeof value === 'string' ? value : ''}`, CodeValue1From: valueFrom, CodeValue1To: valueFrom })
        : setDataAPI({ ...dataAPI, CodeValue2List: `${typeof value === 'string' ? value : ''}`, CodeValue2From: valueFrom, CodeValue2To: valueFrom })
    } else if (valueFrom === null && valueTo === null) {
      setCount(0)
      title_DS !== 'DoiTuong'
        ? setDataAPI({ ...dataAPI, CodeValue1List: `${typeof value === 'string' ? value : ''}`, CodeValue1From: '', CodeValue1To: '' })
        : setDataAPI({ ...dataAPI, CodeValue2List: `${typeof value === 'string' ? value : ''}`, CodeValue2From: '', CodeValue2To: '' })
    }
  }
  return (
    <div className="flex p-2 gap-1 items-center w-[80%]">
      <p>{title1}</p>
      <Select
        showSearch
        style={{
          width: '15%',
          minWidth: 100,
        }}
        allowClear
        size="small"
        value={valueFrom}
        onBlur={handleChangeFromTo}
        onChange={handleChangeValueFrom}
        placeholder={`Chọn ${title1}`}
        optionFilterProp="children"
        filterOption={(input, option) => (option?.label ?? '').includes(input)}
        filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
        options={options_1}
      />
      <p>{title2}</p>

      <Select
        showSearch
        style={{
          width: '15%',
          minWidth: 100,
        }}
        allowClear
        size="small"
        value={valueTo}
        onBlur={handleChangeFromTo}
        onChange={handleChangeValueTo}
        placeholder={`Chọn ${title1}`}
        optionFilterProp="children"
        filterOption={(input, option) => (option?.label ?? '').includes(input)}
        filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
        options={options_2}
      />
      <p>{title3}</p>

      <Select
        mode="multiple"
        showSearch
        size="small"
        style={{
          width: '70%',
        }}
        onBlur={handleChange}
        onChange={handleChangeValue}
        maxTagCount="responsive"
        allowClear
        placeholder={`${title3} nhiều`}
        optionFilterProp="children"
        filterOption={(input, option) => (option?.label ?? '').includes(input)}
        filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
        maxTagPlaceholder={(omittedValues) => (
          <Tooltip title={omittedValues?.map(({ label }) => label).join(', ')}>
            <span>+{omittedValues?.length}...</span>
          </Tooltip>
        )}
        options={options_3}
      />
    </div>
  )
}

export default FilterCp
