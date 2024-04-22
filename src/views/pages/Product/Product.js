import BarcodeReader from "react-barcode-reader";
import React, { useState, useEffect, Fragment } from "react";
import { Table, Row, Col, ButtonGroup, Button, Nav } from "reactstrap";
import DataTable from "react-data-table-component";
import axios from "axios";
import TimerCalculate from "../TimerCalculate/TimerCalculate.js";
import toastData from "../../../@core/components/toastData/index.js";
import PerfectScrollbar from "react-perfect-scrollbar";
import "./Product.css";
import ClassicDataTable from '../../../@core/components/gridTable/ClassicDataTable';

function Product(props) {
  const [data, setData] = React.useState([]);
  const [finishData, setFinishData] = React.useState(false);
  const [tableState, setTableState] = React.useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [readerState, setReaderState] = React.useState(false);
  const [key, setKey] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [id, setId] = useState(props.match.params.id);
  const [routeId, setRouteId] = useState(props.match.params.routeId);
  const [userName, setuserName] = useState(JSON.parse(localStorage.getItem("userData")).userNameSurname);
  const [tabInfo, setTabInfo] = useState(JSON.parse(localStorage.getItem("lastTab")));
  const [nextRouteId, setNextRouteId] = useState(0);
 

  const col = [
    {
      name: "Ürün Kodu",
      selector: (row) => row.qrcode,
      width: "450px",
    },
    {
      name: "Oluşturma Tarihi",
      selector: (row) =>
        new Date(row.createDate).toLocaleDateString() +
        " " +
        new Date(row.createDate).toLocaleTimeString(),
      width: "400px",
    },
    {
      name: "Operator",
      selector: (row) => row.userAdSoyAd,
      width: "200px",
    },
  ];

  const handleError = (error) => {
    console.log("Error " + error);
  };

  useEffect(() => {
    initialData();
  }, []);

  const initialData = async () => {
    await axios
      .get(
        process.env.REACT_APP_API_ENDPOINT +
          "api/Product/GetAllProductId?id=" +
          id
      )
      .then((response) => {
        setData(response.data.data);
      });

      await axios
      .get(
        process.env.REACT_APP_API_ENDPOINT +
          "api/WorkProcessRoute/GetOrderNextId?productionId="+id+"&workProcessRouteId="+ routeId +"&order="+ tabInfo.order 
      )
      .then((response) => {
        setNextRouteId(response.data.data.id);
      });
  };

  const tableStateChange = () => {
    setTableState(true);
  };

  const readerStateFunction = (stateValue) => {
    setReaderState(stateValue);
  };

  const addProduct = async (args) => {
    if (args != null)
    {
    let addParameters = { qrcode: args, productionId: id, order : tabInfo.order + 1 , nextWPRId : nextRouteId };

    await axios
      .post(
        process.env.REACT_APP_API_ENDPOINT + "api/Product/Add",
        addParameters
      )
      .then((res) => {
        if (res.data.success) {
          toastData("Ürün Kaydedildi", true);

          setData([
            ...data,
            { qrcode: args, userAdSoyAd: userName, createDate: new Date() },
          ]);
        } else {
          toastData("Ürün Kaydedilemedi !", false);
        }
      })
      .catch((err) => toastData("Ürün Kaydedilemedi !", false));
    }
  };

  const updateState = (e) => {
    if (readerState) {
      if (!data.find((obj) => obj === e)) addProduct(e);
      else toastData("Ürün Kodu Daha önce okutulmuş!", false);
    } else
       toastData("Ürün giriş yapılmadan önce süreci başlatmalısınız (Devam Et)!", false); 

  };

  return (
    <>
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
            updateState(err.replace("ç", ".").replace("ç", "."));
          }}
        />
      </Row>

      <Row>
      <Col xl="3" md="3" xs="32">
            {tableState ? (
              <Table responsive style={{ marginTop: 10 }} size="sm">
                <thead>
                  <tr>
                    <th>QrCode</th>
                  </tr>
                </thead>
                <tbody style={{ marginTop: 10, color: "yellow", font: 30 }}>
                  " Chart Component Eklenecek ." " Chart Component Eklenecek ."
                </tbody>
              </Table>
            ) : null}
          </Col>
          <Col xl="9" md="9" xs="32">
          <div className='react-dataTable' style={{ height: '100%', width: '100%', overflow: 'auto' }}  >
                    <ClassicDataTable key={key} data={data} columns={col} noDataText="Ürün Bulunamadı" searchValue={searchValue}  />
                </div>
      
          </Col>
    
      </Row>
    </>
  );
}

export default Product;
