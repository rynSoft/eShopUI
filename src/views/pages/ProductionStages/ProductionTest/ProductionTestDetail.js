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
import { Input } from 'antd';
import axios from "axios";
import TimerCalculate from "../../TimerCalculate/TimerCalculate.js";
import {
  Check,
  CheckCircle,
  CheckSquare,
  Printer,
  XOctagon,
} from "react-feather";

import toastData from "../../../../@core/components/toastData/index.js";
function ProductionTestDetail(props) {

  const [finishStateButton, setFinishStateButton] = React.useState(false);
  const [readerState, setReaderState] = React.useState(false);

  const readerStateFunction = (stateValue) => {
    setReaderState(stateValue);
  };


  const [data, setData] = React.useState([]);
  const [dataCount, setDataCount] = React.useState(10);
  
  const [finishData, setFinishData] = React.useState(false);
  const [tableState, setTableState] = React.useState(false);
  const [id, setId] = useState(props.match.params.id);

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
          "api/ProductionProcessManualTest/GetAllAsyncProductionProcessManualId?id=" +
          id )
      .then((response) => {
        if (response.data.data.length > 0) {
          let resData = response.data.data;
          resData.filter(
            (x) => x.testEndDate == null && x.testBeginDate != null
          ).length > 0 
       
            ? setFinishStateButton(true)
            : setFinishStateButton(false);
          setData(resData);
        }
      });
  };

  const tableStateChange = () => {
    setTableState(true);
  };

  const addLabelData = (datas) => {
    axios
      .post(
        process.env.REACT_APP_API_ENDPOINT + "api/ProductionProcessManualTest/Add",
        datas
      )
      .then((res) => {
        if (res.data.success) {
          loadData();
        } else {
          toastData(res.data.message, false);
        }
      })
      .catch((err) => toastData("Kayıt Yapılamadı !", false));
  };

  const vardiyaTamamla = () => {
    if (readerState) {
      let datas = {
        id: data[0].id,
        productionId: props.match.params.id,
        qrCode: "Finish24061994",
        rangeCount: dataCount,
        testBeginDate: new Date().toISOString(),
      };
      addLabelData(datas);
      //setFinishData(true);
    } else {
      toastData("İş Akışını Başlatınız", false);
    }
  };

  const isTamamla = () => {
    if (readerState) {
      let datas = {
        id: data[0].id,
        productionId: props.match.params.id,
        qrCode: "Finish24061994",
        rangeCount: dataCount,
        testBeginDate: new Date().toISOString(),
      };
      addLabelData(datas);
      setFinishData(true);
    } else {
      toastData("İş Akışını Başlatınız", false);
    }
  };

  const updateState = (e) => {
    if (readerState) {
      let tempDatas = data.filter(
        (obj) =>
          obj.qrCode === e.replace("ç", ".").replace("ç", ".").replace("ç", ".")
      );
      if (tempDatas.length <= 0) {
        let newState = {
          id: new Date().getTime(),
          productionId: props.match.params.id,
          qrCode: e.replace("ç", ".").replace("ç", ".").replace("ç", "."),
          testBeginDate: new Date().toISOString(),
        };
        let datas = {
          productionId: props.match.params.id,
          rangeCount: dataCount,
          qrCode: e.replace("ç", ".").replace("ç", ".").replace("ç", "."),
          testBeginDate: new Date().toISOString(),
        };

        addLabelData(datas);
      } else {
        toastData("Barkod Zaten Kayıtlı!", false);
      }
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
            PproductionProcess={11}
            screenName="Panel Test Süreci"
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
            <div className="content-header-left col-md-12 col-12 d-md-block d-none">
              <div className="row">
                <div className="col-6 text-right"></div>
                <div className="col-2 text-left">Üretim Aralık Miktarı<Input  type="number" onChange={data => { setDataCount(data.target.value) }} value={dataCount} /></div>
              
                {finishStateButton ? (
                  <div className="col-2 text-right">
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
                <div className="col-2 text-right">
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
        {tableState ? (
          <Table responsive style={{ marginTop: 10 }} size="sm">
            <thead>
              <tr>
                <th>QrCode</th>
                <th>Ana Panel Kodu</th>
                <th>Test Baslangıc Tarihi</th>
                <th>Test Bitiş Tarihi</th>
                <th>Gecen Süre</th>
                <th>Kullanıcı</th>
                <th style={{ textAlign: "right" }}>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                <>
                  {data.map((obj) => (
                    <tr
                      style={{ backgroundColor: "#3e92cc", color: "white" }}
                      key={`${obj.id}`}
                    >
                      <td style={{ color: "white" }}>{obj.qrCode}</td>
                      <td style={{ color: "white" }}>{obj.productionOperationsQrCode}</td>
                      <td style={{ color: "white" }}>
                        {obj.testBeginDate
                          ? new Date(obj.testBeginDate).toLocaleDateString()
                          : null}{" "}
                        {obj.testBeginDate
                          ? new Date(obj.testBeginDate).toLocaleTimeString()
                          : null}
                      </td>
                      <td style={{ color: "white" }}>
                        {obj.testEndDate
                          ? new Date(obj.testEndDate).toLocaleDateString()
                          : null}{" "}
                        {obj.testEndDate
                          ? new Date(obj.testEndDate).toLocaleTimeString()
                          : null}
                      </td>
                      <td style={{ color: "white" }}>
                        {obj.testElapsedTime}
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
      </Row>
    </Fragment>
  );
}

export default ProductionTestDetail;
