import BarcodeReader from "react-barcode-reader";
import React, { useState, useEffect, Fragment } from "react";
import { Table, Row, Col, ButtonGroup, Button, Nav } from "reactstrap";
import axios from "axios";
import TimerCalculate from "../TimerCalculate/TimerCalculate.js";
import { Check, CheckCircle, Printer, XOctagon } from "react-feather";
import { useSelector, useDispatch } from "react-redux";
import { workingActive, workingPassive } from "../../../redux/refreshData";
import toastData from "../../../@core/components/toastData/index.js";


function Product(props) {
  const [data, setData] = React.useState([]);
  const [finishData, setFinishData] = React.useState(false);
  const [tableState, setTableState] = React.useState(false);
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

  // const rowBarcodController = (e, isKitValue) => {
  //   const newState = data.map((obj) => {
  //     if (obj.id === e.id && obj.isKitPreperated === 0) {
  //       return {
  //         id: obj.id,
  //         material: obj.material,
  //         explanation: obj.explanation,
  //         partyNumber: obj.partyNumber,
  //         quantity: obj.quantity,
  //         description: obj.description,
  //         unit: obj.unit,
  //         soureProductPlace: obj.soureProductPlace,
  //         isKitPreperated: isKitValue,
  //         isKitProvided: obj.isKitProvided,
  //       };
  //     }
  //     return obj;
  //   });

  //   e.isKitPreperated = isKitValue;
  //   toastData(e.material + " - " + e.partyNumber + " Başarıyla Okutuldu", true);
  //   updateKitInfo(e);


  // const buttonRowUpdate = (e) => {
  //   if (readerState) {
  //     setRowData(e);
  //   }
  //   else {
  //     toastData("Barkod Okutmadan İş Akışını Başlatınız!", false);
  //   }
  // };

  const initialData = async () => {
    await axios.get(process.env.REACT_APP_API_ENDPOINT +"api/Product/GetAllProductionId?id=" + id)
      .then((response) => {
            setData(response.data);
      });
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

      <Row>   
      <div className={'react-dataTable'} >
            <DataTable
                selectableRowsNoSelectAll
                columns={col}
                data={data}
                pagination
                paginationPerPage={15}
                paginationDefaultPage={currentPage + 1}
            />
        </div>
      </Row>

    </>
  );
}

export default Product;
