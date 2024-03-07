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
import ShiftTarget from "./ShiftTarget.js";

function DetailModal(props) {
  const [data, setData] = useState([]);
  const [ShiftTargetId, setShiftTargetId] = useState();
  const { modalDetailId, modalStateChange, modalState, productionId, machineId,lineId} = props;


  const CloseBtn = (
    <X
      className="cursor-pointer"
      onClick={() => modalStateChange(false)}
      size={15}
    />
  );
  useEffect(() => {
    apiController(modalDetailId);
  }, [modalDetailId, modalState]);

  const apiController = (address) => {

    if (address != 0) {
      let endPoint = "";
      if (address === 1) {
        endPoint =
          "api/ProductionOperationsTimeLog/GetAllMachine?productionId=" +

          productionId + "&machineId=" + machineId;
      } else if (address === 2) {
        endPoint =
          "api/ProductionOperations/GetSetupVerificationDChange?productionId=" +
          productionId + "&machineId=" + machineId;;


      } else if (address == 3) {
        endPoint =
          "api/ProductionOperations/GetAllAsyncStateProductionId?id=" +
          productionId + "&machineId=" + machineId;
      }
      axios
        .get(process.env.REACT_APP_API_ENDPOINT + endPoint)
        .then((response) => {
          setData(response.data.data);
        });
    }
  };
  return (
    <Modal
      size="lg"
      style={{ maxWidth: modalDetailId==4 ? "600px":"80%", width: "100%" }}
      isOpen={modalState}
      className="modal-dialog-centered modal-lg"
      contentClassName="pt-0"
      toggle={() => modalStateChange(false)}
    >
      <ModalHeader className="mb-1" close={CloseBtn} tag="div">
        <h5 className="modal-title">
          {modalDetailId === 1
            ? "Süre Sınırı Aşılanlar"
            : modalDetailId === 2
              ? "Değişen Feederlar"
              : modalDetailId === 3 ?   "Tamamlanmayan Feederlar" : !ShiftTargetId ?  "Vardiya Başlat":"Vardiya Bitir"}
        </h5>
      </ModalHeader>


      <ModalBody style={{ textAlign: "center" }}>
        {
          modalDetailId == 4 ? <ShiftTarget modalStateChange={modalStateChange} lineId={lineId}  ShiftTarget={(value)=>setShiftTargetId(value)}/> :
            data.length > 0 ? (modalDetailId === 1 ? (<Table>
              <thead>
                <tr>

                  <th>QRCODE </th>
                  <th>BAŞLANGIÇ</th>
                  <th>BİTİŞ</th>
                  <th>MESAJ </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td>{item?.productionOperationsQrCode}</td>
                      <td>{item.lastTime}</td>
                      <td>{item.currentTime}</td>
                      <td>{item.message}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>) : modalDetailId === 2 ? (<Table>
              <thead>
                <tr>
                  {/* <th>newBomKitCode</th> */}
                  <th>Tarih</th>
                  <th> qr Kodu </th>
                  {/* <th>oldBomKitCode</th> */}
                  <th>Eski Feeder</th>
                  <th>Eski Feeder Miktar</th>
                  <th>Yeni Feeder</th>
                  <th>Yeni Feeder Miktar</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, i) => {
                  return (
                    <tr key={i}>

                      <th> {new Date(item.createDate).toLocaleDateString() + " " + new Date(item.createDate).toLocaleTimeString()} </th>
                      <td>{item.newPanelCode}</td>


                      <td>{item.oldBomKitCode}</td>
                      <td>{item?.oldPanelQty}</td>
                      <td>{item?.newBomKitCode}</td>

                      <td>{item?.newPanelQty}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>) : (<Table>
              <thead>
                <tr>
                  <th>BOMKITID</th>
                  <th>MALZEME </th>
                  <th>PARTI NUMARASI</th>
                  <th>SET NUMARASI </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td>{item?.bomKitInfoId}</td>
                      <td>{item.material}</td>
                      <td>{item.partyNumber}</td>
                      <td>{item.setNo}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>)) : <span style={{ textAlign: "center" }}>Veri Kaydı Bulanamadı</span>
        }



      </ModalBody>
    </Modal>
  );
}

export default DetailModal;
