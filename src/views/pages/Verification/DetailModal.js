import BarcodeReader from "react-barcode-reader";
import React, { useState, useEffect, Fragment, useContext } from "react";
import {
  Table,
  Row,
  Col,
  ButtonGroup,
  Button,
  Nav,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import axios from "axios";
import TimerCalculate from "../TimerCalculate/TimerCalculate.js";
import {
  AlignJustify,
  Check,
  CheckCircle,
  ChevronDown,
  Cloud,
  CloudLightning,
  CloudOff,
  Printer,
  X,
  XOctagon,
} from "react-feather";
import Select from "react-select";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { selectThemeColors } from "@utils";
function DetailModal(props) {
  const { modalDetailRow, modalStateChange, modalState ,modalRowFunc} = props;

  const [lineDetail, setLineDetail] = useState({ value:2, label: 'Eksik Malzeme' })
  const [lineData, setLineData] = useState([
    { id: 2, name: "Eksik Malzeme" },

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
      size="lg"
      style={{ maxWidth: "80%", width: "100%" }}
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
