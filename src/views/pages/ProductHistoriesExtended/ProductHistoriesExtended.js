import BarcodeReader from "react-barcode-reader";
import React, { useState, useEffect, Fragment } from "react";
import { ArrowRightCircle } from "react-feather";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../DropdownMenu/DropdownMenu.css';
import DropdownMenu from "../DropdownMenu/DropdownMenu.js";
import {
  Table,
  Row,
  Col,
  ButtonGroup,
  Button,
  Card ,
  Nav,
  UncontrolledTooltip,
  Dropdown,
} from "reactstrap";
import axios from "axios";
import TimerCalculate from "../TimerCalculate/TimerCalculate.js";
import toastData from "../../../@core/components/toastData/index.js";
import { date } from "yup";

// import DropdownMenu from './views/pages/DropdownMenu/DropdownMenu';

function ProductHistoriesExtended(props) {
  const options = ['Açıklama Ekle', 'Hurdayı Ayır', 'Sil'];
  const [readerState, setReaderState] = React.useState(false);
  const [productData, setProductData] = React.useState([]);
  const [materialData, setMaterialData] = React.useState([]);
  const [materialIds, setMaterialIds] = React.useState([]);
  const [lastData, setLastData] = React.useState(null);

  const [finishData, setFinishData] = React.useState(false);
  const [tableState, setTableState] = React.useState(false);
  const [id, setId] = useState(props.match.params.id);
  const [routeId, setRouteId] = useState(Number(props.match.params.routeId));
  const [tabInfo, setTabInfo] = useState(
    JSON.parse(localStorage.getItem("lastTab"))
  );
  const [nextRouteId, setNextRouteId] = useState(0);
  const [isProductPage, setIsProductPage] = useState(0);
  const [data, setData] = useState();
  const [order, setOrder] = useState();
  const [userName, setuserName] = useState(
    JSON.parse(localStorage.getItem("userData")).userNameSurname
  );

  const handleError = (error) => {
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
        if (response.data.data != null )
        {
          setNextRouteId(response.data.data.id);
          setIsProductPage(response.data.data.isProductPage);
          setOrder(response.data.data.order);
          loadData(response.data.data.isProductPage);
        }else
        {
          loadData();
        }
      });
  };

  const loadData = (args) => {
    axios
      .get(
        process.env.REACT_APP_API_ENDPOINT +
          "api/ProductHistories/GetAllAsyncProductHistories?workProcessRouteId=" +
          routeId
      )
      .then((response) => {
        setProductData(response.data.data);
      });
  };

  const tableStateChange = () => {
    setTableState(true);
  };

  const getHistories = (id) => {
    axios
      .get(
        process.env.REACT_APP_API_ENDPOINT +
          "api/MaterialDecreaseHistory/GetProductHistoryId?productHistoryId=" +
          id
      )
      .then((response) => {
        console.log(response.data.data);
        setMaterialData(response.data.data);
      });

    console.log("this is:", id);
  };

  const addData = (datas) => {
    axios
      .post(
        process.env.REACT_APP_API_ENDPOINT + "api/ProductHistories/Add",
        datas
      )
      .then((res) => {
        if (res.data.success) {
          setMaterialData([]);
          setMaterialIds([]);
          toastData(res.data.message, true);
        } else {
          toastData(res.data.message, false);
        }
      })
      .catch((err) => toastData("Kayıt Yapılamadı !" + err, false));
  };

  const isProductOrMaterial = async (e) => {
    {
      await axios
        .get(
          process.env.REACT_APP_API_ENDPOINT +
            "api/Product/GetByQrCodeProduct?productionId=" +
            id +
            "&code=" +
            e +
            "&workProcessRouteId=" +
            routeId
        )
        .then((response) => {
          if (response.data.data === null)
            toastData(response.data.message, false);

          if (productData?.findIndex((obj) => obj.productQrCode === e) != -1) {
            toastData(e + " Daha önce kayıt edilmiş!", false);
            return;
          }
          if (response.data.data != null && response.data.data?.type === true)
            product(response.data.data, e);
         
            if (materialData?.findIndex((obj) => obj.materialCode === e) != -1 ) {
              toastData(e + " Daha önce kayıt edilmiş!", false);
              return;
            }

         if (
            response.data.data != null &&
            response.data.data?.type === false
          )
            material(response.data.data, e);
        });
    }
  };

  const product = async (e, code) => {

    if (lastData != null) {
      if (materialIds.length === 0)
      {
        toastData("Hammadde seçimi yapılmadan başka ürün kodu okutulamaz...!", false);
        return;
      }
      lastData.endDate = new Date();

      if (lastData.endDate != undefined) {
        lastData.elapsedTime =
          (lastData.endDate.getTime() - lastData.beginDate.getTime()) / 1000;
        lastData.isFininshed = 1;
        lastData.nextProcessRouteId = nextRouteId;
        lastData.productionId = id;
        lastData.order = order;
        lastData.metarialds = materialIds;

          addData(lastData);
          setLastData(null);

          let datas = {
            productId: e.id,
            workProcessRouteId: routeId,
            productQrCode: code,
            beginDate: new Date(),
            elapsedTime: 0,
          };
          setProductData([...productData, datas]);
          setLastData(datas);
          toastData(code + " kodlu panel okutulmuştur...!", true);
          
      }
    } 
    else {
      let datas = {
        productId: e.id,
        workProcessRouteId: routeId,
        productQrCode: code,
        beginDate: new Date(),
        elapsedTime: 0,
      };
      setProductData([...productData, datas]);
      setLastData(datas);
      toastData(code + " kodlu panel okutulmuştur...!", true);
    }
  };

  const material = async (e, code) => {
    let materialDatas = {
      materialCode: code,
      materialId: e.id,
      workProcessRouteId: routeId,
      remainQuantity: e.remainQuantity - e.decrease ,
      decrease: e.decrease,
      quantity: e.quantity,
    };
    let addDatas = {
      materialId: e.id,
      quantity: e.decrease,
    };
    setMaterialData([...materialData, materialDatas]);
    setMaterialIds([...materialIds, addDatas]);
  };

  const updateState = async (e) => {
    if (readerState) {
      await isProductOrMaterial(e);
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
          //onError={handleError}
          onScan={(err, result) => {
            updateState(err);
          }}
        />
      </Row>
      <Row>
        <div>
          <div className="content-header row">
            <div className="content-header-right text-md-end col-md-12 col-12 d-md-block d-none"></div>
          </div>
        </div>
        <Row>
          <Col xl="8" md="8" xs="8">
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
                  {productData?.length > 0 ? (
                    <>
                      {productData.map((obj) => (
                        <tr
                          style={{ backgroundColor: "#3e92cc", color: "white" }}
                          key={`${obj.id}`}
                        >
                          <td style={{ color: "white" }}>
                            {obj.productQrCode}
                          </td>
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
                          <td style={{ color: "red" }}>
                            <Button
                              className=".my-secondary-btn"
                              onClick={() => getHistories(obj.id)}
                            >
                              <ArrowRightCircle size={16} />
                            </Button>
                            <DropdownMenu options={options} />

                          </td>
                        </tr>
                      ))}
                    </>
                  ) : null}
                </tbody>
              </Table>
            ) : null}
            </Card>
          </Col>
          <Col xl="4" md="4" xs="32">
          <Card style={{ height: '100%', width: '100%' }}>
            {tableState ? (
              <Table responsive style={{ marginTop: 10 }} size="sm">
                <thead>
                  <tr>
                    <th>Malzeme Kodu</th>
                    <th>Miktar</th>
                    <th>Düşüm Miktarı</th>
                    <th>Kalan Miktar</th>
                  </tr>
                </thead>
                <tbody style={{ marginTop: 10, color: "#7EA1FF", font: 30 }}>
                  {materialData?.length > 0 ? (
                    <>
                      {materialData.map((obj) => (
                        <tr
                          style={{ backgroundColor: "#A3FFD6", color: "black" }}
                          key={`${obj.id}`}
                        >
                          <td style={{ color: "black" }}>{obj.materialCode}</td>
                          <td style={{ color: "black" }}>{obj.quantity}</td>
                          <td style={{ color: "black" }}>{obj.decrease}</td>
                          <td style={{ color: "black" }}>{obj.remainQuantity}
                          </td>
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

export default ProductHistoriesExtended;
