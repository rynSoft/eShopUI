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
  const [userName, setuserName] = useState(
    JSON.parse(localStorage.getItem("userData")).userNameSurname
  );

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
        console.log(response.data.data);
      });
  };

  const tableStateChange = () => {
    setTableState(true);
  };

  const readerStateFunction = (stateValue) => {
    setReaderState(stateValue);
  };

  const addProduct = async (args) => {
    let addParameters = { qrcode: args, productionId: id };

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
  };

  const updateState = (e) => {
    if (readerState) {
      if (!data.find((obj) => obj === e)) addProduct(e);
      else toastData("Ürün Kodu Daha önce okutulmuş!", false);
    }
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
            screenName="Ürün Giriş"
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
      <div className='react-dataTable' style={{ height: '100%', width: '100%', overflow: 'auto' }}  >
                    <ClassicDataTable key={key} data={data} columns={col} noDataText="Üretim Bulunamadı" searchValue={searchValue}  />
                </div>
        {/* <div className='react-dataTable'>
          <PerfectScrollbar
            options={{ wheelPropagation: false, suppressScrollX: true }}
            className="ScrollHeightDynamic"
          >
            <ClassicDataTable
              selectableRowsNoSelectAll
              noDataText="Ürün Bulunamadı"
              columns={col}
              data={data}
              pagination
              paginationPerPage={20}
              paginationDefaultPage={currentPage + 1}
      
            />
          </PerfectScrollbar>
        </div> */}
      </Row>
    </>
  );
}

export default Product;
