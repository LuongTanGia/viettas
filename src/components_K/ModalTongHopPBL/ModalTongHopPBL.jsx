/* eslint-disable react/prop-types */
import ViewTongHopPBL from './ActionTongHopPBL/ViewTongHopPBL'
import DeleteTongHopPBL from './ActionTongHopPBL/DeleteTongHopPBL'
import SyntheticsTongHopPBL from './ActionTongHopPBL/SyntheticsTongHopPBL'

const ModalTongHopPBL = ({ actionType, typePage, namePage, close, dataRecord, dataThongSo, loading, formSynthetics }) => {
  return (
    <>
      <div className=" fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
        {actionType === 'view' && <ViewTongHopPBL typePage={typePage} namePage={namePage} dataRecord={dataRecord} dataThongSo={dataThongSo} loading={loading} close={close} />}

        {actionType === 'delete' && <DeleteTongHopPBL typePage={typePage} dataRecord={dataRecord} loading={loading} close={close} />}

        {actionType === 'synthetics' && <SyntheticsTongHopPBL formSynthetics={formSynthetics} loading={loading} close={close} />}
      </div>
    </>
  )
}

export default ModalTongHopPBL
