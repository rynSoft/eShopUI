import BarcodeReader from "react-barcode-reader";
import React, { useState, useEffect, Fragment } from "react";
import { Table, Row, Col, ButtonGroup, Button, Nav } from "reactstrap";
import axios from "axios";
import TimerCalculate from "../TimerCalculate/TimerCalculate.js";
import { Check, CheckCircle, Printer, XOctagon } from "react-feather";


import { useSelector, useDispatch } from "react-redux";
import DetailModal from "./DetailModal.js";
import { workingActive, workingPassive } from "../../../redux/refreshData";
import ExportPdf from "../../../@core/components/gridTable/ExportPdf/exportPdf.js";
import ExportExcel from "../../../@core/components/gridTable/ExportExcel/index.js";
import toastData from "../../../@core/components/toastData/index.js";
function Provision(props) {
  const newWorking = useDispatch();
  const userWorkingList = useSelector((state) => state.refreshData.workingList);
  useEffect(() => {

    let processWorking = userWorkingList.filter(
      (x) =>
        x.productionId == props.match.params.id && x.productionProcess === 2
    );
    if (processWorking.length > 0) {
      axios
        .get(
          process.env.REACT_APP_API_ENDPOINT +
          "api/Account/UpdateTaskAsync?Id=" +
          processWorking[0].id
        )
        .then((response) => {
          newWorking(workingActive());
        });
    }
  }, [userWorkingList]);



  const [readerState, setReaderState] = React.useState(false);
  const readerStateFunction = (stateValue) => {
    setReaderState(stateValue);
  };


  const [data, setData] = React.useState([]);
  const [finishData, setFinishData] = React.useState(false);
  const [tableState, setTableState] = React.useState(false);
  const [lastReadData, setlastReadData] = React.useState("");
  const [rowData, setRowData] = React.useState();
  const [modalState, modalStateChange] = React.useState(false);
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
        "api/BomKitInfo/GetAllAsyncProductId?id=" +
        id
      )
      .then((response) => {
        setData(response.data);
        const kitProvidedController = response.data.find(
          (obj) => obj.isKitProvided === 0
        );
        if (kitProvidedController === undefined) {
          setFinishData(true);
        }
      });
  };

  const updateKitInfo = (arg) => {
    axios.put(
      process.env.REACT_APP_API_ENDPOINT + "api/BomKitInfo/Update",
      arg
    );
  };

  const StartedProductionLog = (arg) => {
    axios.put(
      process.env.REACT_APP_API_ENDPOINT + "api/ProductionLog/Add",
      arg
    );
  };

  const tableStateChange = () => {
    setTableState(true);
  };

  const PauseLog = (arg) => {
    axios.put(
      process.env.REACT_APP_API_ENDPOINT + "api/BomKitInfo/Update",
      arg
    );
  };

  const ResumeLog = (arg) => {
    axios.put(
      process.env.REACT_APP_API_ENDPOINT + "api/BomKitInfo/Update",
      arg
    );
  };

  const barcodController = (e, isKitValue) => {
    const newState = data.map((obj) => {
      if (obj.id === e.id && obj.isKitProvided === 0)
        return {
          id: obj.id,
          material: obj.material,
          explanation: obj.explanation,
          partyNumber: obj.partyNumber,
          quantity: obj.quantity,
          description: obj.description,
          unit: obj.unit,
          soureProductPlace: obj.soureProductPlace,
          isKitProvided: isKitValue,
          IsKitPreperated: obj.isKitPreperated,
          wareHouseCode: obj.wareHouseCode,
          wareHouseId: obj.wareHouseId,
        };
      return obj;
    });

    e.isKitProvided = isKitValue;
    updateKitInfo(e);

    toastData(e.material + " - " + e.partyNumber + " Başarıyla Okutuldu", true);
    setData(newState);
    const kitProvidedController = newState.find(
      (obj) => obj.isKitProvided === 0
    );
    if (kitProvidedController === undefined) {
      toastData("Tüm Barkodlar Okutuldu", true);
      setFinishData(true);
    }
    modalStateChange(false);
  };

  const newWareHouse = (Name, Code) => {
    const parameters = {
      productionId: id,
      wareHouseDtoU: {
        code: Code,
        name: Name,
      },
    };

    axios
      .post(
        process.env.REACT_APP_API_ENDPOINT + "api/WareHouse/AddNewBarcode",
        parameters
      )
      .then((res) => {
        if (res.data.success) {
          loadData();
          toastData("Depo Güncellendi Lütfen Tekrar Barkod Okutunuz !", false);
        }
      });
  };
  const buttonRowUpdate = (e) => {
    if (readerState) {
      setRowData(e);
      modalStateChange(true);
    } else {
      toastData("Barkod Okutmadan İş Akışını Başlatınız!", false);
    }
  };

  const updateState = (e) => {
    if (readerState) {
      let lastReadDatas;

      let tempDatas = data.filter(
        (obj) =>
          obj.material + "+" + obj.partyNumber === e && obj.isKitProvided === 0
      );

      if (tempDatas.length >= 1) {
        // Listede bir den fazla ürün varsa ,lk okunan urun bilgisini state atıp depo okutmasını bekliyoruz
        lastReadDatas = e;

        toastData(e.split("+")[0] + " Depo Barkodunu Okutunuz!", true);
        setlastReadData(lastReadDatas);
      } else if (lastReadData == "" && tempDatas.length === 0) {
        toastData("Malzeme Bulunamadı", false);
      }

      if (lastReadData != "") {

        let lastDatas = data.filter(
          (obj) =>
            obj.material + "+" + obj.partyNumber === lastReadData &&
            obj.wareHouseCode === e.replace("-", "*") &&
            obj.isKitProvided === 0
        );

        if (lastDatas.length >= 1) {
          barcodController(lastDatas[0], 1);
          setlastReadData("");
        } else {
          let barcodeData = e.split("+");
          let splitData = barcodeData[1].replace("*", "-");
          var Controller = splitData.indexOf("DEPO");
          if (Controller == -1) {
            splitData = "DEPO-" + splitData;
          }

          newWareHouse(splitData, e.replace("-", "*"));
        }
      }
    } else {
      toastData("Barkod Okutmadan İş Akışını Başlatınız!", false);
    }
  };
  return (
    <Fragment><Row>
      <DetailModal
        modalState={modalState}
        modalStateChange={modalStateChange}
        modalDetailRow={rowData}
        modalRowFunc={barcodController}
      />
      <Col xl="12" md="12" xs="12" style={{ minHeight: 100 }}>
        <TimerCalculate
          finishController={finishData}
          tableController={tableStateChange}
          cols={{ xl: "12", sm: "12", xs: "12" }}
          PproductionProcess={2}
          screenName="Kit Hazırlama"
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
        {tableState ? (
          <Table responsive style={{ marginTop: 10 }} size="sm">
            <thead>
              <tr>
                <th >Malzeme</th>
                <th>Parti Numarası</th>
                <th>Kaynak Stok Depo</th>
                <th>Açıklama</th>

                <th>Miktar</th>
                <th>Birim</th>

                <th>Not</th>
                <th style={{ textAlign: "right" }}>
                  <Button.Ripple
                    outline
                    className="btn-icon rounded-circle pull-right"
                    color="danger"
                    onClick={() => {
                      ExportPdf(data,"UrunHazırlamaRaporu","DEPO ÜRÜN HAZIRLAMA RAPORU");
                    }}
                  >
                    <Printer size={12} />
                  </Button.Ripple>
                  <Button.Ripple
       
                    outline
                    className="btn-icon rounded-circle pull-right"
                    color="success"
                    style={{ marginLeft: 5 }}
                    onClick={() => {
                      ExportExcel(data,"UrunHazırlamaRaporu","DEPO ÜRÜN HAZIRLAMA RAPORU");
                    }}
                  >
                    <Printer size={12} />
                  </Button.Ripple>
                </th>
              </tr>
            </thead>
            <tbody >
              {data.map((obj) =>
                obj.isKitProvided == 1 ? (
                  <tr
                    style={{ backgroundColor: "green", color: "white" }}
                    key={`${obj.id}`}
                  >
                    <td style={{ color: "white" }}>{obj.material}</td>
                    <td style={{ color: "white" }}>{obj.partyNumber}</td>
                    <td style={{ color: "white" }}>{obj.soureProductPlace}</td>
                    <td style={{ color: "white" }}>{obj.explanation}</td>
                    <td style={{ color: "white" }}>{obj.quantity}</td>
                    <td style={{ color: "white" }}>{obj.unit}</td>
                    <td style={{ color: "white" }}>{obj.description}</td>
                    <td></td>
                  </tr>
                ) : obj.isKitProvided == 2 ? (
                  <tr
                    style={{ backgroundColor: "	#FFEA00" }}
                    key={`${obj.id}`}
                  >
                    <td style={{ color: "black" }}>{obj.material}</td>
                    <td style={{ color: "black" }}>{obj.partyNumber}</td>
                    <td style={{ color: "black" }}>{obj.soureProductPlace}</td>
                    <td style={{ color: "black" }}>{obj.explanation}</td>
                    <td style={{ color: "black" }}>{obj.quantity}</td>
                    <td style={{ color: "black" }}>{obj.unit}</td>
                    <td style={{ color: "black" }}>{obj.description}</td>
                    <td style={{ color: "black" }}></td>
                  </tr>
                ) : obj.isKitProvided == 3 ? (
                  <tr
                    style={{ backgroundColor: "#11599d" }}
                    key={`${obj.id}`}
                  >
                    <td style={{ color: "white" }}>{obj.material}</td>
                    <td style={{ color: "white" }}>{obj.partyNumber}</td>
                    <td style={{ color: "white" }}>{obj.soureProductPlace}</td>
                    <td style={{ color: "white" }}>{obj.explanation}</td>
                    <td style={{ color: "white" }}>{obj.quantity}</td>
                    <td style={{ color: "white" }}>{obj.unit}</td>
                    <td style={{ color: "white" }}>{obj.description}</td>
                    <td></td>
                  </tr>
                ) : (
                  <tr
                    style={{ backgroundColor: "transparent" }}
                    key={`${obj.id}`}
                  >
                    <td>{obj.material}</td>
                    <td>{obj.partyNumber}</td>
                    <td>{obj.soureProductPlace}</td>
                    <td>{obj.explanation}</td>
                    <td>{obj.quantity}</td>
                    <td>{obj.unit}</td>
                    <td>{obj.description}</td>
                    <td style={{ textAlign: "right" }}>
                      <Button.Ripple
                        className="btn-icon pull-right"
                        color="secondary"
                        onClick={() => {
                          buttonRowUpdate(obj);
                        }}
                      >
                        <CheckCircle size={12} />
                      </Button.Ripple>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </Table>
        ) : null}
      </Row>
    </Fragment>
  );
}

export default Provision;
