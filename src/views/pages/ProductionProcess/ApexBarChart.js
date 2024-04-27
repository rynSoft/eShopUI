// ** Third Party Components
import Chart from "react-apexcharts";
import Flatpickr from "react-flatpickr";
import { Calendar, Check, XOctagon } from "react-feather";
import "@styles/react/libs/charts/apex-charts.scss";
// ** Reactstrap Imports
import {
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Label,
  InputGroup,
  Input,
  Badge,
} from "reactstrap";
import { Fragment, useState } from "react";
import { max } from "moment";
import { toast, Slide } from "react-toastify";
import axios from "axios";
import BarcodeReader from "react-barcode-reader";
import "@styles/base/core/menu/menu-types/vertical-menu.scss";
import toastData from "../../../@core/components/toastData";
import Select from "react-select";
import "@styles/base/core/menu/menu-types/vertical-overlay-menu.scss";
import { useEffect } from "react";

const ApexBarChart = ({
  dataMachine, quantityController,
  scannerController,
  productionId,
  machinaItem,
  changeItem,
  readerStateFunction
}) => {


  useEffect(() => {
    if (changeItem != undefined) {
      modalItemController(changeItem)
    }
  }, [changeItem]);

  const [clickChartData, setClickChartData] = useState(undefined
  );//chart click olayında datayı doldurur  ve o click üzerinde işlem yapar 

  const [materialData, setMaterialData] = useState([
    { id: 0, name: "Hat Yok" },
  ]);

  const [materialDataDetail, setMaterialDataDetail] = useState({
    value: 0,
    label: "Barkod Bulunamadı",
  });

  const [modalShow, setModalShow] = useState(false);
  const [qrCodeState, setQrCodeState] = useState("");
  const [newQrCodeState, setNewQrCodeState] = useState("");
  const [quantity, setQuantity] = useState(undefined);
  const bomKitRepeatList = (machinaItem) => {
    console.log(machinaItem)
    axios
      .get(
        process.env.REACT_APP_API_ENDPOINT +
        "api/SetupVerification/GetMaterialCodeWithBomKit?materialCode=" +
        machinaItem.material +
        "&productionId=" +productionId +"&setNo="+ machinaItem.setNo+"&machineId="+machinaItem.machineId
      )
      .then(function (response) {
        if (response.data.data.length > 0) {
          scannerController(false);
          setMaterialData(response.data.data);
          setMaterialDataDetail({
            value: response.data.data[0].id,
            label: 
              response.data.data[0].material +
              "-" +
              response.data.data[0].partyNumber,
          });
          setModalShow(true);
          setQrCodeState("");
          setNewQrCodeState("");
        } else {
          toastData("Uygun Feeder Bulunamadı", false);
          scannerController(true);
        }
      });
  };
  const modalItemController = (machinaItem) => {
    bomKitRepeatList(machinaItem);
  };


  const saveQrCode = () => {
    let saveData = {
      id:clickChartData.id,
      productionId: productionId,
      machineId: machinaItem,
      partyNumber:newQrCodeState.split("+")[1],
      rollerQuantity:quantity,
      usingQuantity: (clickChartData.rollerQuantity - clickChartData.usingQuantity) < 0 ? (clickChartData.usingQuantity-clickChartData.rollerQuantity) : 0,
      finishQuantity: (clickChartData.rollerQuantity - clickChartData.usingQuantity),
    };
    axios
      .post(
        process.env.REACT_APP_API_ENDPOINT +
        "api/ProductionOperations/ChangeBomKitData",
        saveData
      )
      .then(function (response) {
        if (response.data.success) {
          toastData("Makara Güncellendi", true);
          quantityController(true)//ProductionProcess Productionİtemi tekrar backend den ceker
          setModalShow(false);
          scannerController(true);
          setQrCodeState("");
          setNewQrCodeState("");
          setQuantity("");
        } else {
          toastData("Makara Güncellenemedi", false);
        }
      });

  };

  const options = (maxValue, quantity, changeItem) => {
    return {
      chart: {
        parentHeightOffset: 0,
        toolbar: {
          show: false,
        },
      },


      tooltip: {
        enabled: true,
        enabledOnSeries: undefined,
        shared: true,
        followCursor: false,
        intersect: false,
        inverseOrder: false,
        custom: undefined,

        theme: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            orientation: "vertical",
            position: "center",
          },
        },
      },

      colors: [
        changeItem == 0 ? (quantity ? "#FFEA00" : "#D22B2B") : "#2bb3d2"
       ],
      // dataLabels: {
      //   dropShadow: {
      //     enabled: false,
      //     top: 1,
      //     left: 1,
      //     blur: 1,
      //     color: "#020af5",
      //     opacity: 0.75,
      //   },
      //   style: {
      //     fontSize: "28px",
      //     colors: [quantity ? "#020af5" : "#ffffff "],
      //   },
      //   formatter: function (value, { seriesIndex, dataPointIndex, w }) {

      //     return w.config.series[seriesIndex].name;
      //   },
      // },

      xaxis: {
        categories: [""],
        labels: {
          show: false,
        },
      },
      yaxis: {
        max: maxValue,
        labels: {
          show: false,
        },
      },
    };
  };


  const handleError = (error) => {
    console.log("Error " + error);
  };

  const updateState = (e) => {


    if (qrCodeState == "") {
   
      var filterMaterial = materialData.filter(
        (x) => x.material + "+" + x.partyNumber == e && x.state==true
      );
      if (filterMaterial.length > 0) {
        setQrCodeState(e);
      } else {
        toastData("Uygun Feeder Bulunamadı", false);
      }
    }
    else {

      const myArray = e.toString().split("+");
      var filterMaterial = materialData.filter((x) => x.material == myArray[0] && x.state==true);

      if (filterMaterial.length > 0) {
        setNewQrCodeState(e);
      } else {
        toastData("Uygun Feeder Bulunamadı", false);
      }
    }

  };

  return (
    <div style={{ marginLeft: 10, marginRight: 10 }}>
      <BarcodeReader
        onError={handleError}
        onScan={(err, result) => {
          if (!readerStateFunction) {
            updateState(err.replace("*", "-").replace("*", "-"));
          }

        }}
      />
      <Modal
        isOpen={modalShow}
        toggle={() => {
          setModalShow(false), setQrCodeState(""), setNewQrCodeState(""), scannerController(true);
        }}
        className="modal-dialog-centered modal-lg"
        contentClassName="pt-0"
      >
        <ModalHeader
          className="mb-1"
          toggle={() => {
            setQuantity(""), setModalShow(false), setQrCodeState(""), setNewQrCodeState(""), scannerController(true);
          }}
          tag="div"
        >
          <h1 className="modal-title"> Malzeme Kodu</h1>
        </ModalHeader>
        <ModalBody className="flex-grow-1">
          <Row style={{ textAlign: "center" }}>
            {qrCodeState === "" ? (<Fragment>
              <Badge color='light-warning' style={{fontSize:50}} >
            {materialDataDetail.label}
              </Badge>
              <span style={{fontSize:40}}>    Barkodunu Okutunuz!</span></Fragment>
            ) :


              newQrCodeState == "" ? (<Fragment>
                <Badge color='light-info' style={{fontSize:50}}  >
                  {qrCodeState.split('+')[0]}
                </Badge>
                <span style={{fontSize:40}}>   Yeni Feeder Barkodunu Okutunuz!</span></Fragment>
              ) : (
                <span >
                  {" "}
                  <div className="mb-1">

                    <Label className="form-label" for="Hat" style={{fontSize:30}}>
                      Feeder: {newQrCodeState}
                    </Label>
                    <div>
                      <Badge color='light-success' className='ms-50' style={{fontSize:30}}>
                        Başarılı
                      </Badge>
                    </div>

                  </div>
                  <div className="mb-1">
                    <Label className="form-label" for="Hat" style={{fontSize:30}}> 
                      Miktar
                    </Label>
                    <Input
                      id='Miktar'
                      placeholder='Miktar'
                      type="number"
                      style={{fontSize:30}}
                      onChange={(event) => setQuantity(event.target.value)}
                      value={quantity}
                    />
                  </div>
                </span>
              )
            }

          </Row>

          {qrCodeState !== "" && newQrCodeState !== "" ? (
            <Col xs={12} className="text-center mt-2 pt-50">
              <Button
              style={{fontSize:30}}
                className="me-1"
                color="primary"
                onClick={() => saveQrCode()}
              >
                Kaydet
              </Button>
            </Col>
          ) : null}
        </ModalBody>
      </Modal>


      <Col sm={12} style={{ zoom: "50%", minHeight: window.screen.availHeight * 0.95 }}>
        <Row >
          {dataMachine.map((machina, index) => (
            machina.machineId == machinaItem ? <Col
              sm={2}
              style={{
                textAlign: "center", cursor: "pointer", borderStyle: "double double double double", borderColor: "blue",
                borderWidth: 1,
              }}
              key={index}


              onClick={() => {
                if (machina.changingBomKitInfoId == 0) {

                    setClickChartData(machina);
                    scannerController(false);
                    modalItemController(machina);
                }
                else {
                  toastData("Makara Değişikliği Mevcut", false)
                }

              }}
            >
              <Row>
                <Col sm={1} style={{ transform: "rotate(-180deg)", fontSize: 30, writingMode: "vertical-rl", textAlign: "center" }}>{machina.material}</Col>

                <Col sm={10} style={{ marginLeft: -30 }}>
                  <span style={{ marginLeft: 10, fontSize: 30 }}>
                    {machina.rollerQuantity}{" | "}
                    {machina.decrease}{" | "}
                    {machina.rollerQuantity - machina.usingQuantity}
                  </span>
                  <div style={{ marginTop: -25 }}>
                    <Chart

                      options={options(machina.rollerQuantity,

                        ((machina.rollerQuantity - machina.usingQuantity <= machina.rollerQuantity * 0.1) ||
                          (machina.rollerQuantity - machina.usingQuantity <= machina.decrease))&&
                          machina.changingBomKitInfoId == 0
                          ? false : true, machina.changingBomKitInfoId)}
                      series={[
                        {
                          name: machina.material,
                          data: [
                            machina.rollerQuantity -
                            machina.usingQuantity,
                          ],
                        },
                      ]}
                      type="bar"
                      height={300}
              

                    /> </div>
                  <span style={{ fontSize: 30 }}>Set-No : {machina.setNo}</span></Col>

                <Col sm={1} style={{ transform: "rotate(-180deg)", fontSize: 30, writingMode: "vertical-rl", textAlign: "center", marginLeft: -40 }}>
                   {machina.partNumber} - {machina.siraNo} </Col>
              </Row>
            </Col> : null
          ))}
        </Row>
      </Col>

      {/* </PerfectScrollbar> */}
    </div>
  );
};

export default ApexBarChart;
