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
  CheckCircle,
  CheckSquare,

} from "react-feather";
import toastData from "../../../../@core/components/toastData/index.js";
function LabelingDetail(props) {

  const [finishStateButton, setFinishStateButton] = React.useState(false);
  const [readerState, setReaderState] = React.useState(false);

  const readerStateFunction = (stateValue) => {
    setReaderState(stateValue);
  };

  const [dataLeft, setDataLeft] = React.useState([]);
  const [dataRight, setDataRight] = React.useState([]);
  const [finishData, setFinishData] = React.useState(false);
  const [tableState, setTableState] = React.useState(false);
  const [id, setId] = useState(props.match.params.id);
  const [previousProcess, setbackRoute] = useState(props.match.params.previousProcess);

  const handleError = (error) => {
    console.log("Error " + error);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    axios
      .get(
        process.env.REACT_APP_API_ENDPOINT +
        "api/ProductionProcessManual/GetAllAsyncProductionProcessManualId?id=" +
        id +
        "&process=" +
        7 +
        "&previousProcess=" + previousProcess
      )
      .then((response) => {
          setDataLeft(response.data.data.notRead.filter((x) => x.labelingBeginDate == null));
          setDataRight(response.data.data.read);

          response.data.data.read.filter((x) => x.labelingElapsedTime == null && x.labelingBeginDate != null).length > 0
            ? setFinishStateButton(true)
            : setFinishStateButton(false);

        //}
      });
  };

  const tableStateChange = () => {
    setTableState(true);
  };

  const updateLabelingData = (datas) => {
    axios
      .put(
        process.env.REACT_APP_API_ENDPOINT + "api/ProductionProcessManual/LabelingUpdate", datas
      )
      .then((res) => {
        if (res.data.success) {
          loadData();
        } else {
          toastData("Kayıt Yapılamadı !", false);
        }
      }).catch(err => toastData("Kayıt Yapılamadı !", false));
  };



  const vardiyaTamamla = () => {
    if (readerState) {
      let datas = {
        id: dataRight[0].id,
        productionId: props.match.params.id,
        qrCode: "Finish24061994",
        labelingBeginDate: new Date().toISOString(),
      };
      updateLabelingData(datas);

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
        labelingBeginDate: new Date().toISOString(),
      };
      updateLabelingData(datas);
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
            e.replace("ç", ".").replace("ç", ".").replace("ç", ".") +
            "&productionId="+props.match.params.id+"&process=7"+"&previousProcess=" + previousProcess
            )
      .then((response) => {
        if (response.data.data > 0)
         {
          let datas =
          {
            id: response.data.data,
            productionId: props.match.params.id,
            qrCode: e.replace("ç", ".").replace("ç", ".").replace("ç", "."),
            labelingBeginDate: new Date().toISOString()
          };
          updateLabelingData(datas);
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

  return (
    <Fragment>
      <Row>
        <Col xl="12" md="12" xs="12" style={{ minHeight: 100 }}>
          <TimerCalculate
            finishController={finishData}
            tableController={tableStateChange}
            cols={{ xl: "12", sm: "12", xs: "12" }}
            PproductionProcess={7}
            screenName="Etiketleme"
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
                    <th>Etiketleme Baslangıc Tarihi</th>
                    <th>Etiketleme Bitiş Tarihi</th>
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
                            {obj.labelingBeginDate
                              ? new Date(
                                obj.labelingBeginDate
                              ).toLocaleDateString()
                              : null}{" "}
                            {obj.labelingBeginDate
                              ? new Date(
                                obj.labelingBeginDate
                              ).toLocaleTimeString()
                              : null}
                          </td>
                          <td style={{ color: "white" }}>
                            {obj.labelingEndDate
                              ? new Date(
                                obj.labelingEndDate
                              ).toLocaleDateString()
                              : null}{" "}
                            {obj.labelingEndDate
                              ? new Date(
                                obj.labelingEndDate
                              ).toLocaleTimeString()
                              : null}
                          </td>

                          <td style={{ color: "white" }}>
                            {obj.labelingElapsedTime}
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

export default LabelingDetail;
