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
import TimerCalculate from "../TimerCalculate/TimerCalculate.js";
import toastData from "../../../@core/components/toastData/index.js";
import { date } from "yup";

function ProductHistoriesExtended(props) {
  const [readerState, setReaderState] = React.useState(false);
  const [productData, setProductData] = React.useState([]);
  const [materailData, setmaterailData] = React.useState([]);
  const [lastData, setLastData] = React.useState(null);

  const [finishData, setFinishData] = React.useState(false);
  const [tableState, setTableState] = React.useState(false);
  const [id, setId] = useState(props.match.params.id);
  const [routeId, setRouteId] = useState(Number(props.match.params.routeId));
  const [tabInfo, setTabInfo] = useState(JSON.parse(localStorage.getItem("lastTab")));
  const [nextRouteId, setNextRouteId] = useState(0);
  const [isProductPage, setIsProductPage] = useState(0);
  const [order, setOrder] = useState();
  const [userName, setuserName] = useState(
    JSON.parse(localStorage.getItem("userData")).userNameSurname
  );

  const handleError = (error) => {
    console.log("Error " + error);
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

  const loadData = (args) => {
    axios
      .get(
        process.env.REACT_APP_API_ENDPOINT + "api/ProductHistories/GetAllAsyncProductHistories?workProcessRouteId=" + routeId)
      .then((response) => {
        setProductData(response.data.data);
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
          //setLastData(null);
          toastData("Kayıt Yapıldı !", true);
        } else {
          toastData("Kayıt Yapılamadı !", false);
        }
      })
      .catch((err) => toastData("Kayıt Yapılamadı !", false));
  };




  const isProductOrMaterial = async (e) => {
    {
      await axios
        .get(process.env.REACT_APP_API_ENDPOINT + "api/Product/GetByQrCodeProduct?productionId=" + id + "&code=" + e + "&workProcessRouteId=" + routeId)
        .then((response) => {
          console.log(response);
        });
    }



    const updateState = async (e) => {
      if (readerState) {

        if (isProductOrMaterial(e)) 
        {
          if (lastData != null) {
            lastData.endDate = new Date();
            if (lastData.endDate != undefined) {
              lastData.elapsedTime = (lastData.endDate.getTime() - lastData.beginDate.getTime()) / 1000;
              lastData.isFininshed = 1;
              lastData.nextProcessRouteId = nextRouteId;
              lastData.productionId = id;
              lastData.order = order;
              addData(lastData);
              setLastData(null);
            }
          }

          await axios
            .get(process.env.REACT_APP_API_ENDPOINT + "api/Product/GetByQrCodeProduct?productionId=" + id + "&code=" + e + "&workProcessRouteId=" + routeId)
            .then((response) => {
              if (response.data.success) {

                let datas = {
                  productId: response.data.data,
                  workProcessRouteId: routeId,
                  productQrCode: e,
                  beginDate: new Date(),
                  elapsedTime: 0,
                };
                setProductData([...productData, datas]);
                setLastData(datas);
                toastData(e + " kodlu panel okutulmuştur...!", true);
              } else {
                toastData(e + " kodlu panel bulunamadı...!", false);
              }
            });
        }else
        {
          let materialDatas = {
            materialId: response.data.data,
            workProcessRouteId: routeId,
            productQrCode: e,
            beginDate: new Date(),
            elapsedTime: 0,
          };
          setmaterailData([...materailData, datas]);
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
              </div>
            </div>
          </div>
          <Row>
            <Col xl="8" md="8" xs="8">
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
                    {productData?.length > 0 ? (
                      <>
                        {productData.map((obj) => (
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
            </Col>
            <Col xl="4" md="4" xs="32">
              {tableState ? (
                <Table responsive style={{ marginTop: 10 }} size="sm">
                  <thead>
                    <tr>
                      <th>Malzeme Kodu</th>
                      <th>Kalan Miktar</th>
                    </tr>
                  </thead>
                  <tbody style={{ marginTop: 10, color: "yellow", font: 30 }}>
                    {materailData?.length > 0 ? (
                      <>
                        {materailData.map((obj) => (
                          <tr
                            style={{ backgroundColor: "#3e92cc", color: "white" }}
                            key={`${obj.id}`}
                          >
                            <td style={{ color: "white" }}>{obj.productQrCode}</td>
                            <td style={{ color: "white" }}>{obj.productQrCode}</td>
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




  export default ProductHistoriesExtended;
