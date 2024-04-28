import React, { useState } from "react";
import {
  Table,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";

import {  X
} from "react-feather";
import Select from "react-select";


import "@styles/react/libs/flatpickr/flatpickr.scss";
import { selectThemeColors } from "@utils";

function DetailModal(props) {
  const { modalDetailRow, modalStateChange, modalState ,modalRowFunc} = props;

  const [lineDetail, setLineDetail] = useState({ value:2, label: 'Eksik Malzeme' })
  const [lineData, setLineData] = useState([
    { id: 2, name: "Eksik Malzeme" },
    { id: 3, name: "Üretim Sahasında" },
  ]);
  
  const CloseBtn = (
    <X
      className="cursor-pointer"
      onClick={() => modalStateChange(false)}
      size={15}
    />
  );

  return (
    <Modal
  
      isOpen={modalState}
      className="modal-dialog-centered modal-lg"
      contentClassName="pt-0"
      toggle={() => modalStateChange(false)}
    >
      <ModalHeader className="mb-1" close={CloseBtn} tag="div">
        <h5 className="modal-title">
        {modalDetailRow?.material}+{modalDetailRow?.partyNumber} Depo:{modalDetailRow?.soureProductPlace} 
        </h5>
      </ModalHeader>


      <ModalBody style={{textAlign:"center"}}>
    
      <Row>

   <div className="mb-1">


<Select
    isClearable={false}
    className='react-select'
    classNamePrefix='select'
    options=	  {  lineData.map((option) => (
      { value: option.id, label: option.name }
    ))}
    theme={selectThemeColors}
    defaultValue={lineDetail}
    value={lineDetail}
    onChange={(event) => setLineDetail({ value: event.value, label: event.label })} 
  />
</div> 
        </Row>  

      </ModalBody>
      <div className="text-center">
              <Button className="me-1" color="primary" onClick={()=>modalRowFunc(modalDetailRow,lineDetail.value)}>
                Onay
              </Button>
              <Button
                color="secondary"
                outline
                onClick={() => modalStateChange(false)}
              >
                İptal
              </Button>
            </div>
    </Modal>
  );
}

export default DetailModal;
