/* eslint-disable react/prop-types */

import ModalImport from '../ModalImport'
import ViewThietLap from './ActionThietLap/ViewThietLap'
import CreateThietLap from './ActionThietLap/CreateThietLap'
import DeleteThietLap from './ActionThietLap/DeleteThietLap'
import EditThietLap from './ActionThietLap/EditThietLap'
import DeleteListThietLap from './ActionThietLap/DeleteListThietLap'
import PrintThietLap from './ActionThietLap/PrintThietLap'
import AdjustPriceThietLap from './ActionThietLap/AdjustPriceThietLap'

const ModalTL = ({
  actionType,
  typePage,
  namePage,
  close,
  dataRecord,
  dataThongSo,
  dataHangHoa,
  dataDoiTuong,
  dataNhomGia,
  isLoadingModal,
  loading,
  formDEL,
  setHightLight,
  dataMaHang,
}) => {
  //////////////////////////////////////////////

  return (
    <>
      <div className=" fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
        <div className="p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
          {actionType === 'delete' && <DeleteThietLap typePage={typePage} dataRecord={dataRecord} loading={loading} close={close} />}

          {actionType === 'deleteds' && <DeleteListThietLap formDEL={formDEL} loading={loading} close={close} />}

          {actionType === 'print' && <PrintThietLap namePage={namePage} dataNhomGia={dataNhomGia} dataHangHoa={dataHangHoa} close={close} />}

          {actionType === 'adjustPrice' && <AdjustPriceThietLap namePage={namePage} dataMaHang={dataMaHang} dataThongSo={dataThongSo} loading={loading} close={close} />}

          {actionType === 'view' && <ViewThietLap typePage={typePage} namePage={namePage} dataRecord={dataRecord} dataThongSo={dataThongSo} close={close} />}

          {actionType === 'create' && (
            <CreateThietLap
              typePage={typePage}
              namePage={namePage}
              dataRecord={dataRecord}
              dataThongSo={dataThongSo}
              dataHangHoa={dataHangHoa}
              dataNhomGia={dataNhomGia}
              dataDoiTuong={dataDoiTuong}
              setHightLight={setHightLight}
              isLoadingModal={isLoadingModal}
              loading={loading}
              close={close}
            />
          )}
          {actionType === 'edit' && (
            <EditThietLap
              typePage={typePage}
              namePage={namePage}
              dataRecord={dataRecord}
              dataThongSo={dataThongSo}
              dataNhomGia={dataNhomGia}
              setHightLight={setHightLight}
              isLoadingModal={isLoadingModal}
              loading={loading}
              close={close}
            />
          )}
        </div>
      </div>

      {actionType === 'import' && <ModalImport typePage={typePage} namePage={namePage} dataHangHoa={dataHangHoa} loading={loading} close={close} />}
    </>
  )
}

export default ModalTL
