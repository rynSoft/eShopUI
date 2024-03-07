import BarcodeReader from "react-barcode-reader";
import React, { useState, useEffect, Fragment } from "react";
import {
  Table,
  Row,
  Col,
  ButtonGroup,
  Button,
  Nav,
  CardBody,
  Card,
  Label,
  Input,
  CardFooter,
  CardText,
  Modal,
  ModalHeader,
  ModalBody,
  Badge,
} from "reactstrap";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Check, ChevronDown, Info, XOctagon } from "react-feather";
import { dateFormat, serverDateFormat } from "../../../utility/Constants";
import ReactPaginate from "react-paginate";
import CustomPagination from "../../../@core/components/gridTable/CustomPagination";
import toastData from "../../../@core/components/toastData";
let timeControl = 0;
let socketController = false;
let socket = new WebSocket("ws://" + process.env.REACT_APP_SOCKET_URL + "/QrCodeRead");
function BomKitJoinPanelCode(props) {
  const [modalShow, setModalShow] = useState(false);
  const [userRole, setUserRole] = useState();
  const { qrCodeStartDate, setQrCodeStartDate, machineId,shiftTargetParametersId } = props
  const [data, setData] = React.useState([]);
  const [rowCount, setRowCountCount] = useState(window.screen.height < 801 ? 5 : 8);
  const [totalPanel, setTotalPanel] = React.useState({ toplamPanelSayisi: 0, toplamGecenSure: 0 });
  const [totalMachinePanel, setTotalMachinePanel] = React.useState({ toplamPanelSayisi: 0, toplamGecenSure: 0 });
  const [modalTitle, setModalTitle] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [qrCodeSecond, setQrCodeSecond] = useState(0);
  useEffect(() => {
    if (searchValue === "") {
      loadData();
    } else {
      filterData();
    }
  }, [searchValue, machineId]);
  const getUserData = () =>


    useEffect(() => {
      let timeTotal = 0
      data.map((item) => timeTotal = timeTotal + item.gecenSure)
      setTotalTımePanel((timeTotal))
    }, [data]);
  useEffect(() => {
    setUserRole(JSON.parse(localStorage.getItem('userData')).roles[0])
  }, [])
  useEffect(() => {

    productionDetail();
  }, []);
  const [productionEstimated, setEstimatedTime] = useState(10);
  const productionDetail = () => {
    axios
      .get(
        process.env.REACT_APP_API_ENDPOINT +
        "api/Production/GetById?id=" +
        props.productionId
      )
      .then((response) => {
        setEstimatedTime(
          response.data.estimatedTime ? response.data.estimatedTime : 10
        );
      });
  };

  const loadData = () => {
    if (machineId) {
      axios
        .get(
          process.env.REACT_APP_API_ENDPOINT +
          "api/ProductionOperations/GetAllAsyncProductionMachineAndProduction?productionId=" +
          props.productionId + "&machineId=" + machineId
        )
        .then((response) => {

          setData(response.data.data)
        });
    }
    panelTime();

  };

  const panelTime = () => {
    axios
      .get(
        process.env.REACT_APP_API_ENDPOINT +
        "api/ProductionOperations/GetAllProductionTimeDetailMachine?productionId=" +
        props.productionId + "&machineId=" + machineId
      )
      .then((response) => {

        setTotalMachinePanel(response.data.data)
      });

    axios
      .get(
        process.env.REACT_APP_API_ENDPOINT +
        "api/ProductionOperations/GetAllProductionTimeDetail?productionId=" +
        props.productionId
      )
      .then((response) => {

        setTotalPanel(response.data.data)
      });
  }

  const filterData = () => {
    axios
      .get(
        process.env.REACT_APP_API_ENDPOINT +
        "api/ProductionOperations/GetFilterAsyncProductionId?id=" +
        props.productionId +
        "&Code=" +
        searchValue
      )
      .then((response) => {
        setData(response.data.data);
      });
  };

  const readerStateFunction = (stateValue) => {
    setReaderState(stateValue);
  };


  const NoDataConst = "Panel Kaydı Mevcut Değil";
  const NoDataConstLog = "Log Kaydı Yok";

  const [dataLog, setDataLog] = React.useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPageLog, setCurrentPageLog] = useState(0);

  const [filteredData, setFilteredData] = useState([]);

  // const [id, setId] = useState(1);

  const handleError = (error) => {
    console.log("Error " + error);
  };

  const ExpandableTable = ({ data }) => {
    return (
      <div className="expandable-content p-2">
        <Row style={{ width: "100%" }}>
          <Col xs={1}></Col>
          <Col xs={10}>
            <DataTable
              noHeader
              pagination
              data={dataLog}
              className="react-dataTable"
              sortIcon={<ChevronDown size={10} />}
              paginationComponent={() => CustomPagination(dataLog, currentPageLog, (value) => setCurrentPageLog(value))}
              paginationDefaultPage={currentPageLog + 1}
              paginationRowsPerPageOptions={[10, 25, 50, 100]}
              noDataComponent={NoDataConstLog}
              style={{ textAlign: "center" }}
            />
          </Col>
          <Col xs={1}></Col>
        </Row>
      </div>
    );
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

  let status = true;
  const [socketMessageErrorShow, setSocketMessageErrorShow] = useState(false);
  const [isMountedState, setIsMounted] = useState(true);


  const interval = setInterval(() => {
    if (socket.readyState === 3) {
      socket = new WebSocket("ws://" + process.env.REACT_APP_SOCKET_URL + "/QrCodeRead");
      socketController = true;
    }
    if (socketController && socket.readyState === 1) {
      setSocketMessageErrorShow(false);
      socketController = false;
      window.location.reload(false);
    } else if (socketController) {
      setSocketMessageErrorShow(true);
    }
  }, 1000);

  useEffect(() => {

    socket.onmessage = function incoming(data) {
      console.log(data.data);
      updateState(data.data)
    };
  }, [props.readerState]);




  const updateState = (e) => {
    if (props.scannerControl) {
      if (props.readerState) {
        const isFound = data.find((obj) => obj.qrCode === e);

        if (!isFound) {
          addProductionOperations(e.replace("ç", ".").replace("ç", "."));
        } else {
          toastData("Panel Kodu Daha Önceden Kaydedilmiş", false);
        }
      } else {
        toastData("Barkod Okutmadan İş Akışını Başlatınız! !", false);
      }
    }
  };

  const TimeCalculator = () => {
    const DateNow = Date.now();
    if (qrCodeStartDate !== "") {
      var one_day = 1000;
      var difference_ms = DateNow - qrCodeStartDate;
      setQrCodeStartDate(DateNow);
      setQrCodeSecond(Math.round(difference_ms / one_day));
      return Math.round(difference_ms / one_day);
    } else {
      setQrCodeStartDate(DateNow);
      return 0;
    }
  };

  const addProductionOperations = (e) => {

    //let ss = [{ bomKitInfoId: 1 },{ bomKitInfoId: 2 },{ bomKitInfoId: 3 },{ bomKitInfoId: 4 }];
    let timeSecond = TimeCalculator();
    let addParameters = {
      qrCode: e,
      machineId: machineId,
      productionId: parseInt(props.productionId),
      feedlerData: '',
      shiftTargetParametersId:shiftTargetParametersId,
      setupVerificationId: props.id,
      operationProcess: 1,
      gecenSure: timeSecond,
    };

    axios
      .post(
        process.env.REACT_APP_API_ENDPOINT + "api/ProductionOperations/Add",
        addParameters
      )
      .then((res) => {

        if (res.data.success) {

          props.quantityController(res.data.data);//false yada true dönüyor deger olarak

          if (machineId == res.data.data.machineId) {

            // if (data.length > 50) {
            //   let dumyData = data;
            //   dumyData.pop();
            //   dumyData.unshift({ qrCode: e.substr(1), gecenSure: "-"});
            //   dumyData[1].gecenSure=
            //   setData([]);
            //   setData(dumyData);
            // } else {
            //   setData((data) => [{ qrCode: e.substr(1), gecenSure: "-" }, ...data]);
            // }
            loadData();
          }
          else {
            panelTime();
          }


          if (timeSecond > productionEstimated + productionEstimated * 0.1) {
            const addParameters = {
              lastTime: 0,
              currentTime: timeSecond,
              productionId: props.productionId,
              message: "Tahmini Geçiş Süresi Aşıldı. " + timeSecond + " sn.",
            };
            axios.post(
              process.env.REACT_APP_API_ENDPOINT + "api/ProductionOperationsTimeLog/Add",
              addParameters
            );
          }

          toastData("Panel Kayıt Edildi", true);


        } else
          toastData("Panel Kodu Daha Önceden Kaydedilmiş ", false);
      });

  };

  const [qrCodeDetail, setCodeQrCode] = React.useState([]);
  const openQrCode = (e) => {

    setModalTitle(e);
    axios.get(process.env.REACT_APP_API_ENDPOINT +
      "api/ProductionOperations/GetAllQrCodeDetail", { params: { productionId: props.productionId, code: e.toString(), machineId: props.machineId } })
      .then((response) => {

        if (response.data.data) {
          setCodeQrCode(response.data.data);
          setModalShow(true);
        }
        else {
          toastData("Detay Bulunamadı !", false);
        }

      });
  };

  const columns = [
    {
      name: "Panel Kodu",
      sortable: true,
      width: "250px",
      selector: (row) => row.qrCode,
    },
    {
      name: "Süre (sn.)",
      sortable: true,
      width: "150px",
      selector: (row, index) => row.gecenSure == 0 ? "-" : row.gecenSure + 1,
      //selector: (row, index) =>  row.gecenSure,
 
    },
    {
      name: "Tarih/Saat",
      sortable: true,
      selector: (row, index) => new Date(row.createDate).toLocaleDateString() +" "+ new Date(row.createDate).toLocaleTimeString() ,
      width: "200px",
 
    },
    {
      name: "",
      allowOverflow: true,
      maxWidth: "50px",
      cell: (row) => {
        return (
          <div className="d-flex" style={{ textAlign: "right" }}>
            <Button.Ripple
              className="btn-icon"
              color="flat-primary"
              onClick={() => openQrCode(row.qrCode)}
            >
              <Info size={18} />
            </Button.Ripple>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Modal isOpen={socketMessageErrorShow && userRole != 'sistemadmin'} backdrop="static" className="modal-dialog-centered modal-sm">
        <ModalHeader>
          Sistemsel Hata
        </ModalHeader>
        <ModalBody className="pb-3 px-sm-3 text-center">Soket Servislerine Erişilemiyor</ModalBody>
      </Modal>
      {/* <BarcodeReader
        onError={(err, result) => {
          updateState(err.replace("*", "-").replace("*", "-"));
        }}
        onScan={(err, result) => {
          (err.length > 20 && err.length <= 26) ?
            updateState(err.replace("*", "-").replace("*", "-")) : null;
        }}
      /> */}
      {userRole != 'sistemadmin' ? <Badge color={socketMessageErrorShow ? 
        "light-danger" : "light-success"}> Soket Erişimi </Badge> : null}

      <Card>

        <Row className="justify-content-end mx-0">
          <Col
            className="d-flex align-items-center justify-content-end mt-1"
            md="12"
            sm="12"
          >
            <Label className="me-1" for="search-input-1">
              {" "}
              {"Ara"}{" "}
            </Label>
            <Input
              className="dataTable-filter mb-50"
              type="text"
              bsSize="sm"
              id="search-input-1"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </Col>
        </Row>

        <div className="react-dataTable" style={{ zoom: "80%" }}>
          <DataTable
            noHeader
            pagination
            columns={columns}
            className="react-dataTable"
            sortIcon={<ChevronDown size={15} />}
            paginationPerPage={rowCount}
            paginationComponent={() => CustomPagination(searchValue.length ? filteredData : data, currentPage, (value) => setCurrentPage(value))}

            paginationDefaultPage={currentPage + 1}
            expandableRowsComponent={ExpandableTable}
            data={data}
            noDataComponent={NoDataConst}
          />
        </div>

        <CardFooter>
          <Row>
          <Col sm={6} style={{ textAlign: "left", paddingLeft: 20 }}>
              <CardText className="mb-0">
                Geçen Panel Sayısı: {totalMachinePanel.toplamPanelSayisi}
              </CardText>
              Toplam Süre : {totalMachinePanel.toplamGecenSure} Sn.
              <CardText className="mb-0">
                Ortalama Geçiş Süresi : {totalMachinePanel.toplamPanelSayisi>0 ? parseInt(totalMachinePanel.toplamGecenSure / totalMachinePanel.toplamPanelSayisi) +" Sn." : 0 +" Sn."} 
              </CardText>
            </Col>
            <Col sm={6} style={{ textAlign: "right" }}>
              {" "}
              <CardText className="mb-0">
                Toplam Geçen Panel : {totalPanel.toplamPanelSayisi}

              </CardText>
              Toplam Süre : {totalPanel.toplamGecenSure} Sn.
              <CardText className="mb-0">
                Ortalama Geçiş Süresi :   {totalPanel.toplamPanelSayisi>0 ? parseInt(totalPanel.toplamGecenSure / totalPanel.toplamPanelSayisi) +" Sn." : 0 +" Sn."} 

              </CardText>
            </Col>
          </Row>
        </CardFooter>

      </Card>
      <Modal
        size="lg"
        style={{ maxWidth: "80%", width: "100%" }}
        isOpen={modalShow}
        toggle={() => {
          setModalShow(false);
        }}
        className="modal-dialog-centered modal-lg "
        contentClassName="pt-0"
      >
        <ModalHeader
          className="mb-1"
          toggle={() => {
            setModalShow(false);
          }}
          tag="div"
        >
          <h5 className="modal-title">{modalTitle} </h5>
        </ModalHeader>

        <ModalBody>
          <Table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Ürün Kodu </th>
                <th>Lot No</th>
                {/* <th>Aciklama</th>
                <th>Miktar</th> */}
                {/* <th>BomId</th>
                <th>Malzeme</th>
                <th>Lot</th>
                <th>Aciklama</th>
                <th>Miktar</th> */}
              </tr>
            </thead>
            <tbody>
              {qrCodeDetail.map((item, i) => {
                return (
                  <tr key={i}>
                    <td>{item.id}</td>
                    <td>{item.material}</td>
                    <td>{item.partyNumber}</td>

                    {/* <td>{item.bomKitInfo.id}</td>
                    <td>{item.bomKitInfo.material}</td>
                    <td>{item.bomKitInfo.partyNumber}</td>
                    <td>{item.bomKitInfo.explanation}</td>
                    <td>{item.bomKitInfo.quantity}</td> */}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </ModalBody>
      </Modal>
    </>
  );
}

export default BomKitJoinPanelCode;
