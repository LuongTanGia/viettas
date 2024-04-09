/* eslint-disable react/prop-types */
import { Spin } from 'antd'
import CreateThuChi from './Action/CreateThuChi'
import EditThuChi from './Action/EditThuChi'
import ViewThuChi from './Action/ViewThuChi'
import PrintThuChi from './Action/PrintThuChi'
import DeleteThuChi from './Action/DeleteThuChi'

const ModalPCT = ({
  data,
  actionType,
  typePage,
  namePage,
  close,
  dataRecord,
  dataThongSo,
  dataHangMuc,
  dataDoiTuong,
  loading,
  setHightLight,
  controlDate,
  dataThongTinSua,
  isLoadingModal,
  isLoadingEdit,
}) => {
  return (
    <>
      <div className=" fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
        {actionType === 'delete' && <DeleteThuChi typePage={typePage} dataRecord={dataRecord} loading={loading} close={close} />}

        {actionType === 'print' && <PrintThuChi namePage={namePage} actionType={actionType} typePage={typePage} data={data} controlDate={controlDate} close={close} />}

        {actionType === 'view' && (
          <ViewThuChi namePage={namePage} actionType={actionType} typePage={typePage} data={data} dataThongSo={dataThongSo} dataRecord={dataRecord} close={close} />
        )}

        {actionType === 'create' && (
          <CreateThuChi
            namePage={namePage}
            actionType={actionType}
            typePage={typePage}
            data={data}
            dataDoiTuong={dataDoiTuong}
            dataThongSo={dataThongSo}
            dataHangMuc={dataHangMuc}
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
              <EditThuChi
                namePage={namePage}
                actionType={actionType}
                typePage={typePage}
                data={data}
                dataDoiTuong={dataDoiTuong}
                dataThongTinSua={dataThongTinSua}
                dataThongSo={dataThongSo}
                dataHangMuc={dataHangMuc}
                dataRecord={dataRecord}
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

export default ModalPCT
