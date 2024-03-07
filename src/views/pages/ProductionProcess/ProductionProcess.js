import BarcodeReader from "react-barcode-reader";
import React, { useState, useEffect, Fragment, useContext } from "react";
import {
  Table,
  Row,
  Col,
  ButtonGroup,
  Button,
  Nav,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavItem, NavLink
} from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import axios from "axios";
import TimerCalculate from "../TimerCalculate/TimerCalculate.js";
import { AlertTriangle, AlignJustify, Check, CheckCircle, Cloud, CloudLightning, CloudOff, Compass, Printer, X, XOctagon } from "react-feather";
import DetailModal from "./DetailModal.js";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { toast, Slide } from "react-toastify";
import Avatar from "@components/avatar";
import ApexBarChart from "../ProductionProcess/ApexBarChart";
import { ThemeColors } from "@src/utility/context/ThemeColors";
import StopProcessModal from "./StopProcessModal.js";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import BomKitJoinPanelCode from "./BomKitJoinPanelCode.js";
import { workingActive, workingPassive } from "../../../redux/refreshData";
import { useSelector, useDispatch } from "react-redux";
import toastData from "../../../@core/components/toastData/index.js";
function ProductionProcess(props) {
  const newWorking = useDispatch();
  const [productionItem, setProductionItem] = React.useState([]);
  const [modalDetail, setModalDetail] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [data, setData] = React.useState([]);
  const [finishData, setFinishData] = React.useState(false);
  const [tableState, setTableState] = React.useState(false);
  const [readerState, setReaderState] = React.useState(false);
  const [lastReadData, setlastReadData] = React.useState("");
  const [verificationId, setVerificationId] = useState(0);
  const [machinaId, setMachinaId] = useState(-1);
  const [lineId, setLineId] = useState(-1);
  const [productionMachineMatchId, setProductionMachineMatchId] = useState(-1);
  const userWorkingList = useSelector((state) => state.refreshData.workingList);

  useEffect(() => {
    let processWorking = userWorkingList.filter(
      (x) =>
        x.productionId == props.match.params.id && x.productionProcess === 5
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

  const [changeItem, setChangeItem] = useState(undefined);
  const [shiftTargetParametersId, setShiftTargetParametersId] = useState(null);
  const [scannerControl, setScannerControl] = useState(true);
  const { colors } = useContext(ThemeColors);

  const [qrCodeStartDate, setQrCodeStartDate] = useState(Date.now());
  const readerStateFunction = (stateValue) => {

    setQrCodeStartDate(Date.now())
    setReaderState(stateValue);
  };

  const getProductionItem = () => {

    axios.get(
      process.env.REACT_APP_API_ENDPOINT +
      "api/SetupVerification/GetAllAsyncProductMachineItem?id=" +
      id
    )
      .then((response) => {
        if (response.data.length > 0) {

          setVerificationId(response.data[0].setupVerificationId);
          setProductionItem(response.data);

        }
      });
  };
  const [startButtonDisabled, setStartButtonDisabled] = useState(true);

  const [productionTime, setProductionTime] = useState("");// makine bazlı gecen sür
  const [startProcessCount, setStartProcessCount] = useState(0);// makine bazlı gecen süre
  useEffect(() => {

    if (productionItem.length > 0 && productionItem != -1) {

      let data = productionItem[0]?.productionMachineMatch?.find(xy => xy.productionMachineMatchId == productionMachineMatchId);
      let startProcessCount = productionItem[0]?.productionMachineMatch.find(xy => xy.startDate != null && xy.endDate == null);
      setStartProcessCount(startProcessCount)



    }
    if (data != null && data.state) {
      setStartButtonDisabled(true)
      setProductionTime(data.gecenSure)
    }
    else {
      setProductionTime("");
      setStartButtonDisabled(false)
    }
  }, [productionItem, productionMachineMatchId]);//Start Buton Kontrolü ve geçen süreyi Gösterir Yapar



  const [ProductionMachineList, setProductionMachineList] = useState([]);
  const getProductionMachineList = () => {
    axios
      .get(
        process.env.REACT_APP_API_ENDPOINT +
        "api/SetupVerification/GetAllProductionMachineDetailList?id=" +
        id
      )
      .then((response) => {
      
        if (response.data.length > 0) {
          setProductionMachineList(response.data);
          setActiveTab(response.data[0].machineId);
          setProductionMachineMatchId(response.data[0].productionMachineMatchId);
          setMachinaId(response.data[0].machineId);
          setLineId(response.data[0].lineId)
        }
      });
  };



  const [id, setId] = useState(props.match.params.id);
  const [stopModal, setStopModal] = useState(false);
  useEffect(() => {
    axios.get(process.env.REACT_APP_API_ENDPOINT + "api/ShiftTargetParameters/GetToday?userId=" + userData.id).then(res => {
      if (res.data.data) {
        setShiftTargetParametersId(res.data.data.id);
      }
    })
  }, [modalDetail])

  const handleExportPDF = (data) => {
    Date.prototype.today = function () {
      return (
        (this.getDate() < 10 ? "0" : "") +
        this.getDate() +
        "-" +
        (this.getMonth() + 1 < 10 ? "0" : "") +
        (this.getMonth() + 1) +
        "-" +
        this.getFullYear()
      );
    };

    // For the time now
    Date.prototype.timeNow = function () {
      return (
        (this.getHours() < 10 ? "0" : "") +
        this.getHours() +
        "." +
        (this.getMinutes() < 10 ? "0" : "") +
        this.getMinutes() +
        "." +
        (this.getSeconds() < 10 ? "0" : "") +
        this.getSeconds()
      );
    };
    data.map((element) => {
      docDefinition.content[1].table.body.push([
        {
          text: element.material,
          style: element.isKitPreperated ? "KitSuccess" : "KitDanger",
        },
        {
          text: element.explanation,
          style: element.isKitPreperated ? "KitSuccess" : "KitDanger",
        },
        {
          text: element.partyNumber,
          style: element.isKitPreperated ? "KitSuccess" : "KitDanger",
        },
        {
          text: element.quantity,
          style: element.isKitPreperated ? "KitSuccess" : "KitDanger",
        },
        {
          text: element.isKitPreperated ? "TAMANLANDI" : "TAMAMLANMADI",
          style: element.isKitPreperated ? "KitSuccess" : "KitDanger",
        },
      ]);
    });

    //Getting Current Date And Time
    var newDate = new Date();

    var datetime = newDate.today() + " " + newDate.timeNow();
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake
      .createPdf(docDefinition)
      .download(datetime + " - UrunDogrulama.pdf");
  };
  const handleError = (error) => {
    console.log("Error " + error);
  };

  useEffect(() => {
    getProductionMachineList();
  }, []);

  useEffect(() => {
    if (!stopModal) {
      getProductionItem();
    }



  }, [stopModal]);

  const machineStart = () => {
    if (startProcessCount > 2) {
      toastData("Aynı Anda 2 Makina Çalışabilir", false)
    }
    else {
      let machineDataStart = {
        id: productionMachineMatchId,
        state: true,
        productionId: props.match.params.id,
        machineId: machinaId,
        startDate: new Date()
      };
      axios.post(
        process.env.REACT_APP_API_ENDPOINT + "api/ProductionMachineMatch/Update",
        machineDataStart
      ).then((response) => {
        toastData("İş Akışı Başlatıldı", true)
        setProductionItem(dumyData);
        getProductionItem();
      });
      let dumyData = productionItem.slice();
      if (dumyData.length > 0) {
        dumyData[0].productionMachineMatch.find(xy => xy.productionMachineMatchId == productionMachineMatchId).state = true;
      }
    }

  };

  const machineStop = () => {

    setStopModal(true);

  }


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
  const CloseBtn = (
    <X
      className="cursor-pointer"
      onClick={() => setModalShow(false)}
      size={15}
    />
  );
  const scannerControllerItem = (item) => {
    setScannerControl(item);
  };
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [keycontrol, setKeyControl] = useState(0);

  const [modalDetailId, setModalDetailId] = useState(0);
  const toggle = () => {
    if(!readerState){
      setDropdownOpen((prevState) => !prevState)
    }
    else{
      toastData("İş Akışını Durdurunuz!",false)
    }
    }
  const [modalShow, setModalShow] = useState(false);
  const [modalItem, setModalItem] = useState(false);
  const [activeTab, setActiveTab] = useState(-1);

  const quantityController = (responseData) => {
    if (responseData) {
      setProductionItem([]);
      getProductionItem();
    } else {
      let dumyProductionItem = [];
      productionItem.map((item) => {

        if (item.rollerQuantity - item.usingQuantity > 0) {
          item.usingQuantity =
            item.usingQuantity + item.decrease;
          dumyProductionItem.push(item);
          if (
            (item.rollerQuantity - item.usingQuantity <= item.rollerQuantity * 0.1) || (item.rollerQuantity - item.usingQuantity <= item.decrease) &&
            item.changingBomKitInfoId == 0
          ) {
            setModalShow(true);
            item.Kalan = item.rollerQuantity - item.usingQuantity;
            setModalItem(item);
            // toastData(item.material + "+" + item.partNumber + " Azaldı !", undefined);
          }// azalan miktarları kontrol eder yüzde 10 nun altında veya  decrease miktarının altındaysa kullancııya uyarı verir
        }
      });
      setProductionItem(dumyProductionItem);
    }
  };

  return (
    <>
      <DetailModal modalState={modalDetail} machineId={machinaId} modalStateChange={setModalDetail} modalDetailId={modalDetailId} productionId={id} lineId={lineId} />
      <StopProcessModal modalState={stopModal} machineId={machinaId} modalStateChange={setStopModal} productionMachineMatchId={productionMachineMatchId} productionId={id} toastData={toastData} />


      <Modal isOpen={modalShow}

        className="modal-dialog-centered modal-sm"
        contentClassName="pt-0">

        <ModalHeader

          close={CloseBtn}
          tag="div"
        >
          <h5 className="modal-title">Feeder Kontrol</h5>
        </ModalHeader>
        <ModalBody className="flex-grow-1">
          <Card>
            <CardBody>
              <div className="mb-1 text-left">
                <span>
                  SetNo : {modalItem?.setNo}
                </span>
              </div>
              <div className="mb-1 text-left">
                <span>
                  Malzeme : {modalItem?.material}
                </span>
              </div>
              <div className="mb-1 text-left">
                <span>
                  Kalan Miktar : {modalItem?.Kalan}
                </span>
              </div>
            </CardBody>
          </Card>
          <Row>
            <Col sm={6}>
              <div className="text-center">
                <Button
                  color="secondary"
                  onClick={() => { setModalShow(false), scannerControllerItem(false), setChangeItem(modalItem) }}
                  outline
                >
                  Ekle
                </Button>
              </div>
            </Col>
            <Col sm={6}>
              <div className="text-center">
                <Button
                  color="secondary"
                  onClick={() => setModalShow(false)}
                  outline
                >
                  Tamam
                </Button>
              </div>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      <Col xl="12" md="12" xs="12" style={{ height: 85 }}>
        <TimerCalculate
          key={modalDetail}
          finishController={finishData}
          tableController={tableStateChange}
          cols={{ xl: "12", sm: "12", xs: "12" }}
          PproductionProcess={5}
          screenName="Üretim Bandı"
          readerStateFunction={readerStateFunction}
        />
      </Col>
      <Row>
        <Col sm={8} key={keycontrol}>

          <Card style={{ height: window.innerHeight * 0.68 }}>
            <CardBody style={{ marginTop: -20 }}>
              <Nav className="justify-content-left" tabs>
                {ProductionMachineList.map((machina, index) => {
                  return <NavItem key={machina.machineId}>
                    <NavLink
                      active={activeTab == machina.machineId}
                      onClick={() => {
                        {
                          console.log(machina)
                          setActiveTab(machina.machineId)
                          setMachinaId(machina.machineId)
                          setProductionMachineMatchId(machina.productionMachineMatchId)
                          setChangeItem(undefined)
                        }

                      }}
                    >
                      {machina.machineName} {machina.jobName}
                    </NavLink>
                  </NavItem>
                })}

              </Nav>

              <PerfectScrollbar
                options={{ wheelPropagation: false, suppressScrollX: true }}

                style={{ height: window.screen.height <= 800 ? 450 : window.screen.height > 1200 ? 700 : 560 }}
              >
                <ApexBarChart

                  key={activeTab}
                  readerStateFunction={scannerControl}
                  changeItem={changeItem}
                  direction={"rtl"}
                  info={colors.primary.main}
                  productionId={id}
                  machinaItem={machinaId}
                  dataMachine={productionItem}
                  quantityController={quantityController}
                  scannerController={scannerControllerItem}
                />
                <Row >
                  <Col sm={6}> Geçen Süre: {productionTime} Sn.</Col>
                  <Col sm={6}>               <div style={{ textAlign: "right", marginTop: -10, marginRight: "-15px" }} >

                    <Button color="success" disabled={startButtonDisabled} onClick={() => {
                      {
                        machineStart()
                      }

                    }}> Başla</Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button color="danger"
                      onClick={() => {
                        {
                          machineStop()
                        }
                      }}
                    > Bitir</Button>
                    &nbsp;&nbsp;
                    <div style={{ textAlign: "left" }}>

                    </div>
                  </div></Col>
                </Row>
              </PerfectScrollbar>




            </CardBody>
          </Card>
        </Col>

        <Col sm={4}>
          <Card style={{ height: window.innerHeight * 0.68 }}>
            <Row style={{ width: "100%" }}>
              <Col sm={11}>   <Nav className="justify-content-left" tabs >
                {ProductionMachineList.map((machina, index) => {
                  return <NavItem key={machina.machineId}>
                    <NavLink
                      active={activeTab == machina.machineId}
                      onClick={() => {
                        {
                          setActiveTab(machina.machineId)
                          setChangeItem(undefined)
                          setMachinaId(machina.machineId)
                          setProductionMachineMatchId(machina.productionMachineMatchId)
                        }
                      }}
                    >
                      {machina.machineName} {machina.jobName}
                    </NavLink>
                  </NavItem>
                })}

              </Nav></Col>
              <Col sm={1} style={{ textAlign: "right", }}>            <div style={{ float: "right", textAlign: "right", marginRight: -15, marginTop: 10 }}>
                <Dropdown isOpen={dropdownOpen} toggle={toggle} direction="end">
                  <DropdownToggle tag="a">
                    <AlignJustify />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={() => { setModalDetailId(1), setModalDetail(true) }}><CloudLightning size={16} /> Süre Sınırı Aşılanlar</DropdownItem>
                    <DropdownItem onClick={() => { setModalDetailId(2), setModalDetail(true) }}><Cloud size={16} /> Değişen Feederlar</DropdownItem>
                    <DropdownItem onClick={() => { setModalDetailId(3), setModalDetail(true) }}><CloudOff size={16} /> Tamamlanmayan Feederlar</DropdownItem>
                    <DropdownItem onClick={() => { setModalDetailId(4), setModalDetail(true) }}><Compass size={16} /> Vardiya Başlat-Bitir</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div></Col>
            </Row>
            <BomKitJoinPanelCode
              shiftTargetParametersId={shiftTargetParametersId}
              key={activeTab}
              machineId={machinaId}
              qrCodeStartDate={qrCodeStartDate}
              setQrCodeStartDate={setQrCodeStartDate}
              id={verificationId}
              productionId={id}
              scannerControl={scannerControl}
              readerState={readerState}
              currentBomData={productionItem}
              quantityController={quantityController}
            />



          </Card>
        </Col>
      </Row>


    </>
  );
}

export default ProductionProcess;
