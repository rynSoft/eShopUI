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
  Card
} from "reactstrap";
import axios from "axios";
import TimerCalculate from "../TimerCalculate/TimerCalculate.js";
import {
  Check,
  CheckCircle,
  CheckSquare,
  Printer,
  XOctagon,
} from "react-feather";
import toastData from "../../../@core/components/toastData/index.js";
import { date } from "yup";
import ApexChart from "../ProductionProcess/ApexChart.js";

function ProductHistoriesBasic(props) {
  const [readerState, setReaderState] = React.useState(false);
  const [finishStateButton, setFinishStateButton] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [lastData, setLastData] = React.useState(null);
  const [finishData, setFinishData] = React.useState(false);
  const [tableState, setTableState] = React.useState(false);
  const [id, setId] = useState(props.match.params.id);
  const [routeId, setRouteId] = useState(Number(props.match.params.routeId));
  const [productQuantity, setProductQuantity] = useState(JSON.parse(localStorage.getItem("productionData")).quantity);
  const [productDoneCount, setProductDoneCount] = useState(0);
  const [productRemainCount, setProductRemainCount] = useState(0);
  const [previousProcess, setbackRoute] = useState(
    props.match.params.previousProcess
  );
  const [tabInfo, setTabInfo] = useState(
    JSON.parse(localStorage.getItem("lastTab"))
  );
  const [nextRouteId, setNextRouteId] = useState(0);
  const [isProductPage, setIsProductPage] = useState(0);
  const [order, setOrder] = useState();
  const [codeBeginDate, setcodeBeginDate] = useState();
  const [userName, setuserName] = useState(
    JSON.parse(localStorage.getItem("userData")).userNameSurname
  );

  const handleError = (error) => {
    //console.log("Error " + error);
  };

  const readerStateFunction = (stateValue) => {
    setReaderState(stateValue);
  };

  useEffect(() => {
    getProductState();
  }, []);

  const getProductState = () => {
    axios
      .get(
        process.env.REACT_APP_API_ENDPOINT +
          "api/WorkProcessRoute/GetOrderNextId?productionId=" +
          id +
          "&workProcessRouteId=" +
          routeId +
          "&order=" +
          tabInfo.order
      )
      .then((response) => {
        setNextRouteId(response.data.data.id);
        setIsProductPage(response.data.data.isProductPage);
        setOrder(response.data.data.order);
        loadData(response.data.data.isProductPage);
      });
  };

  const getProductData = async (arg) => {
    // let choseMethod =
    // isProductPage == 1
    //   ? "api/Product/GetByQrCodeProduct?productionId=" +
    //     id +"&code=" +arg +
    //     "&workProcessRouteId=" +
    //     routeId
    //   : "api/ProductHistories/GetByQrCodeHistories?code=" +
    //   arg +
    //     "&workProcessRouteId=" +
    //     routeId;
  axios
  .get(
    process.env.REACT_APP_API_ENDPOINT +
      "api/Product/GetByQrCodeProduct?productionId=" +
      id +
      "&code=" +
      arg +
      "&workProcessRouteId=" +
      routeId
  )
    .then((response) => {
      if (response.data.success) {
        let datas = {
          productId : response.data.data.id,
          workProcessRouteId: routeId,
          productQrCode: arg,
          beginDate: new Date(),
          elapsedTime: 0,
        };
        setData([...data, datas]);
        setLastData(datas);
        toastData(arg + " kodlu panel okutulmuştur...!", true);
      } else {
        toastData(arg + " kodlu panel bulunamadı...!", false);
      }
    });
  }

  const loadData = (args) => {
    axios
      .get(               
        process.env.REACT_APP_API_ENDPOINT + "api/ProductHistories/GetAllAsyncProductHistories?workProcessRouteId=" + routeId )
      .then((response) => {
        setData(response.data.data);
        setProductDoneCount(response.data.data.length);
        setProductRemainCount(productQuantity - response.data.data.length);
      });
  };

  const tableStateChange = () => {
    setTableState(true);
  };

  const addData = (datas) => {

    axios
      .post(
        process.env.REACT_APP_API_ENDPOINT + "api/ProductHistories/Add",
        datas
      )
      .then((res) => {
        if (res.data.success) {

          let done = productDoneCount + 1;
          setProductDoneCount(done);
          let rm = productQuantity - done;
          setProductRemainCount(rm);

          toastData(res.data.message, true);
        } else {
          toastData(res.data.message, false);
        }
      })
      .catch((err) => toastData("Kayıt Yapılamadı !", false));
  };

  const updateState = async (e) => {

    if (readerState) {

      if (lastData != null && lastData.productQrCode == e)
      {
        toastData(lastData.productQrCode + "  ürün ikinci kez okutulamaz...!", false);
        return;
      }

      if (lastData != null && (lastData.productQrCode != e))
      { 

        lastData.endDate = await new Date();
        if (lastData.endDate != undefined)
        {
        
        lastData.elapsedTime = (lastData.endDate.getTime() - lastData.beginDate.getTime()) / 1000;
        lastData.isFininshed = 1;
        lastData.nextProcessRouteId = nextRouteId;
        lastData.productionId = id;
        lastData.order = order;

        addData(lastData);
        getProductData(e);
        }
 
      } else {
        getProductData(e);

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
            workProcessRouteId={routeId}
            screenName={tabInfo.name}
            readerStateFunction={readerStateFunction}
          />
        </Col>
        <BarcodeReader
          onError={handleError}
          onScan={(err, result) => {
            updateState(err.replaceAll("*", "-"));
          }}
        />
      </Row>
      <Row>
        <div>
          <div className="content-header row">
            <div className="content-header-right text-md-end col-md-12 col-12 d-md-block d-none">
              {/* <div className="row">
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
              </div> */}
            </div>
          </div>
        </div>
        <Row>
        <Col xl="3" md="3" xs="32">
          <Card style={{ height: '100%', width: '100%' }}>
            {tableState ? (
              <Table responsive style={{ marginTop: 10 }} size="sm">
                <thead>
                  <tr>
                    <th>Grafik Gösterim</th>
                  </tr>
                </thead>
                <tbody style={{ marginTop: 10, color: "yellow", font: 30 }}>
                  <div id="chart" style={{ marginTop: 100 }}>
                    <ApexChart colorDones="#f3ca20" colorRemains="#000000" data1={productDoneCount} data2={productRemainCount} width={380} />
                  </div>
                </tbody>
              </Table>
            ) : null}
          </Card>
        </Col>
          <Col xl="9" md="9" xs="9">
          <Card style={{ height: '100%', width: '100%' }}>
            {tableState ? (
              <Table responsive style={{ marginTop: 10 }} size="sm">
                <thead>
                  <tr>
                    <th>QrCode</th>
                    <th>Baslangıc Tarihi</th>
                    <th>Bitiş Tarihi</th>
                    <th>Gecen Süre</th>
                    <th>Kullanıcı</th>
                    <th style={{ textAlign: "right" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {data?.length > 0 ? (
                    <>
                      {data.map((obj) => (
                        <tr
                          style={{ backgroundColor: "#3e92cc", color: "white" }}
                          key={`${obj.id}`}
                        >
                          <td style={{ color: "white" }}>{obj.productQrCode}</td>
                          <td style={{ color: "white" }}>
                            {obj.beginDate
                              ? new Date(obj.beginDate).toLocaleDateString()
                              : null}{" "}
                            {obj.beginDate
                              ? new Date(obj.beginDate).toLocaleTimeString()
                              : null}
                          </td>
                          <td style={{ color: "white" }}>
                            {obj.endDate
                              ? new Date(obj.endDate).toLocaleDateString()
                              : null}{" "}
                            {obj.endDate
                              ? new Date(obj.endDate).toLocaleTimeString()
                              : null}
                          </td>
                          <td style={{ color: "white" }}>{obj.elapsedTime}</td>
                          <td style={{ color: "white" }}>{userName}</td>
                          <td></td>
                        </tr>
                      ))}
                    </>
                  ) : null}
                </tbody>
              </Table>
            ) : null}
           </Card>
          </Col>
        </Row>
      </Row>
    </Fragment>
  );
}

export default ProductHistoriesBasic;
