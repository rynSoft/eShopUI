import BarcodeReader from "react-barcode-reader";
import React, { useState, useEffect, Fragment } from "react";
import { Table, Row, Col, ButtonGroup, Button, Nav } from "reactstrap";
import DataTable from "react-data-table-component";
import axios from "axios";
import TimerCalculate from "../TimerCalculate/TimerCalculate.js";
import toastData from "../../../@core/components/toastData/index.js";

function Product(props) {
  const [data, setData] = React.useState([]);
  const [finishData, setFinishData] = React.useState(false);
  const [tableState, setTableState] = React.useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [readerState, setReaderState] = React.useState(false);
  const [id, setId] = useState(props.match.params.id);

  const col = [
    {
      name: "Ürün Kodu",
      selector: (row) => row.qrcode,
      width: "250px",
    },
    {
      name: "Oluşturma Tarihi",
      selector: (row) => row.createDate,
      width: "200px",
    },
    {
      name: "Operator",
      selector: (row) => row.operator,
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
          "api/Product/GetAllProductionId?id=" +
          id
      )
      .then((response) => {
        setData(response.data.data);
      });
  };
  const tableStateChange = () => {
    setTableState(true);
  };

  const readerStateFunction = (stateValue) => {
    setReaderState(stateValue);
  };

  const addProduct = async (args) => {
    debugger;
    const addParameters = { qrcode: args, productionId: id };
    await axios
      .post(process.env.REACT_APP_API_ENDPOINT + "api/Product/Add",addParameters)
      .then((res) => {
        if (res.data.success) {
          toastData("Ürün Kaydedildi", true);
          // refreshFunction();
        } else {
          toastData("Ürün Kaydedilemedi !", false);
        }
      })
      .catch((err) => toastData("Ürün Kaydedilemedi !", false));
  };

  const updateState = (e) => {
    console.log(e);
    if (readerState) {
      if (!data.find((obj) => obj === e)) 
         addProduct(e);
      else 
        toastData("Ürün Kodu Daha önce okutulmuş!", false);
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
            PproductionProcess={3}
            screenName="Ürün Giriş"
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
        <div className={"react-dataTable"}>
          <DataTable
            selectableRowsNoSelectAll
            noDataText="Ürün Bulunamadı"
            columns={col}
            data={data}
            pagination
            paginationPerPage={30}
            paginationDefaultPage={currentPage + 1}
          />
        </div>
      </Row>
    </>
  );
}

export default Product;
