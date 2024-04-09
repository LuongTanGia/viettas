/* eslint-disable react/prop-types */

import CreateSDV from './Action/CreateSDV'
import EditSDV from './Action/EditSDV'
import ViewSDV from './Action/ViewSDV'
import DeleteSDV from './Action/DeleteSDV'
import { Spin } from 'antd'

const ModalSDV = ({ actionType, typePage, namePage, close, dataRecord, dataThongSo, dataDoiTuong, loading, setHightLight, dataThongTinSua, isLoadingModal, isLoadingEdit }) => {
  return (
    <>
      <div className=" fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
        {actionType === 'delete' && <DeleteSDV dataRecord={dataRecord} typePage={typePage} loading={loading} close={close} />}
        {actionType === 'view' && <ViewSDV namePage={namePage} dataThongSo={dataDoiTuong} dataRecord={dataRecord} typePage={typePage} close={close} />}
        {actionType === 'create' && (
          <CreateSDV
            namePage={namePage}
            isLoadingModal={isLoadingModal}
            dataDoiTuong={dataDoiTuong}
            dataThongSo={dataThongSo}
            typePage={typePage}
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
              <EditSDV
                namePage={namePage}
                dataDoiTuong={dataDoiTuong}
                dataThongSo={dataThongSo}
                dataRecord={dataRecord}
                dataThongTinSua={dataThongTinSua}
                typePage={typePage}
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

export default ModalSDV
