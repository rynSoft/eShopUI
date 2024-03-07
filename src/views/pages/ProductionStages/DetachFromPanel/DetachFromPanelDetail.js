import BarcodeReader from "react-barcode-reader";
import React, { useState, useEffect, Fragment } from "react";
import {
  Table,
  Row,
  Col,
  ButtonGroup,
  Button,
  Nav,
  UncontrolledTooltip,
} from "reactstrap";
import axios from "axios";
import TimerCalculate from "../../TimerCalculate/TimerCalculate.js";
import {
  Check,
  CheckCircle,
  CheckSquare,
  Printer,
  XOctagon,
} from "react-feather";

import { toast, Slide } from "react-toastify";
import Avatar from "@components/avatar";
import toastData from "../../../../@core/components/toastData/index.js";

function DetachFromPanelDetail(props) {
  const [readerState, setReaderState] = React.useState(false);
  const readerStateFunction = (stateValue) => {
    setReaderState(stateValue);
  };

  const [data, setData] = React.useState([]);
  const [dataLeft, setDataLeft] = React.useState([]);
  const [dataRight, setDataRight] = React.useState([]);
  const [finishData, setFinishData] = React.useState(false);
  const [finishStateButton, setFinishStateButton] = React.useState(false);
  const [tableState, setTableState] = React.useState(false);
  const [id, setId] = useState(props.match.params.id);
  const [previousProcess, setbackRoute] = useState(
    props.match.params.previousProcess
  );

  const handleExportPDF = (data) => {
    Date.prototype.today = function () {
      return (
        (this.getDate() < 10 ? "0" : "") +
        this.getDate() +
        "-" +
        (this.getMonth() + 1 < 10 ? "0" : "") +
        (this.getMonth() + 1) +
        "-" +
        this.getFullYear()
      );
    };

    // For the time now
    Date.prototype.timeNow = function () {
      return (
        (this.getHours() < 10 ? "0" : "") +
        this.getHours() +
        "." +
        (this.getMinutes() < 10 ? "0" : "") +
        this.getMinutes() +
        "." +
        (this.getSeconds() < 10 ? "0" : "") +
        this.getSeconds()
      );
    };
    data.map((element) => {
      docDefinition.content[1].table.body.push([
        {
          text: element.material,
          style:
            element.isKitProvided === 1 || element.isKitProvided === 2
              ? "KitSuccess"
              : "KitDanger",
        },
        {
          text: element.explanation,
          style:
            element.isKitProvided === 1 || element.isKitProvided === 2
              ? "KitSuccess"
              : "KitDanger",
        },
        {
          text: element.partyNumber,
          style:
            element.isKitProvided === 1 || element.isKitProvided === 2
              ? "KitSuccess"
              : "KitDanger",
        },
        {
          text: element.quantity,
          style:
            element.isKitProvided === 1 || element.isKitProvided === 2
              ? "KitSuccess"
              : "KitDanger",
        },
        {
          text:
            element.isKitProvided === 1 || element.isKitProvided === 2
              ? "TAMANLANDI"
              : "TAMAMLANMADI",
          style:
            element.isKitProvided === 1 || element.isKitProvided === 2
              ? "KitSuccess"
              : "KitDanger",
        },
      ]);
    });

    var newDate = new Date();
    var datetime = newDate.today() + " " + newDate.timeNow();
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake
      .createPdf(docDefinition)
      .download(datetime + " - UrunHazırlamaRaporu.pdf");
  };
  const handleError = (error) => {
    console.log("Error " + error);
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     loadData();
  //   }, 15000);

  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    loadData();
  }, []);

  // const loadData = () => {
  //   axios
  //     .get(
  //       process.env.REACT_APP_API_ENDPOINT +
  //       "api/ProductionProcessManual/GetAllAsyncProductionProcessManualId?id=" +
  //       id +
  //       "&process=" +
  //       10 +
  //       "&previousProcess=" +
  //       previousProcess
  //     )
  //     .then((response) => {

  //       let resData = response.data.data;

  //       let resDataLeft = resData.filter((x) => x.detachFromPanelBeginDate == null);
  //       setDataLeft(resDataLeft);
  //       let resDataRight = resData.filter((x) => x.detachFromPanelBeginDate != null);
  //       setDataRight(resDataRight);

  //       resDataRight.filter((x) => x.detachFromPanelElapsedTime == null && x.detachFromPanelBeginDate != null).length > 0
  //         ? setFinishStateButton(true)
  //         : setFinishStateButton(false);
  //     });
  // };
  const loadData = () => {
    axios
      .get(
        process.env.REACT_APP_API_ENDPOINT +
        "api/ProductionProcessManual/GetAllAsyncProductionProcessManualId?id=" +
        id +
        "&process=" +
        10 +
        "&previousProcess=" + previousProcess
      )
      .then((response) => {
          setDataLeft(response.data.data.notRead.filter((x) => x.detachFromPanelBeginDate == null));
          setDataRight(response.data.data.read);

          response.data.data.read.filter((x) => x.detachFromPanelElapsedTime == null && x.detachFromPanelBeginDate != null).length > 0
            ? setFinishStateButton(true)
            : setFinishStateButton(false);

        //}
      });
  };

  const tableStateChange = () => {
    setTableState(true);
  };

  const updateProgramData = (datas) => {
    axios
      .put(
        process.env.REACT_APP_API_ENDPOINT +
        "api/ProductionProcessManual/DetachFromPanelUpdate",
        datas
      )
      .then((res) => {
        if (res.data.success) {
          loadData();
        } else {
          toastData("Kayıt Yapılamadı !", false);
        }
      })
      .catch((err) => toastData("Kayıt Yapılamadı !", false));
  };

  const vardiyaTamamla = () => {
    if (readerState) {
      let datas = {
        id: dataRight[0].id,
        productionId: props.match.params.id,
        qrCode: "Finish24061994",
        detachFromPanelBeginDate: new Date().toISOString(),
      };
      updateProgramData(datas);
    } else {
      toastData("İş Akışını Başlatınız", false);
    }
  };

  const isTamamla = () => {
    if (readerState) {
      let datas = {
        id: dataRight[0].id,
        productionId: props.match.params.id,
        qrCode: "Finish24061994",
        detachFromPanelBeginDate: new Date().toISOString(),
      };
      updateProgramData(datas);
      setFinishData(true);
    } else {
      toastData("İş Akışını Başlatınız", false);
    }
  };

  const updateState = (e) => {
    if (readerState) {
      axios
      .get(
        process.env.REACT_APP_API_ENDPOINT +
            "api/ProductionProcessManual/GetByQrCode?code=" +
            e.replace("ç", ".").replace("ç", ".").replace("ç", ".") +"&productionId="+props.match.params.id
            +"&process=10"+"&previousProcess=" + previousProcess
      )
      .then((response) => {
        if (response.data.data > 0)
         {
          let datas =
          {
            id: response.data.data,
            productionId: props.match.params.id,
            qrCode: e.replace("ç", ".").replace("ç", ".").replace("ç", "."),
            detachFromPanelBeginDate: new Date().toISOString()
          };
          updateProgramData(datas);
          setFinishStateButton(true);
          toastData(e.replace("ç", ".").replace("ç", ".").replace("ç", ".") + " kodlu panel okutulmuştur...!", true);
          loadData();
        } 
        else {
          toastData(e.replace("ç", ".").replace("ç", ".").replace("ç", ".") + " kodlu panel bulunamadı...!", false);
        }
      });

    } else {
      toastData("Barkod Okutmadan İş Akışını Başlatınız!", false);
    }
  };

  // const updateState = (e) => {
  //   if (readerState) {
  //     let tempDatas = dataLeft.filter(
  //       (obj) =>
  //         obj.qrCode ===
  //         e.replace("ç", ".").replace("ç", ".").replace("ç", ".") &&
  //         obj.detachFromPanelBeginDate == null
  //     );
  //     if (tempDatas.length > 0) {
  //       let datas = {
  //         id: tempDatas[0].id,
  //         productionId: props.match.params.id,
  //         qrCode: e.replace("ç", ".").replace("ç", ".").replace("ç", "."),
  //         detachFromPanelBeginDate: new Date().toISOString(),
  //       };
  //       updateProgramData(datas);
  //       setFinishStateButton(true);
  //     } else {
  //       toastData("Barkod Bulunamadı !", false);
  //     }
  //   } else {
  //     toastData("Barkod Okutmadan İş Akışını Başlatınız!", false);
  //   }
  // };


  return (
    <Fragment>
      <Row>
        <Col xl="12" md="12" xs="12" style={{ minHeight: 100 }}>
          <TimerCalculate
            finishController={finishData}
            tableController={tableStateChange}
            cols={{ xl: "12", sm: "12", xs: "12" }}
            PproductionProcess={10}
            screenName="Panel Ayırma"
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
      <Row>
        <div>
          <div className="content-header row">
            <div className="content-header-right text-md-end col-md-12 col-12 d-md-block d-none">
              <div className="row">
                <div className="col-10 text-right"></div>
                {finishStateButton ? (
                  <div className="col-1 text-right">
                    <Button.Ripple
                      className="btn-icon"
                      color="primary"
                      id="newProductionOrders"
                      onClick={() => vardiyaTamamla()}
                    >
                      <CheckCircle size={20} /> Vardiya Bitir
                    </Button.Ripple>
                    <UncontrolledTooltip
                      placement="left"
                      target="newProductionOrders"
                    >
                      Vardiya Bitir
                    </UncontrolledTooltip>
                  </div>
                ) : null}
                <div className="col-1 text-right">
                  <Button.Ripple
                    className="btn-icon"
                    color="warning"
                    id="newProductionOrder"
                    onClick={() => isTamamla()}
                  >
                    <CheckSquare size={20} /> İş Emrini Bitir
                  </Button.Ripple>
                  <UncontrolledTooltip
                    placement="left"
                    target="newProductionOrder"
                  >
                    Bitir
                  </UncontrolledTooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Row>
          <Col xl="2" md="2" xs="32">
            {tableState ? (
              <Table responsive style={{ marginTop: 10 }} size="sm">
                <thead>
                  <tr>
                    <th>QrCode</th>
                  </tr>
                </thead>
                <tbody>
                  {dataLeft.length > 0 ? (
                    <>
                      {dataLeft.map((obj) => (
                        <tr
                          style={{ backgroundColor: "#3e92cc", color: "white" }}
                          key={`${obj.id}`}
                        >
                          <td style={{ color: "white" }}>{obj.qrCode}</td>
                        </tr>
                      ))}
                    </>
                  ) : null}
                </tbody>
              </Table>
            ) : null}
          </Col>
          <Col xl="10" md="10" xs="10">
            {tableState ? (
              <Table responsive style={{ marginTop: 10 }} size="sm">
                <thead>
                  <tr>
                    <th>QrCode</th>
                    <th>Panel Ayırma Baslangıc Tarihi</th>
                    <th>Panel Ayırma Bitiş Tarihi</th>
                    <th>Gecen Süre</th>
                    <th>Kullanıcı</th>
                    <th style={{ textAlign: "right" }}>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataRight.length > 0 ? (
                    <>
                      {dataRight.map((obj) => (
                        <tr
                          style={{ backgroundColor: "#3e92cc", color: "white" }}
                          key={`${obj.id}`}
                        >
                          <td style={{ color: "white" }}>{obj.qrCode}</td>
                          <td style={{ color: "white" }}>
                            {obj.detachFromPanelBeginDate
                              ? new Date(
                                obj.detachFromPanelBeginDate
                              ).toLocaleDateString()
                              : null}{" "}
                            {obj.detachFromPanelBeginDate
                              ? new Date(
                                obj.detachFromPanelBeginDate
                              ).toLocaleTimeString()
                              : null}
                          </td>
                          <td style={{ color: "white" }}>
                            {obj.detachFromPanelEndDate
                              ? new Date(
                                obj.detachFromPanelEndDate
                              ).toLocaleDateString()
                              : null}{" "}
                            {obj.detachFromPanelEndDate
                              ? new Date(
                                obj.detachFromPanelEndDate
                              ).toLocaleTimeString()
                              : null}
                          </td>
                          <td style={{ color: "white" }}>
                            {obj.detachFromPanelElapsedTime}
                          </td>
                          <td style={{ color: "white" }}>{obj.fullName}</td>
                          <td></td>
                        </tr>
                      ))}
                    </>
                  ) : null}
                </tbody>
              </Table>
            ) : null}
          </Col>
        </Row>
      </Row>
    </Fragment>
  );
}

export default DetachFromPanelDetail;
