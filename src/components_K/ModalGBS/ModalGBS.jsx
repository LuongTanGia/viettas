/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

import ModalDieuChinh from '../ModalDieuChinh'

import DeleteGBS from './ActionGBS/DeleteGBS'
import PrintGBS from './ActionGBS/PrintGBS'
import ViewGBS from './ActionGBS/ViewGBS'
import CreateGBS from './ActionGBS/CreateGBS'
import EditGBS from './ActionGBS/EditGBS'

const ModalGBS = ({ data, actionType, typePage, namePage, close, dataRecord, dataThongSo, dataThongTin, dataHangHoa, loading, isLoadingModal, setHightLight }) => {
  const ngayHieuLuc = dayjs().format('YYYY-MM-DD')

  const [formAdjustPrice, setFormAdjustPrice] = useState({
    GiaTriTinh: 'OLDVALUE',
    ToanTu: '',
    LoaiGiaTri: 'TYLE',
    GiaTri: 0,
    HieuLucTu: ngayHieuLuc,
    DanhSachMa: [],
  })

  useEffect(() => {
    if (formAdjustPrice?.GiaTriTinh === 'OLDVALUE') {
      setFormAdjustPrice({ ...formAdjustPrice, ToanTu: '+' })
    } else {
      setFormAdjustPrice({ ...formAdjustPrice, ToanTu: '=' })
    }
  }, [formAdjustPrice.GiaTriTinh])

  return (
    <>
      <div className=" fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
        {actionType === 'delete' && <DeleteGBS dataRecord={dataRecord} loading={loading} close={close} />}

        {actionType === 'print' && <PrintGBS namePage={namePage} data={data} close={close} />}

        {actionType === 'view' && (
          <ViewGBS namePage={namePage} data={data} dataThongTin={dataThongTin} dataThongSo={dataThongSo} isLoadingModal={isLoadingModal} loading={loading} close={close} />
        )}

        {(actionType === 'create' || actionType === 'clone') && (
          <CreateGBS
            actionType={actionType}
            typePage={typePage}
            namePage={namePage}
            dataThongTin={dataThongTin}
            dataHangHoa={dataHangHoa}
            dataThongSo={dataThongSo}
            setHightLight={setHightLight}
            isLoadingModal={isLoadingModal}
            loading={loading}
            close={close}
          />
        )}

        {actionType === 'edit' && (
          <EditGBS
            actionType={actionType}
            typePage={typePage}
            namePage={namePage}
            dataThongTin={dataThongTin}
            dataHangHoa={dataHangHoa}
            dataThongSo={dataThongSo}
            setHightLight={setHightLight}
            isLoadingModal={isLoadingModal}
            loading={loading}
            close={close}
          />
        )}

        {actionType === 'adjustPrice' && (
          <ModalDieuChinh dataThongSo={dataThongSo} namePage={namePage} typePage={typePage} dataRecord={dataRecord} setHightLight={setHightLight} close={close} />
        )}
      </div>
    </>
  )
}

export default ModalGBS
