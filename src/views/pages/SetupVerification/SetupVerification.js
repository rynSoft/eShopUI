import BarcodeReader from "react-barcode-reader";
import React, { useState, useEffect, Fragment } from "react";
import {
  Table,
  Row,
  Col,
  ButtonGroup,
  Button,
  Nav,
  Card,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  CardBody,
  CardTitle,
  Label,
  UncontrolledTooltip,
  Breadcrumb,
  BreadcrumbItem,
  Modal,
  ModalHeader,
  ModalBody,
  InputGroup,
  Input,
} from "reactstrap";
import axios from "axios";
import TimerCalculate from "../TimerCalculate/TimerCalculate.js";
import {
  Check,
  Printer,
  XOctagon,
  DownloadCloud,
  Circle,
  CheckCircle,
  Underline,
  PlusSquare,
  X,
  Save,
} from "react-feather";
import { toast, Slide } from "react-toastify";
import XLSX from "xlsx";
import Select from "react-select";
import { useDropzone } from "react-dropzone";
import Avatar from "@components/avatar";
import ExportPdf from "../../../@core/components/gridTable/ExportPdf/exportPdf.js";
import { useSelector, useDispatch } from "react-redux";
import { workingActive, workingPassive } from "../../../redux/refreshData";
import toastData from "../../../@core/components/toastData/index.js";
import ExportExcel from "../../../@core/components/gridTable/ExportExcel/index.js";
let firsCode = undefined;
let bomKitFirstCode = undefined;


function SetupVerification(props) {
  const newWorking = useDispatch();
  const [dataType, setDataType] = useState("Database");
  const [lineData, setLineData] = useState([]);

  const [dataDizgiMachineInfo, setdataDizgiMachineInfo] = useState([]);
  const [machineTabList, setMachineTabList] = useState([]);
  useEffect(() => {
    if (dataType === "Database" && dataDizgiMachineInfo.length > 0) {
      let machineSetup = machineData.filter(x => dataDizgiMachineInfo.find(dizgi => dizgi.machineId == x.id));

      setMachineTabList(machineSetup);
    }
  }, [dataDizgiMachineInfo, dataType]);
  const userWorkingList = useSelector((state) => state.refreshData.workingList);
  useEffect(() => {
    let processWorking = userWorkingList.filter(
      (x) =>
        x.productionId == props.match.params.id && x.productionProcess === 4
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

  const [buttonCompleted, setButtonCompleted] = useState(false);
  const [readerState, setReaderState] = React.useState(false);
  const [active, setActive] = useState("1");
  const [counterLed, setCounterLed] = useState(1);
  const [activeMachine, setActiveMachine] = useState(1);
  const [modalController, setModalController] = useState(false);
  const [saveButton, setSaveButton] = useState(true);
  const [counter, setCounter] = useState(0);
  const [counterValue, setCounterValue] = useState(5);
  const [ledList, setLedList] = useState([]);
  const [ledPanel, setLedPanel] = useState(false);
  const [machineLedCounter, setMachineLedCounter] = useState(-1);
  const [jobName, setJobName] = useState("");

  const readerStateFunction = (stateValue) => {
    setReaderState(stateValue);
  };

  const [dataBomKit, setDataBomKit] = React.useState([]);
  const [machineData, setMachineData] = React.useState([]);
  const [machineDataLine, setMachineDataLine] = React.useState([]);
  const [activeContent, setActiveContent] = React.useState(false);

  const [verificationDetailsData, setVerificationDetailsData] = React.useState([]);
  const [machine, setMachine] = React.useState({
    value: -1,
    label: "Makine Yok",
  });
  const [machineLine, setMachineLine] = React.useState({
    value: -1,
    label: "Hatta Ait Makine Yok",
  });

  const [line, setLine] = React.useState({
    value: -1,
    label: "Hat Yok",
  });

  const [fileName, setfileName] = React.useState("");
  const [machineSelect, setMachineSelect] = React.useState(false);
  const [finishData, setFinishData] = React.useState(false);
  const [tableState, setTableState] = React.useState(false);
  const [lastReadData, setlastReadData] = React.useState("");


  const [value, setValue] = useState("");
  const ErrorToast = () => (
    <Fragment>
      <div className="toastify-header">
        <div className="title-wrapper">
          <Avatar size="sm" color="danger" icon={<X size={12} />} />
          <h6 className="toast-title">Hata!</h6>
        </div>
      </div>
      <div className="toastify-body">
        <span role="img" aria-label="toast-text">
          Seçilen Dosya Formatı Geçersiz
        </span>
      </div>
    </Fragment>
  );
  const [saveBtnState, setSaveButtonState] = useState(false);
  const [id, setId] = useState(props.match.params.id);

  const ToastSuccess = () => (
    <Fragment>
      <div color="success" className="toastify-header pb-0">
        <div className="title-wrapper">
          <Avatar size="sm" color="success" icon={<Check />} />
          <h6 className="toast-title">Feeder Kaydedildi</h6>
        </div>
      </div>
    </Fragment>
  );

  const ToastSuccessCompleted = () => (
    <Fragment>
      <div color="success" className="toastify-header pb-0">
        <div className="title-wrapper">
          <Avatar size="sm" color="success" icon={<Check />} />
          <h6 className="toast-title">İşlem Tamamlandı</h6>
        </div>
      </div>
    </Fragment>
  );
  const ToastDanger = () => (
    <Fragment>
      <div color="danger" className="toastify-header pb-0">
        <div className="title-wrapper">
          <Avatar size="sm" color="danger" icon={<X />} />
          <h6 className="toast-title">Feeder Kaydedilemedi</h6>
        </div>
      </div>
    </Fragment>
  );
  const handleError = (error) => {
    console.log("Error " + error);
  };
  const productionSendToOurOrder = () => {
    let data = {
      productionId: parseInt(id),
      jobName: jobName,
      machineId: machineLine.value,
      setupVerification: dataArrBK,
      fileName: fileName,
    };

    axios
      .post(
        process.env.REACT_APP_API_ENDPOINT +
        "api/CompozingImport/CompozingImport",
        data
      )
      .then(function (response) {
        if (response.status == 200) {
          toast.success(<ToastSuccess />, {
            icon: false,
            autoClose: 3000,
            hideProgressBar: true,
            closeButton: false,
          });
          setMachineSelect(true);
          setSaveButton(true);
          setSaveButtonState(true);
        } else {
          toast.success(<ToastDanger />, {
            icon: false,
            autoClose: 3000,
            hideProgressBar: true,
            closeButton: false,
          });
        }
        loadData();
      })
      .catch(function (error) {
        toast.success(<ToastDanger />, {
          icon: false,
          autoClose: 3000,
          hideProgressBar: true,
          closeButton: false,
        });
      });
  };

  async function setupVerificationBomKits() {
    // let SetupVerificationBomKit = [];

    // dataBomKit.map((obj) => {
    //   SetupVerificationBomKit.push({
    //     rollerQuantity: obj.rollerQuantity,
    //     setNo: obj.setNo,
    //     bomKitInfoId: obj.id,
    //     state: obj.isSetupVerification,
    //     quantity: obj.quantity,
    //     material: obj.material,
    //     partyNumber: obj.partyNumber,
    //   });
    // });

    let data = {
      ProductionId: parseInt(id),
      MachineId: parseInt(machine.value),
      // setupVerificationDetail: SetupVerificationBomKit,
    };

    return Promise.resolve(data);
  }

  const setupVerificationCompleted = () => {
    if (readerState) {
      setButtonCompleted(true);
      setupVerificationBomKits().then((data) => {
        axios
          .post(
            process.env.REACT_APP_API_ENDPOINT +
            "api/SetupVerification/SetupVerificationCompleted",
            data
          )
          .then(function (response) {
            if (response.status == 200) {
              newWorking(workingActive());
              setButtonCompleted(true);
              dataDizgiMachineInfo.map(item => {
                item.machineId == machine.value ? item.isCompleted = true : null
              })
              FinishController();
              toast.success(<ToastSuccessCompleted />, {
                icon: false,
                autoClose: 3000,
                hideProgressBar: true,
                closeButton: false,
              });
            } else {
              setButtonCompleted(false);
              toast.error(<ToastDanger />, {
                icon: false,
                autoClose: 3000,
                hideProgressBar: true,
                closeButton: false,
              });
            }
          })
          .catch(function (error) {
            setButtonCompleted(false);
            toast.error(<ToastDanger />, {
              icon: false,
              autoClose: 3000,
              hideProgressBar: true,
              closeButton: false,
            });
          });
      });
    }

    else {
      toastData("Tamamlamadan Önce İş Akışını Başlatınız!", false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (result) => {
      const reader = new FileReader();
      setfileName(result[0].name);
      reader.onload = function () {
        const fileData = reader.result;
        const wb = XLSX.read(fileData, { type: "binary" });

        wb.SheetNames.forEach(function (sheetName) {
          const rowObj = XLSX.utils.sheet_to_row_object_array(
            wb.Sheets[sheetName],
            { defval: "" }
          );

          rowObj.map((item, index) => {
            rowObj[index].seT_NO = parseInt(item.seT_NO);
            rowObj[index].decrease = parseInt(item.decrease);
          });
          setSaveButton(false);
          setDataType("Excel");
          setdataDizgiMachineInfo(rowObj);
        });
      };
      if (result.length && result[0].name.endsWith("xlsx")) {
        reader.readAsBinaryString(result[0]);
      } else {
        toast.error(<ErrorToast />, { icon: false, hideProgressBar: true });
      }
    },
  });

  /*bom ve kit*/

  /*eslint-disable */
  const headArrBK = dataDizgiMachineInfo.length
    ? dataDizgiMachineInfo.map((col, index) => {
      if (index === 0) return [...Object.keys(col)];
      else return null;
    })
    : [];
  /*eslint-enablea */
  const dataArrBK = value.length
    ? filteredData
    : dataDizgiMachineInfo.length && !value.length
      ? dataDizgiMachineInfo
      : null;

  const toggle = (tab) => {
    setActive(tab);
  };
  const renderTableHeadBK = () => {
    if (headArrBK.length) {
      return headArrBK[0].map((head, index) => {
        if (head != "isVerificated") {
          return <th key={index}>{head}</th>;
        }
      });
    } else {
      return null;
    }
  };
  const lineGetAll = () => {
    axios
      .get(process.env.REACT_APP_API_ENDPOINT + "api/Line/GetAll")
      .then((response) => {
        setLineData(response.data.data);
        setLine({
          value: response.data.data[0].id,
          label: response.data.data[0].name,
        });
        loadLineMachine(response.data.data[0].id);
      });
  };
  useEffect(() => {
    lineGetAll();
    loadDataBomKit();
  }, []);

  const FinishController = () => {
    let setFinishController = dataDizgiMachineInfo.find(x => !x.isCompleted);

    if (setFinishController == undefined) {
      setFinishData(true)
    }
    else {
      setFinishData(false)
    }

  }
  useEffect(() => {
    if (dataDizgiMachineInfo.length > 0) {
      dataDizgiMachineInfo.map((head, index) => {
        if (head.isVerificated && head.setNo <= ledList.length && head.machineId == activeMachine) {
          ledList[head.setNo - 1].value = "Aktif";
        }
      });
      setCounter(counter + 25);
    }

    FinishController();

    let completedButton = dataDizgiMachineInfo.find(x => !x.isVerificated && x.machineId == activeMachine);

    if (completedButton) {

      setButtonCompleted(true);
    }
    else {
      let completedButtonControl = dataDizgiMachineInfo.find(x => x.isCompleted && x.machineId == activeMachine);
      if (completedButtonControl) {
        setButtonCompleted(true);
      }
      else {
        setButtonCompleted(false);
      }

    }
  }, [dataDizgiMachineInfo, ledList, activeMachine]);

  useEffect(() => {

    let dumyLedList = [];
    if (machineLedCounter > 0) {
      for (let index = 0; index < machineLedCounter; index++) {
        dumyLedList.push({ key: index + 1, value: "Pasif" });
      }
      setLedList(dumyLedList);
    }
  }, [machineLedCounter, counterLed]);


  useEffect(() => {

    axios
      .get(process.env.REACT_APP_API_ENDPOINT + "api/Machine/GetAll")
      .then((response) => {
        if (response.data.data.length > 0) {
          setMachineData(response.data.data);
          setMachine({
            value: response.data.data[0].id,
            label: response.data.data[0].name,
          });

        }
      });

  }, []);

  const loadLineMachine = (id) => {
    axios
      .get(process.env.REACT_APP_API_ENDPOINT + "api/Machine/GetByLineId?id=" + id)
      .then((response) => {
        if (response.data.data.length > 0) {
          setMachineDataLine(response.data.data);
          setMachineLine({
            value: response.data.data[0].id,
            label: response.data.data[0].name,
          });
          setMachineLedCounter(
            response.data.data[0]
              ?.ledNumber
          );
        }
      });
  };



  useEffect(() => {
    if (machineData.length > 0) {
      loadData();
    }
  }, [machineData]);

  const loadDataBomKit = () => {
    axios
      .get(
        process.env.REACT_APP_API_ENDPOINT +
        "api/BomKitInfo/GetAllAsyncProductId?id=" +
        id
      )
      .then((response) => {
        setDataBomKit(response.data);
        const setupVerificationController = response.data.find(
          (obj) => !obj.isSetupVerification
        );
        const setupVerificationControllerCompleted = response.data.find(
          (obj) => !obj.isCompleted
        );
        if (setupVerificationControllerCompleted === undefined) {
          setFinishData(true);
        }
      });
  };

  const loadData = () => {
    axios
      .get(
        process.env.REACT_APP_API_ENDPOINT +
        "api/CompozingImport/GetAllAsyncProductId?id=" +
        id
      )
      .then((response) => {
        if (response.data.length > 0) {
          setJobName(response.data[0].jobName)
          let machine = machineData.filter(
            (x) => x.id === response.data[0].machineId
          );
          setdataDizgiMachineInfo(response.data);
          setMachine({
            value: machine[0].id,
            label: machine[0].name,
          });
          setMachineLine({
            value: machine[0].id,
            label: machine[0].name,
          });
          setLine({
            value: response.data[0].lineId,
            label: response.data[0].lineName,
          });
          setMachineLedCounter(machine[0].ledNumber);
          setMachineSelect(true);
          setDataType("Database");
          setSaveButtonState(true);
          setActiveMachine(machine[0].id)//bunu  tab control için  0 elemanı ilk göstermesi için

        }
        setActiveContent(true);
      });
  };

  const updateKitInfo = (arg) => {

    axios.put(
      process.env.REACT_APP_API_ENDPOINT + "api/BomKitInfo/Update",
      arg
    );
  };

  const updateSetupVerificationInfo = (arg) => {
    axios.put(
      process.env.REACT_APP_API_ENDPOINT +
      "api/CompozingImport/Update?id=" +
      arg + "&rollerQuantity=" + firsCode.rollerQuantity + "&bomKitId=" + bomKitFirstCode.id + "&setNo=" + firsCode.setNo
    ).then(res => {
      toastData(bomKitFirstCode.material + " - " + bomKitFirstCode.partyNumber + " Başarıyla Okutuldu", true);

    });
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
      onClick={() => setModalController(false)}
      size={15}
    />
  );

  const colorLedController = (rowData) => {

    if (rowData.setNo - 1 <= ledList.length && rowData.machineId == machineLine.value) {
      ledList[rowData.setNo - 1].value = "Yeni";
      setCounter(counter + 1);
      setTimeout(() => {
        ledList[rowData.setNo - 1].value = "Degis";
        setCounter(counter + 2);
      }, 500);
      setTimeout(() => {
        ledList[rowData.setNo - 1].value = "Yeni";
        setCounter(counter + 3);
      }, 1000);
      setTimeout(() => {
        ledList[rowData.setNo - 1].value = "Aktif";
        setCounter(counter + 4);
      }, 1500);
    }
  };

  const updateFeeder = () => {
    if (counterValue != undefined && counterValue != "") {
      if (firsCode != undefined) {
        colorLedController(firsCode);

        const newState = dataDizgiMachineInfo.map((obj) => {
          if (obj.id === firsCode.id && !obj.isVerificated) {
            return {
              id: obj.id,
              setNo: obj.setNo,
              barcode: obj.barcode,
              decrease: obj.decrease,
              bomKitInfo: bomKitFirstCode,
              // rollerQuantity: counterValue,
              rollerQuantity: obj.rollerQuantity,
              isVerificated: true,
              machineId: obj.machineId,
              machineName: obj.machineName,
            };
          }
          return obj;
        });
        firsCode.isVerificated = true;
        updateSetupVerificationInfo(parseInt(firsCode.id));
        setdataDizgiMachineInfo(newState);
      }

      const newStateBomKit = dataBomKit.map((obj) => {
        if (obj.id === bomKitFirstCode.id && !obj.isSetupVerification) {
          return {
            id: obj.id,
            material: obj.material,
            explanation: obj.explanation,
            partyNumber: obj.partyNumber,
            quantity: obj.quantity,
            rollerQuantity: firsCode.rollerQuantity,
            description: obj.description,
            unit: obj.unit,
            soureProductPlace: obj.soureProductPlace,
            isSetupVerification: true,
            isKitProvided: obj.isKitProvided,
            isKitPreperated: obj.isKitPreperated,
            setNo: firsCode?.setNo,
          };
        }
        return obj;
      });
      bomKitFirstCode.isSetupVerification = true;
      bomKitFirstCode.setNo = firsCode?.setNo;

      bomKitFirstCode.rollerQuantity = firsCode.rollerQuantity;



      setDataBomKit(newStateBomKit);

      // let verificationDetails ={
      //   id: bomKitFirstCode.id,
      //   quantity: bomKitFirstCode.quantity,
      //   rollerQuantity: counterValue,
      //   barcode: bomKitFirstCode.material + "-" + bomKitFirstCode.partyNumber,
      //   setNo: firsCode.setNo,
      // };
      // setVerificationDetailsData(current => [...current, verificationDetails]);

      const kitProvidedControllerBomKit = newStateBomKit.find(
        (obj) => !obj.isSetupVerification
      );
      if (kitProvidedControllerBomKit === undefined) {
        toastData("Tüm BomKit Listesi Okutuldu", true);

        setFinishData(true);
      }
      const bomKitController = dataBomKit.find(
        (obj) => !obj.isSetupVerification
      );

      const kitPreperatedController = dataDizgiMachineInfo.find(
        (obj) => !obj.isVerificated && obj.machineId == activeMachine
      );

      if (
        kitPreperatedController === undefined
      ) {
        toastData("Makineye Ait Tüm Feederlar Okutuldu", true);
        // setButtonCompleted(false)
        // setFinishData(true);
      }
      // setCounterValue("");
      setModalController(false);
    }
    else {
      toastData("Makara Sayısı Boş", false)
    }
  }

  const setLineControl = (ky) => {
    let keyıD = ky.lineId;
    let machineId = ky.id;
    setJobName(dataDizgiMachineInfo.find(x => x.machineId == machineId).jobName);
    let datas = lineData.find(p => p.id == keyıD)
    setLine({
      value: datas.id,
      label: datas.name,
    });
    setMachineLine({
      value: ky.id,
      label: ky.name,
    })

  } //tab control
  const updateState = (e) => {
    if (readerState) {
      let productCode = e.replace(".", "-").replace(".", "-").split("+")[0];
      firsCode = dataDizgiMachineInfo.find(
        (obj) => obj.barcode == productCode && !obj.isVerificated && obj.machineId == machineLine.value
      );

      bomKitFirstCode = dataBomKit.find(
        (obj) =>
          obj.material + "+" + obj.partyNumber === e.replace(".", "-").replace(".", "-") && !obj.isSetupVerification
      );

      if (firsCode === undefined) {
        toastData("Feeder Bulunamadı", false);
      } else {
        if (bomKitFirstCode != undefined) {
          // setModalController(true);
          updateFeeder();
        }
        else {
          toastData("uygun BomKit Bulunamadı", false);
        }
      }

    } else {
      toastData("Barkod Okutmadan İş Akışını Başlatınız!", false);
    }
  };

  return (
    <Fragment>
      {activeContent ?
        <Fragment>
          {saveBtnState ? (
            <Col xl="12" md="12" xs="12" style={{ minHeight: 100 }}>
              <TimerCalculate
                finishController={finishData}
                tableController={tableStateChange}
                cols={{ xl: "12", sm: "12", xs: "12" }}
                PproductionProcess={4}
                screenName="Setup  Verification"
                readerStateFunction={readerStateFunction}
              />
            </Col>
          ) : null}

          <BarcodeReader
            onError={handleError}
            onScan={(err, result) => {
              updateState(err.replace("*", "-").replace("*", "-"));
            }}
          />
          {saveButton ? null : (
            <div>
              <div className="content-header row">
                <div className="content-header-left col-md-9 col-12 mb-2"></div>

                <div className="content-header-right text-md-end col-md-3 col-12 d-md-block d-none">
                  <div className="breadcrumb-right">
                    <Button.Ripple
                      className="btn-icon"
                      color="primary"
                      id="newProductionOrder"
                      onClick={productionSendToOurOrder}
                    >
                      <PlusSquare size={20} />
                    </Button.Ripple>
                    <UncontrolledTooltip
                      placement="left"
                      target="newProductionOrder"
                    >
                      Feeder Kaydet
                    </UncontrolledTooltip>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Card style={{ marginTop: 10 }}>

            <CardBody>
              {/* {machineTabList.length < 4 ? */}
              
              <div
                {...getRootProps({
                  className:
                    "dropzone mt-1 mb-2 className='justify-content-end mx-0",
                })}
              >
                <input {...getInputProps()} />
                <div className="d-flex align-items-center justify-content-center flex-column" style={{ cursor: "pointer" }}>
                  <DownloadCloud size={64} />
                  <h5>Dosya sürükle ya da seçmek için tıkla</h5>
                </div>
              </div> 
              
              {/* : null} */}

              {dataType === "Database" && machineTabList != null && machineTabList.length > 0 ? (

                <Row className={"mt-2"}>
                  <Col>
                    <Nav className="justify-content-center" tabs>
                      {machineTabList.map((mk, index) => {
                        return <NavItem key={mk.id}>
                          <NavLink
                            active={activeMachine == mk.id}
                            onClick={() => {
                              {

                                setActiveMachine(mk.id)
                                setMachine({
                                  value: mk.id,
                                  label: mk.name,
                                });

                                setLineControl(mk);

                                setMachineLedCounter(mk.ledNumber);
                                setCounterLed(counterLed + 1);

                              }

                            }}
                          >

                            {mk.name}  {dataDizgiMachineInfo.find(dizgi => dizgi.machineId == mk.id).jobName}
                          </NavLink>
                        </NavItem>
                      })}
                    </Nav>

                  </Col>
                </Row>
              ) : null}

              {dataDizgiMachineInfo != null && dataDizgiMachineInfo.length > 0 ? (
                <Fragment>
                  {saveBtnState ? null : (
                    <hr
                      style={{
                        height: 3,
                      }}
                    />
                  )}

                  <Row>
                    <Col
                      sm={{
                        offset: 4,
                        order: 2,
                        size: 4,
                      }}
                    >
                      <Row>
                        <Col
                          xs={7}
                          style={{ paddingRight: window.screen.width / 41 }}
                        >
                          <Table responsive bordered width={450}>
                            <thead>
                              <tr>
                                <th width="100%" style={{ textAlign: "right" }}>
                                  Hat Adı
                                </th>
                              </tr>
                              <tr>
                                <th width="100%" style={{ textAlign: "right" }}>
                                  Makine Adı
                                </th>
                              </tr>
                              <tr>
                                <th width="100%" style={{ textAlign: "right" }}>
                                  İş Adı
                                </th>
                              </tr>
                            </thead>
                          </Table>
                        </Col>
                        <Col
                          style={{
                            width: "50%",
                            marginLeft: -(window.screen.width / 32),
                          }}
                          xs={6}
                        ><div >
                            <Select
                              isDisabled={dataType != "Excel"}
                              isClearable={false}
                              className="react-select"
                              classNamePrefix="select"
                              options={lineData.map((option) => ({
                                value: option.id,
                                label: option.name,
                              }))}
                              value={line}
                              onChange={(event) => {
                                setLine({
                                  value: event.value,
                                  label: event.label,
                                });
                                loadLineMachine(event.value);

                              }}
                            />
                          </div>
                          <div style={{ width: "100%", marginTop: 3 }} >
                            <Select
                              isDisabled={dataType != "Excel"}
                              isClearable={false}
                              className="react-select"
                              classNamePrefix="select"
                              options={machineDataLine.map((option) => ({
                                value: option.id,
                                label: option.name,
                              }))}
                              value={machineLine}
                              onChange={(event) => {
                                setMachineLine({
                                  value: event.value,
                                  label: event.label,
                                });
                                setMachineLedCounter(
                                  machineData.filter((xr) => xr.id == event.value)[0]
                                    ?.ledNumber
                                );
                              }}

                            />
                          </div>
                          <Input disabled={dataType != "Excel"} id='jobName' placeholder='İş Adı' style={{ marginTop: 3 }} onChange={(event) => setJobName(event.target.value)}
                            value={jobName} />
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Row>
                    <Col
                      sm={{
                        offset: 4,
                        order: 2,
                        size: 4,
                      }}
                    ></Col>
                  </Row>
                  <Card className="text-center" style={{ marginTop: 30 }}>
                    <CardTitle> Feeder Tasarımı</CardTitle>
                    {/* <Button
                  onClick={() => {
                    updateState("UMT-0000-0437")
                    // (ledList[Math.floor(Math.random() * 16)].value = true), setCounter(counter+1);
                  }}
                >
                  trueyap
                </Button> */}
                    <Row sm={12} key={counter}>
                      {ledList.map((number) => (
                        <Col
                          key={number.key}
                          sm={1}
                          style={{
                            borderStyle: "double double double double",
                            borderWidth: 1,
                          }}
                        >
                          <Row>
                            <Label> {number.key}</Label>
                          </Row>

                          <Avatar
                            color={
                              number.value === "Aktif"
                                ? "light-success"
                                : number.value === "Pasif"
                                  ? "light-danger"
                                  : number.value === "Yeni"
                                    ? "light-warning"
                                    : "light-secondary"
                            }
                            icon={
                              number.value === "Aktif" ? (
                                <CheckCircle size={14} />
                              ) : (
                                <Circle size={14} />
                              )
                            }
                          />
                        </Col>
                      ))}
                    </Row>
                  </Card>
                  <hr
                    style={{
                      height: 3,
                    }}
                  />
                </Fragment>
              ) : null}




              {dataDizgiMachineInfo != null && dataDizgiMachineInfo.length > 0 ? (
                <Row className={"mt-2"}>
                  <Col>
                    <Nav className="justify-content-center" tabs>
                      <NavItem>
                        <NavLink
                          active={active === "1"}
                          onClick={() => {
                            toggle("1");
                          }}
                        >
                          Feeder Ürün Yer Bilgisi
                        </NavLink>
                      </NavItem>

                      <NavItem>
                        <NavLink
                          active={active === "2"}
                          onClick={() => {
                            toggle("2");
                          }}
                        >
                          BomKit Bilgisi
                        </NavLink>
                      </NavItem>
                      {/* <NavItem>
                    <NavLink
                      active={active === "3"}
                      onClick={() => {
                        toggle("3");
                      }}
                    >
                      Uretim Bilgisi
                    </NavLink>
                  </NavItem> */}
                    </Nav>
                    <TabContent className="py-50" activeTab={active}>
                      <TabPane tabId="1">
                        <Table responsive size="sm">
                          <thead>
                            {dataType === "Database" ? (
                              <tr>
                                <th>MAKİNE ADI</th>
                                <th>SETNO</th>
                                <th>BARCODE</th>
                                <th>ROLLERQUANTİTY</th>
                                <th>DECREASE</th>
                                <th style={{ textAlign: "right" }}>
                                  <Button.Ripple
                                    outline
                                    className="btn-icon rounded-circle pull-right"
                                    color="danger"
                                    onClick={() => {
                                      ExportPdf(dataDizgiMachineInfo, "UrunHazırlamaRaporu", "DEPO ÜRÜN HAZIRLAMA RAPORU- SETUP DOĞRULAMA(FEEDER)");
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
                                      ExportExcel(dataDizgiMachineInfo, "UrunHazırlamaRaporu", "SETUP DOĞRULAMA(FEEDER)");
                                    }}
                                  >
                                    <Printer size={12} />
                                  </Button.Ripple>
                                </th>
                              </tr>
                            ) : (
                              <tr>
                                <th>SETNO</th>
                                <th>BARCODE</th>
                                <th>DECREASE</th>
                                <th>ROLLERQUANTİTY</th>
                              </tr>
                            )}
                          </thead>
                          <tbody>
                            {dataDizgiMachineInfo.map((obj, index) => {
                              return obj?.machineId == activeMachine ? obj?.id ? (
                                obj.isVerificated ? (
                                  <tr
                                    style={{
                                      backgroundColor: "green",
                                      color: "white",
                                    }}
                                    key={`${obj.id}`}
                                  >
                                    <td style={{ color: "white" }}>{obj.machineName}</td>
                                    <td style={{ color: "white" }}>{obj.setNo}</td>
                                    <td style={{ color: "white" }}>{obj.barcode}</td>
                                    <td style={{ color: "white" }}>{obj.rollerQuantity}</td>
                                    <td style={{ color: "white" }}>{obj.decrease}</td>
                                    <td></td>
                                  </tr>
                                ) : (
                                  <tr
                                    style={{
                                      backgroundColor: "transparent",
                                      color: "black",
                                    }}
                                    key={`${obj.id}`}
                                  >
                                    <td></td>
                                    <td style={{ color: "white" }}>{obj.machineName}</td>
                                    <td style={{ color: "white" }}>{obj.setNo}</td>
                                    <td style={{ color: "white" }}>{obj.barcode}</td>
                                    <td style={{ color: "white" }}>{obj.rollerQuantity}</td>
                                    <td style={{ color: "white" }}>{obj.decrease}</td>
                                  </tr>
                                )
                              ) : (
                                <tr
                                  style={{
                                    backgroundColor: "transparent",
                                    color: "black",
                                  }}
                                  key={`${index}`}
                                >
                                  <td>{obj.seT_NO}</td>
                                  <td>{obj.partS_NAME}</td>
                                  <td>{obj.decrease}</td>
                                  <td>{obj.rolleR_QUANTITY}</td>
                                </tr>
                              ) : dataType == "Excel" ? <tr
                                style={{
                                  backgroundColor: "transparent",
                                  color: "black",
                                }}
                                key={`${index}`}
                              >
                                <td>{obj.seT_NO}</td>
                                <td>{obj.partS_NAME}</td>
                                <td>{obj.decrease}</td>
                                <td>{obj.rolleR_QUANTITY}</td>
                              </tr> : null
                            }

                            )}
                          </tbody>
                        </Table>
                      </TabPane>
                      <TabPane tabId="2">
                        <Table responsive size="sm">
                          <thead>
                            <tr>
                              <th>Malzeme</th>
                              <th>Parti Numarası</th>
                              <th>Kaynak Stok Depo</th>
                              <th>Açıklama</th>

                              <th>Miktar</th>
                              <th>Birim</th>

                              <th style={{ textAlign: "right" }}>
                                <Button.Ripple
                                  outline
                                  className="btn-icon rounded-circle pull-right"
                                  color="danger"
                                  onClick={() => {
                                    ExportPdf(dataBomKit, "UrunHazırlamaRaporu", "DEPO ÜRÜN HAZIRLAMA RAPORU - SETUP DOĞRULAMA(BOMKİT)");
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
                                    ExportExcel(dataBomKit, "UrunHazırlamaRaporu", "SETUP DOĞRULAMA(BOMKİT)");
                                  }}
                                >
                                  <Printer size={12} />
                                </Button.Ripple>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {dataBomKit.map((obj) =>
                              obj.isSetupVerification ? (
                                <tr
                                  style={{
                                    backgroundColor: "green",
                                    color: "white",
                                  }}
                                  key={`${obj.id}`}
                                >
                                  <td style={{ color: "white" }}>{obj.material}</td>
                                  <td style={{ color: "white" }}>{obj.partyNumber}</td>
                                  <td style={{ color: "white" }} >{obj.soureProductPlace}</td>
                                  <td style={{ color: "white" }}>{obj.explanation}</td>
                                  <td style={{ color: "white" }}>{obj.quantity}</td>
                                  <td style={{ color: "white" }}>{obj.unit}</td>

                                  <td></td>
                                </tr>
                              ) : (
                                <tr
                                  style={{
                                    backgroundColor: obj.isKitProvided == 2 ? "yellow" : "transparent",
                                    color: "black",
                                  }}
                                  key={`${obj.id}`}
                                >
                                  <td style={{ color: obj.isKitProvided == 2 ? "black" : null }}>{obj.material}</td>
                                  <td style={{ color: obj.isKitProvided == 2 ? "black" : null }}>{obj.partyNumber}</td>
                                  <td style={{ color: obj.isKitProvided == 2 ? "black" : null }}>{obj.soureProductPlace}</td>
                                  <td style={{ color: obj.isKitProvided == 2 ? "black" : null }}>{obj.explanation}</td>
                                  <td style={{ color: obj.isKitProvided == 2 ? "black" : null }}>{obj.quantity}</td>
                                  <td style={{ color: obj.isKitProvided == 2 ? "black" : null }}>{obj.unit}</td>

                                  <td></td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </Table>
                      </TabPane>
                      {/* <TabPane tabId="3">
                    <Table>
                      <thead>

                        <tr>
                    
                          <th>SETNO</th>
                          <th>BARCODE</th>
                          <th>QUNATİTY</th>
                          <th>ROLLERQUANTİTY</th>
                     
                        </tr>

                


                      </thead>
                      <tbody>
                        {verificationDetailsData.map((obj, index) =>

                          <tr
                            style={{
                              backgroundColor: "transparent",
                              color: "black",
                            }}
                            key={`${obj.id}`}
                          >

                            <td>{obj.setNo}</td>
                            <td>{obj.barcode}</td>
                            <td>{obj.quantity}</td>
                            <td>{obj.rollerQuantity}</td>
                         
                          </tr>


                        )}

                      </tbody>
                    </Table>
                  </TabPane> */}
                    </TabContent>
                  </Col>
                </Row>
              ) : null}
              {saveBtnState && dataType == "Database" ? (
                <div>
                  <div className="content-header row">
                    <div className="content-header-left col-md-9 col-12 mb-2"></div>

                    <div className="content-header-left text-md-end col-md-3 col-12 d-md-block d-none">
                      <div className="breadcrumb-left">
                        <Button.Ripple
                          disabled={buttonCompleted}
                          className="btn-icon"
                          color="primary"
                          id="newProductionOrder"
                          onClick={setupVerificationCompleted}
                        >
                          <CheckCircle size={20} /> Tamamla
                        </Button.Ripple>
                        <UncontrolledTooltip
                          placement="left"
                          target="newProductionOrder"
                        >
                          Tamamla
                        </UncontrolledTooltip>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </CardBody>
          </Card>

          <Modal


            isOpen={modalController}
            className="modal-dialog-centered modal-s"
            contentClassName="pt-0"
          // toggle={() => {setModalController(false),setCounterValue("")}}
          >
            <ModalHeader className="mb-1" close={CloseBtn} tag="div">
              <h5>Makara Sayısı</h5>
            </ModalHeader>


            <ModalBody style={{ textAlign: "center" }}>

              <div className='mb-1'>
                <Label className='form-label' for='code'>
                  Makara Sayısı
                </Label>
                <InputGroup>

                  <Input
                    id='code'
                    maxLength={8}

                    type="text"
                    placeholder="Makara Sayısı"
                    onChange={(event) => {
                      var pattern = /^\d+\.?\d*$/;
                      if (event.target.value.match(pattern) != null) {

                        setCounterValue(event.target.value)
                      }

                      else {
                        setCounterValue(event.target.value.slice(0, -1))
                      }

                    }}
                    value={counterValue}
                  />
                </InputGroup>
              </div>        <div className="text-center">
                <Button className="me-1" color="primary" onClick={() => updateFeeder()}>
                  Onay
                </Button>
                <Button
                  color="secondary"
                  outline
                // onClick={() =>{ setModalController(false),setCounterValue("")}}
                >
                  İptal
                </Button>
              </div>
            </ModalBody>

          </Modal>

        </Fragment> : null}
    </Fragment>

  );
}

export default SetupVerification;
