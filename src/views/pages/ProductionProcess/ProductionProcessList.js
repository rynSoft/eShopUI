import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  Table,
  Row,
  Col,
  Input,
  Label,
  CardFooter,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  Modal,
  ModalHeader,
  ModalBody
} from "reactstrap";
import React, { useState, useEffect, Fragment } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown, Edit, Info, PlusSquare, Printer } from "react-feather";
import axios from "axios";
import moment from "moment";
import { dateFormat, serverDateFormat } from "../../../utility/Constants";
import ReactPaginate from "react-paginate";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { Link, useHistory } from "react-router-dom";
import Breadcrumbs from "../../../@core/components/breadcrumbs";
import CustomPagination from "../../../@core/components/gridTable/CustomPagination";
import ExportPdf from "../../../@core/components/gridTable/ExportPdf/exportPdf";
import ExpandableTable from "../../../@core/components/gridTable/ExpandableTable";
const ProductionProcessList = () => {
  const [data, setData] = useState([]);
  const [currentRow, setCurrentRow] = useState(null);
  const [rowCount, setRowCount] = useState(window.screen.height < 801 ? 8 : 11);
  const [rowCountLog, setRowCountLog] = useState(window.screen.height < 801 ? 8 : 11);
  const [rowCountDetail, setRowCountrowCountDetail] = useState(window.screen.height < 801 ? 8 : 8);

  const NoDataConst = "İş Emri Mevcut Değil";
  const NoDataConstLog = "Log Kaydı Yok";
  const NoDataConstQrcodeDetails = "QrCode Kaydı Yok";
  const [responseCount, setResponseCount] = useState(true);
  const [dataLog, setDataLog] = useState([]);
  const [dataQrcodeDetail, setQrcodeDetail] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [qrCodeDetail, setCodeQrCode] = useState([]);

  const saveData = () => {

    axios
      .post(
        process.env.REACT_APP_API_ENDPOINT + "api/RestCause/Add",
        searchParameters
      )
      .then((res) => {

        if (res.data.success) {

          setModalActive(false);
          toastData("Mola Başarıyla Kaydedildi", true);
          refreshFunction();
        } else {
          toastData("Mola Kaydedilemedi !", false);
        }
      }).catch(err => toastData("Mola Kaydedilemedi !", false));
  };




  const readCodeToContains = (e) => {
    setModalTitle(searchValue);

    if (searchValue.indexOf(".") > 0) {

      axios.get(process.env.REACT_APP_API_ENDPOINT +
        "api/ProductionOperations/GetAllQrCodeDetail", { params: { productionId: null, code: searchValue.replace("ç", ".").replace("ç", ".") } })
        .then((response) => {

          if (response.data.data) {
            setReaderType(false);
            setModalShow(true);

            setCodeQrCode(response.data.data);
          }
          else {
            toastData("Detay Bulunamadı !", false);
          }
        });

    } else {
      axios.get(process.env.REACT_APP_API_ENDPOINT +
        "api/ProductionOperations/GetProductions", { params: { materialandLotNo: searchValue.replace("ç", ".").replace("ç", ".") } })
        .then((response) => {

          if (response.data.data) {

            setCodeQrCode(response.data.data);
            setReaderType(true);
            setModalShow(true);
          }
          else {
            toastData("Detay Bulunamadı !", false);
          }
        });
    }
  };

  //#region Columns

  const columns = [
    {
      name: "Pr.Id",
      sortable: true,
      maxWidth: "50px",
      selector: (row) => row.Id,
    },
    {
      name: "Üretim Emri",
      sortable: true,
      maxWidth: "200px",
      selector: (row) => row.orderNo,
    },
    {
      name: 'Üretim Adı',
      sortable: true,
      maxWidth: '200px',
      selector: row => row.uretimAdi
    },
    {
      name: 'Açıklama',
      sortable: true,
      maxWidth: '1200px',
      selector: row => row.aciklama
    },
    {
      name: "Üretim Adedi",
      sortable: true,
      maxWidth: "200px",
      selector: (row) => row.quantity,
    },
    {
      name: "Açılış Tarihi",
      sortable: true,
      selector: (row) =>
        moment(row.startDate, serverDateFormat).format(dateFormat),
    },
    {
      name: 'Oluşturma Tarihi',
      maxWidth: "200px",
      sortable: true,
      selector: row => row.startDate != null ? moment(row.createDate, serverDateFormat).format(dateFormat) : null
    },
    {
      name: <Button.Ripple
        outline
        id="pdfPrint"
        className="btn-icon rounded-circle pull-right"
        color="danger"
        onClick={() => {
          ExportPdf(data, "uretimSurecListesi", "ÜRETİM SÜREÇ LİSTESİ");
        }}
      >
        <Printer size={17} />
      </Button.Ripple>,
      allowOverflow: true,
      maxWidth: "100px",
      cell: (row) => {
        return (
          <div className="d-flex">
            <Button.Ripple
              className="btn-icon"
              color="flat-primary"
              onClick={() => { openDetail(row.id) }}
            >
              <Info size={18} />
            </Button.Ripple>
          </div>
        );
      },
    },
  ];

  const columnsQrcodeDetails = [
    {
      name: "Makine Adı",
      sortable: true,
      selector: (row) => row.machineName,
    },
    {
      name: "QrCode",
      sortable: true,
      selector: (row) => row.qrcode,
    }
  ];

  const columnQrcodeDetails = [
    {
      name: "Üretim Id",
      sortable: true,
      maxWidth: "250px",
      selector: (row) => row.productionId,
    },
    {
      name: "Üretim Numarası",
      sortable: true,
      maxWidth: "250px",
      selector: (row) => row.orderNo,
    },
  ];

  const columnMaterialcodeDetails = [
    {
      name: "Üretim Numarası",
      sortable: true,
      maxWidth: "250px",
      selector: (row) => row.productionNo,
    },
    {
      name: "Üretim Adı",
      sortable: true,
      maxWidth: "250px",
      selector: (row) => row.productionDef,
    },
    {
      name: "Ürün Kodu",
      sortable: true,
      maxWidth: "250px",
      selector: (row) => row.material,
    },
    {
      name: "Lot No",
      sortable: true,
      maxWidth: "250px",
      selector: (row) => row.partyNumber,
    },

  ];




  //#endregion


  const secondFunction = (time) => {
    let hours = parseInt(time.split(":")[0]);
    let minutes = parseInt(time.split(":")[1]);
    let seconds = parseInt(time.split(":")[2]);
    let secondsTotal = (hours * 3600) + (minutes * 60) + seconds;
    return secondsTotal == 0 ? 0 : parseInt(secondsTotal);
  }
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPageLog, setCurrentPageLog] = useState(0);
  const [totalLogSecond, setTotalLogSecond] = useState(0);
  const [readType, setReaderType] = useState(false);

  useEffect(() => {
    let dtotalLogSecond = 0;
    dataLog.map((row) => {
      dtotalLogSecond = dtotalLogSecond + (row.elapsedTime.split(".")[0] === "00:00:00" ? 0 : secondFunction(row.elapsedTime.split(".")[0]));
    })
    setTotalLogSecond(dtotalLogSecond);
  }, [dataLog])//dataLog Değiştikce   toplam süreyi hesaplar



  const [searchValue, setSearchValue] = useState("");


  const ExpandableQrcodeDetailsTable = ({ data }) => {
    return (
      <div className="expandable-content p-2">
        <Row style={{ width: "100%" }}>
          <Col xs={1}></Col>
          <Col xs={10}>
            <DataTable
              noHeader
              pagination
              data={dataQrcodeDetail}
              columns={columnsQrcodeDetails}
              className="react-dataTable"
              sortIcon={<ChevronDown size={10} />}
              paginationComponent={() => CustomPagination(dataQrcodeDetail, currentPageLog, (value) => setCurrentPageLog(value))}
              paginationDefaultPage={currentPageLog + 1}
              paginationPerPage={rowCountLog}

              noDataComponent={NoDataConstQrcodeDetails}
              style={{ textAlign: "center" }}
            />
          </Col>
          <Col xs={1}></Col>

        </Row>
      </div>
    );
  };











  const onRowClickeds = (rowState, rowContent) => {
    setCurrentPageLog(0);
    setCurrentRow(rowContent)
    if (rowState) {
      axios.get(process.env.REACT_APP_API_ENDPOINT +
        "api/ProductionOperations/GetMaterialtoQrcode", {
          params: {
            materialandLotNo: searchValue.replace("ç", ".").replace("ç", "."),
            productionId: rowContent.productionId
          }
      })
        .then((response) => {
          ;
   

          if (response.data.data) {
            setQrcodeDetail(response.data.data);
          }
          else {
            toastData("Detay Bulunamadı !", false);
          }
        });


    }
  };


  return (
    <div>
      <div className="content-header row">
        <div className="content-header-left col-md-9 col-12 mb-2">
          <div className="row breadcrumbs-top">
            <div className="col-12">
              <h2 className="content-header-title float-start mb-0">
                {"Üretim Süreç Listesi"}
              </h2>
              <div className="breadcrumb-wrapper vs-breadcrumbs d-sm-block d-none col-12">
                <Breadcrumb className="ms-1">
                  <BreadcrumbItem>
                    <Link to="/"> Dashboard </Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <span> Üretim Süreç Listesi</span>
                  </BreadcrumbItem>
                </Breadcrumb>
              </div>
            </div>
          </div>
        </div>

      </div>


      <Card>
        <Row className="justify-content-end mx-0">
          <Col
            className="d-flex align-items-center justify-content-end mt-1"
            md="6"
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
            &nbsp;&nbsp;&nbsp;
            <Button className='me-1' color='primary' onClick={readCodeToContains}>
              Code Detayı Getir
            </Button>
            {/* <Button className='me-1' color='warning' onClick={readCodeToContains}>
            Material&PartyNumber'dan Qrcode'ları Getir
          </Button> */}
          </Col>
        </Row>

        <div className="react-dataTable" style={{ zoom: "85%" }}>
          <ExpandableTable noDataText="İş Emri Mevcut Değil" productionProcess={5} searchValue={searchValue} />
        </div>

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
        {
          readType == false ? (

            <ModalBody>
              <div className="react-dataTable" style={{ zoom: "85%" }}>
                <DataTable
                  noHeader
                  pagination
                  columns={columnMaterialcodeDetails}
                  className="react-dataTable"
                  sortIcon={<ChevronDown size={10} />}
                  paginationPerPage={rowCountDetail}
                  paginationComponent={() => CustomPagination(qrCodeDetail, currentPage, (value) => setCurrentPage(value))}

                  paginationDefaultPage={currentPage + 1}

                  paginationRowsPerPageOptions={[10, 25, 50, 100]}
                  data={qrCodeDetail}
                  noDataComponent={NoDataConstQrcodeDetails}
                />
              </div>
            </ModalBody>
          )
            :
            (
              <ModalBody>
                <div className="react-dataTable" style={{ zoom: "85%" }}>
                  <DataTable
                    noHeader
                    pagination
                    expandableRows
                    expandableRowExpanded={(row) => (row === currentRow)}//sadece aktif detayı gösterir diğerlerini kapatır
                    columns={columnQrcodeDetails}
                    expandOnRowClicked
                    onRowExpandToggled={onRowClickeds}
                    className="react-dataTable"
                    sortIcon={<ChevronDown size={10} />}
                    paginationPerPage={rowCountDetail}
                    paginationComponent={() => CustomPagination(qrCodeDetail, currentPage, (value) => setCurrentPage(value))}

                    paginationDefaultPage={currentPage + 1}
                    expandableRowsComponent={ExpandableQrcodeDetailsTable}
                    paginationRowsPerPageOptions={[10, 25, 50, 100]}
                    data={qrCodeDetail}
                    noDataComponent={NoDataConstQrcodeDetails}
                  />
                </div>



              </ModalBody>
            )
        }
      </Modal>

    </div>


  );
};

export default ProductionProcessList;
