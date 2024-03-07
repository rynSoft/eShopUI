import BarcodeReader from "react-barcode-reader";
import React, { useState, useEffect, Fragment } from "react";
import { Table, Row, Col, ButtonGroup, Button, Nav } from "reactstrap";
import axios from "axios";
import TimerCalculate from "../TimerCalculate/TimerCalculate.js";
import { Check, CheckCircle, Printer, XOctagon } from "react-feather";

import ExportPdf from "../../../@core/components/gridTable/ExportPdf/exportPdf.js";
import DetailModal from "./DetailModal.js";
import { useSelector, useDispatch } from "react-redux";
import { workingActive, workingPassive } from "../../../redux/refreshData";
import toastData from "../../../@core/components/toastData/index.js";
import ExportExcel from "../../../@core/components/gridTable/ExportExcel/index.js";

function Verification(props) {
  const newWorking = useDispatch();
  const userWorkingList = useSelector((state) => state.refreshData.workingList);
  useEffect(() => {
    let processWorking = userWorkingList.filter(
      (x) =>
        x.productionId == props.match.params.id && x.productionProcess === 3
    );
    if (processWorking.length > 0) {
      axios
        .get(
          process.env.REACT_APP_API_ENDPOINT +
          "api/Account/UpdateTaskAsync?Id=" +
          processWorking[0].id
        )
        .then((response) => {
          newWorking(workingActive());
        });
    }
  }, [userWorkingList]);


  const readerStateFunction = (stateValue) => {
    setReaderState(stateValue);
  };

  const [rowData, setRowData] = React.useState();
  const [modalState, modalStateChange] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [finishData, setFinishData] = React.useState(false);
  const [tableState, setTableState] = React.useState(false);
  const [readerState, setReaderState] = React.useState(false);
  const [lastReadData, setlastReadData] = React.useState("");

  const [id, setId] = useState(props.match.params.id);

  const handleError = (error) => {
    console.log("Error " + error);
  };

  useEffect(() => {
    loadData();
  }, []);

  const rowBarcodController = (e, isKitValue) => {
    const newState = data.map((obj) => {
      if (obj.id === e.id && obj.isKitPreperated === 0) {
        return {
          id: obj.id,
          material: obj.material,
          explanation: obj.explanation,
          partyNumber: obj.partyNumber,
          quantity: obj.quantity,
          description: obj.description,
          unit: obj.unit,
          soureProductPlace: obj.soureProductPlace,
          isKitPreperated: isKitValue,
          isKitProvided: obj.isKitProvided,
        };
      }
      return obj;
    });

    e.isKitPreperated = isKitValue;
    toastData(e.material + " - " + e.partyNumber + " Başarıyla Okutuldu", true);
    updateKitInfo(e);
    setData(newState);

    const kitPreperatedController = newState.find((obj) => obj.isKitPreperated === 0);
    if (kitPreperatedController === undefined) {
      toastData("Tüm Barkodlar Okutuldu", true);
      setFinishData(true);
    }
    modalStateChange(false);
  };
  const buttonRowUpdate = (e) => {
    if (readerState) {
      setRowData(e);
      modalStateChange(true)
    }
    else {
      toastData("Barkod Okutmadan İş Akışını Başlatınız!", false);
    }
  };

  const loadData = () => {
    axios
      .get(
        process.env.REACT_APP_API_ENDPOINT +
        "api/BomKitInfo/GetAllAsyncProductId?id=" +
        id
      )
      .then((response) => {
        setData(response.data);
        const kitPreperatedController = response.data.find(
          (obj) => obj.isKitPreperated === 0
        );
        if (kitPreperatedController === undefined) {
          setFinishData(true);
        }
      });
  };

  const updateKitInfo = (arg) => {
    axios.put(
      process.env.REACT_APP_API_ENDPOINT + "api/BomKitInfo/Update",
      arg
    );
  };

  const StartedProductionLog = (arg) => {
    axios.put(
      process.env.REACT_APP_API_ENDPOINT + "api/ProductionLog/Add",
      arg
    );
  };

  const tableStateChange = () => {
    setTableState(true);
  };

  const PauseLog = (arg) => {
    axios.put(
      process.env.REACT_APP_API_ENDPOINT + "api/BomKitInfo/Update",
      arg
    );
  };

  const ResumeLog = (arg) => {
    axios.put(
      process.env.REACT_APP_API_ENDPOINT + "api/BomKitInfo/Update",
      arg
    );
  };

  const updateState = (e) => {
    if (readerState) {
      const firsCode = data.find(
        (obj) =>
          obj.material + "+" + obj.partyNumber === e && obj.isKitPreperated === 0
      );

      if (firsCode === undefined) {
        toastData("Malzeme Bulunamadı", false);
      }

      if (firsCode != undefined) {
        rowBarcodController(firsCode, 1)
      }
    } else {
      toastData("Barkod Okutmadan İş Akışını Başlatınız!", false);
    }
  };

  return (
    <>
      <DetailModal modalState={modalState} modalStateChange={modalStateChange} modalDetailRow={rowData} modalRowFunc={rowBarcodController} />
      <Row>
        <Col xl="12" md="12" xs="12" style={{ minHeight: 100 }}>

          <TimerCalculate
            finishController={finishData}
            tableController={tableStateChange}
            cols={{ xl: "12", sm: "12", xs: "12" }}
            PproductionProcess={3}
            screenName="Kit Doğrulama"
            readerStateFunction={readerStateFunction}
          />
        </Col>
        <BarcodeReader
          onError={handleError}
          onScan={(err, result) => {
            updateState(err.replace("*", "-").replace("*", "-"));
          }}
        />
      </Row>

      <Row>      {tableState ? (
        <Table responsive style={{ marginTop: 10 }} size="sm">
          <thead>
            <tr>
              <th>Malzeme</th>
              <th>Parti Numarası</th>
              <th>Açıklama</th>

              <th>Miktar</th>
              <th>Birim</th>
              <th>Not</th>

              <th style={{ textAlign: "right" }}>
                <Button.Ripple
                  outline
                  className="btn-icon rounded-circle pull-right"
                  color="danger"
                  onClick={() => {
                    ExportPdf(data, "UrunHazırlamaRaporu", "DEPO ÜRÜN HAZIRLAMA RAPORU-KİT DOĞRULAMA");
                  }}
                >
                  <Printer size={12} />
                </Button.Ripple>

                <Button.Ripple

                  outline
                  className="btn-icon rounded-circle pull-right"
                  color="success"
                  style={{ marginLeft: 5 }}
                  onClick={() => {
                    ExportExcel(data, "UrunHazırlamaRaporu", "KİT DOĞRULAMA");
                  }}
                >
                   <Printer size={12} />
                </Button.Ripple>
              </th>

            </tr>
          </thead>
          <tbody>
            {data.map((obj) =>
              obj.isKitPreperated === 1 ? (
                <tr
                  style={{ backgroundColor: "green" }}
                  key={`${obj.id}`}
                >
                  <td style={{ color: "white" }}>{obj.material}</td>
                  <td style={{ color: "white" }}>{obj.partyNumber}</td>
                  <td style={{ color: "white" }}>{obj.explanation}</td>

                  <td style={{ color: "white" }}>{obj.quantity}</td>
                  <td style={{ color: "white" }}>{obj.unit}</td>
                  <td style={{ color: "white" }}>{obj.description}</td>

                  <td></td>
                </tr>
              ) : obj.isKitPreperated === 2 ? (
                <tr
                  style={{ backgroundColor: "#FFEA00" }}
                  key={`${obj.id}`}
                >
                  <td style={{ color: "black" }}>{obj.material}</td>
                  <td style={{ color: "black" }}>{obj.partyNumber}</td>
                  <td style={{ color: "black" }}>{obj.explanation}</td>

                  <td style={{ color: "black" }}>{obj.quantity}</td>
                  <td style={{ color: "black" }}>{obj.unit}</td>
                  <td style={{ color: "black" }}>{obj.description}</td>

                  <td></td>
                </tr>
              ) :



                (
                  <tr
                    style={{ backgroundColor: obj.isKitProvided == 2 ? "#FFEA00" : obj.isKitProvided == 3 ? "#11599d" : "transparent", color: "black" }}
                    key={`${obj.id}`}
                  >
                    <td style={{ color: obj.isKitProvided == 2 ? "black" : obj.isKitProvided == 3 ? "white" : null }}>{obj.material}</td>
                    <td style={{ color: obj.isKitProvided == 2 ? "black" : obj.isKitProvided == 3 ? "white" : null }}>{obj.partyNumber}</td>
                    <td style={{ color: obj.isKitProvided == 2 ? "black" : obj.isKitProvided == 3 ? "white" : null }}>{obj.explanation}</td>

                    <td style={{ color: obj.isKitProvided == 2 ? "black" : obj.isKitProvided == 3 ? "white" : null }}>{obj.quantity}</td>
                    <td style={{ color: obj.isKitProvided == 2 ? "black" : obj.isKitProvided == 3 ? "white" : null }}>{obj.unit}</td>
                    <td></td>
                    <td style={{ textAlign: "right" }}>

                      {obj.isKitProvided == 2 ? <Button.Ripple

                        className="btn-icon pull-right"
                        color="secondary"
                        onClick={() => {
                          buttonRowUpdate(obj);
                        }}
                      >
                        <CheckCircle size={12} />
                      </Button.Ripple> : null}

                    </td>
                  </tr>
                )
            )}
          </tbody>
        </Table>
      ) : null}</Row>

    </>
  );
}

export default Verification;
