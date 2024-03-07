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

import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import "@styles/react/libs/flatpickr/flatpickr.scss";

function StopProcessModal(props) {
  const { productionMachineMatchId, modalStateChange, modalState, productionId, machineId,toastData } = props;
  const CloseBtn = (
    <X
      className="cursor-pointer"
      onClick={() => modalStateChange(false)}
      size={15}
    />
  );

  const StopProcess = () => {
    let machineDataStop = {
      id: productionMachineMatchId,
      state: false,
      productionId: productionId,
      machineId: machineId,
      endDate: new Date()
    };

    axios.post(
      process.env.REACT_APP_API_ENDPOINT + "api/ProductionMachineMatch/Update",
      machineDataStop
    ).then(() => {
      toastData("İş Akışı Durduruldu",modalStateChange(false))
    })

  }
  return (
    <Modal
      size="sm"
      isOpen={modalState}
      className="modal-dialog-centered modal-sm"
      contentClassName="pt-0"
      toggle={() => modalStateChange(false)}
    >
      <ModalHeader className="mb-1" close={CloseBtn} tag="div">
        <h5 className="modal-title">
          İş Akışı Durdur
        </h5>
      </ModalHeader>


      <ModalBody style={{ textAlign: "center" }}>
        İş Akışını Duracak !

        <div className="text-center" style={{ marginTop: 10 }} >
          <Button className="me-1" color="primary" onClick={() => StopProcess()}>
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
      </ModalBody>
    </Modal>
  );
}

export default StopProcessModal;
