/* eslint-disable react/prop-types */
import DeleteDuLieu from './ActionDuLieu/DeleteDuLieu'
import PrintDuLieu from './ActionDuLieu/PrintDuLieu'
import ViewDuLieu from './ActionDuLieu/ViewDuLieu'
import CreateDuLieu from './ActionDuLieu/CreateDuLieu'
import EditDuLieu from './ActionDuLieu/EditDuLieu'
import { Spin } from 'antd'
const Modals = ({
  close,
  actionType,
  dataThongTin,
  dataThongTinSua,
  dataKhoHang,
  dataDoiTuong,
  dataRecord,
  data,
  controlDate,
  dataThongSo,
  loading,
  setHightLight,
  namePage,
  typePage,
  isLoadingModal,
  isLoadingEdit,
}) => {
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
        {(actionType === 'delete' || actionType === 'pay') && (
          <DeleteDuLieu actionType={actionType} typePage={typePage} dataRecord={dataRecord} setHightLight={setHightLight} loading={loading} close={close} />
        )}

        {(actionType === 'print' || actionType === 'printWareHouse') && (
          <PrintDuLieu actionType={actionType} typePage={typePage} namePage={namePage} data={data} controlDate={controlDate} close={close} />
        )}

        {actionType === 'view' && (
          <ViewDuLieu
            actionType={actionType}
            typePage={typePage}
            namePage={namePage}
            data={data}
            dataThongTin={dataThongTin}
            dataThongSo={dataThongSo}
            controlDate={controlDate}
            isLoadingModal={isLoadingModal}
            loading={loading}
            close={close}
          />
        )}

        {actionType === 'create' && (
          <CreateDuLieu
            actionType={actionType}
            typePage={typePage}
            namePage={namePage}
            data={data}
            dataThongSo={dataThongSo}
            dataDoiTuong={dataDoiTuong}
            dataKhoHang={dataKhoHang}
            controlDate={controlDate}
            isLoadingModal={isLoadingModal}
            loading={loading}
            setHightLight={setHightLight}
            close={close}
          />
        )}

        {actionType === 'edit' && (
          <>
            {isLoadingEdit ? (
              <Spin fullscreen />
            ) : (
              <EditDuLieu
                actionType={actionType}
                typePage={typePage}
                namePage={namePage}
                data={data}
                dataRecord={dataRecord}
                dataThongTinSua={dataThongTinSua}
                dataThongSo={dataThongSo}
                dataDoiTuong={dataDoiTuong}
                dataKhoHang={dataKhoHang}
                controlDate={controlDate}
                loading={loading}
                setHightLight={setHightLight}
                close={close}
              />
            )}
          </>
        )}
      </div>
    </>
  )
}

export default Modals
