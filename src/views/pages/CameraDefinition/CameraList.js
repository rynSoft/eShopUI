import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  Table,
  Row,
  Col,
  Badge,
  Spinner,
  Input,
  Label,
  CardFooter,
  Button,
  UncontrolledTooltip,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Breadcrumb,
  BreadcrumbItem,
  InputGroup,
  ButtonGroup,
} from "reactstrap";
import DataTable from "react-data-table-component";
import CustomPagination from "../../../@core/components/gridTable/CustomPagination";
import {

  ChevronDown,
  PlusSquare,
  FileText,
  Trash,
  Printer,
} from "react-feather";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { Link, useHistory } from "react-router-dom";
import toastData from "../../../@core/components/toastData";

const  CameraList = () => {
const [data, setData] = useState([]);

  const [buttonName, setButtonName] = useState("Ekle");
  const [cameraId, setCameraId] = useState();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [ipAdress, setipAdress] = useState("");
  const [port, setPort] = useState("");
  const [disabledButton, setDisabledButton] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectionModal, setSelectionModal] = useState(false);
  const addParameters = {
    id: cameraId != undefined ? cameraId : undefined,
    code: code,
    name: name,
    ipAdress: ipAdress,
    port: port,
  };


  const saveData = () => {

    if (buttonName == "Ekle") {
      axios
        .post(
          process.env.REACT_APP_API_ENDPOINT + "api/Camera/Add",
          addParameters
        )
        .then((res) => {
          if (res.data.success) {
            setSelectionModal(false);
            loadData();
            toastData("Kamera Başarıyla Kaydedildi", true);
          } else {
            toastData("Kamera Kaydedilemedi !", false);
          }
        })
        .catch((err) => toastData("Kamera Kaydedilemedi !", false));
    } else {
      axios
        .post(
          process.env.REACT_APP_API_ENDPOINT + "api/Camera/Update",
          addParameters
        )
        .then((res) => {
          if (res.data.success) {
            setSelectionModal(false);
            loadData();
            toastData("Kamera Başarıyla Güncellendi", true);
          } else {
            toastData("Kamera Güncellenemedi !", false);
          }
        })
        .catch((err) => toastData("Kamera Güncellenemedi !", false));
    }
  };

  const cameraUpdate = (newState, rowId, names,numbers) => {
    setDisabledButton(true);
    axios
      .post(
        process.env.REACT_APP_API_ENDPOINT +
        "api/Camera/Update", { id: rowId, active: newState, name : names,number : numbers   }

      )
      .then((res) => {
        if (res.data.success) {
          loadData();
          toastData("Camera Güncellendi", true);
        }
        else {
          toastData("Camera Güncellenemedi", false);
        }
        setDisabledButton(false);
      });

  };

  const deleteData = () => {

    axios
      .delete(process.env.REACT_APP_API_ENDPOINT + "api/Camera/Delete?Id=" + cameraId)
      .then((res) => {
        if (res.data.success) {
          setSelectionModal(false);
          loadData();
          toastData("Kamera Başarıyla Silindi", true);
        } else {
          toastData("Kamera Silinemedi !", false);
        }
      })
      .catch((err) => toastData("Kamera Silinemedi !", false));
  };
  const columns = [
    {
      name: "Kamera Adı",
      sortable: true,
      selector: (row) => row.name,
      //selector: (row) => lineData.filter(xr => xr.id === row.lineId)[0]?.name,
    },
    {
      name: "IP",
      sortable: true,
      selector: (row) => row.code,
    },
    {
      name: "ip Adress",
      sortable: true,
      selector: (row) => row.ipAdress,
    },
    {
      name: "Port Numarası",
      sortable: true,
      selector: (row) => row.port,
    },
    {
      name: "Aktif/Pasif",
      maxWidth: "50px",
      selector: (row) => row.active,
      cell: (row) => {
        return (
          disabledButton ? <Badge color={row.active ? "light-info" : "light-info"} style={{ cursor: "pointer" }}><Spinner size="sm" /></Badge>
            : <Badge color={row.active ? "light-success" : "light-danger"} style={{ cursor: "pointer" }} onClick={() => cameraUpdate(!row.active, row.id,row.name,row.code,row.ipAdress,row.port)}>{row.active ? "Aktif" : "Pasif"}</Badge>

        );
      },
    },
    {
      name: <Fragment>İSLEM <Button.Ripple style={{ marginLeft: 10 }}
        outline
        id="pdfPrint"
        className="btn-icon rounded-circle pull-right"
        color="danger"

        onClick={() => {
          ExportPdf(data, "HatTanimListesi", "HAT TANIM LİSTESİ");
        }}
      >
        <Printer size={17} />
      </Button.Ripple>  <Button.Ripple
        outline
        id="excelPrint"
        className="btn-icon rounded-circle pull-right"
        color="success"
        style={{ marginLeft: 5 }}
        onClick={() => {
          ExportExcel(searchValue.length ? filteredData : data, "HatTanimListesi", "HAT TANIM LİSTESİ");
        }}
      >
          <Printer size={17} />
        </Button.Ripple></Fragment>,
      allowOverflow: true,
      maxWidth: "200px",
      cell: (row) => {
        return (
          <div className="column-action d-flex align-items-center">
            <FileText
              size={17}
              id={`pw-tooltipUpdate-${row.id}`}
              className="cursor-pointer"
              onClick={() => {
                  setCameraId(row.id),
                  setButtonName("Güncelle"),
                  setSelectionModal(true),
                  setName(row.name);
              }}
            />

            <UncontrolledTooltip
              placement="top"
              target={`pw-tooltipUpdate-${row.id}`}
            >
              Güncelle
            </UncontrolledTooltip>

            <Trash
              size={17}
              id={`pw-tooltips-${row.id}`}
              className="mx-1 cursor-pointer"
              onClick={() => {
                 setCameraId(row.id),
                  setButtonName("Sil"),
                  setSelectionModal(true),
                  setName(row.name);
              }}
            />

            <UncontrolledTooltip
              placement="top"
              target={`pw-tooltips-${row.id}`}
            >
              Sil
            </UncontrolledTooltip>
          </div>
        );
      },
    }
  ];



  const handleFilter = (e) => {
    const value = e.target.value;
    let updatedData = [];
    setSearchValue(value);

    if (value.length) {
      updatedData = data.filter((item) => {
        const startsWith =
        item.name?.toLowerCase?.().startsWith(value.toLowerCase()) ||
        item.code?.toLowerCase?.().startsWith(value.toLowerCase()) ||
        item.ipAdress?.toLowerCase?.().startsWith(value.toLowerCase()) ||
        item.port?.toLowerCase?.().startsWith(value.toLowerCase()) 


        const includes =
          item.name?.toLowerCase?.().startsWith(value.toLowerCase()) ||
          item.code?.toLowerCase?.().startsWith(value.toLowerCase()) ||
          item.ipAdress?.toLowerCase?.().startsWith(value.toLowerCase()) ||
          item.port?.toLowerCase?.().startsWith(value.toLowerCase()) 

        if (startsWith) {
          return startsWith;
        } else if (!startsWith && includes) {
          return includes;
        } else return null;
      });
      setFilteredData(updatedData);
      setSearchValue(value);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    axios
      .get(process.env.REACT_APP_API_ENDPOINT + "api/Camera/GetAll")
      .then((response) => {
        setData(response.data.data);
      });
  };



  const history = useHistory();
  const openExcelImport = () => {
    setSelectionModal(false);
    let path = "/production/import-excel";
    history.push(path);
  };
  const openDetail = (id) => {
    setSelectionModal(false);
    let path = "/production/" + id;
    history.push(path);
  };



  return (
    <div>
      <div className="content-header row">
        <div className="content-header-left col-md-9 col-12 mb-2">
          <div className="row breadcrumbs-top">
            <div className="col-12">
              <h2 className="content-header-title float-start mb-0">
                {"Kamera Listesi"}
              </h2>
              <div className="breadcrumb-wrapper vs-breadcrumbs d-sm-block d-none col-12">
                <Breadcrumb className="ms-1">
                  <BreadcrumbItem>
                    <Link to="/"> Dashboard </Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <span> Tanımlar </span>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <span> Kamera Tanımları </span>
                  </BreadcrumbItem>
                </Breadcrumb>
              </div>
            </div>
          </div>
        </div>

        <div className="content-header-right text-md-end col-md-3 col-12 d-md-block d-none">
          <div className="breadcrumb-right">
            <Button.Ripple
              className="btn-icon"
              color="primary"
              id="newProductionOrder"
              onClick={() => {
                setSelectionModal(!selectionModal),
                  setButtonName("Ekle"),
                  setCameraId(undefined),
                  setName(""),
                  setCode(""),
                  setipAdress(""),
                  setPort("")
              }}
            >
              <PlusSquare size={20} />
            </Button.Ripple>
            <UncontrolledTooltip placement="left" target="newProductionOrder">
              Yeni Kamera Tanımı
            </UncontrolledTooltip>
          </div>
        </div>
      </div>
      <Modal
        isOpen={selectionModal}
        toggle={() => setSelectionModal(!selectionModal)}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={() => setSelectionModal(!selectionModal)}>
          {buttonName === "Güncelle"
            ? "Kamera Güncelle"
            : buttonName === "Sil"
              ? "Kamera Sil"
              : "Yeni Kamera"}
        </ModalHeader>
        <ModalBody>
          {buttonName === "Sil" ? (
            <div className="mb-1 text-center">{name} İsimli Kamera Silinecek</div>
          ) : (
            <Fragment>

              <div className="mb-1">
                <Label className="form-label" for="code">
                  Kod
                </Label>
                <Input
                  id="code"
                  placeholder="Kod"
                  onChange={(event) => setCode(event.target.value)}
                  value={code}
                />
              </div>
       
              <div className="mb-1">
                <Label className="form-label" for="ad">
                  İsim
                </Label>
                <Input
                  id="ad"
                  placeholder="Kamera Adı"
                  onChange={(event) => setName(event.target.value)}
                  value={name}
                />
              </div>

              <div className="mb-1">
                <Label className="form-label" for="ipAdress">
                  ip Adres
                </Label>
                <Input
                  id="ad"
                  placeholder="Ip Adres"
                  onChange={(event) => setipAdress(event.target.value)}
                  value={ipAdress}
                />
              </div>
              <div className="mb-1">
                <Label className="form-label" for="ipAdress">
                  Port
                </Label>
                <Input
                  id="port"
                  placeholder="Port Numarası"
                  onChange={(event) => setPort(event.target.value)}
                  value={port}
                />
              </div>
              
            </Fragment>
          )}

          <div className="text-center">
            <Button className="me-1" color="primary" onClick={buttonName === "Sil" ? deleteData : saveData}>
              {buttonName}
            </Button>
            <Button
              color="secondary"
              outline
              onClick={() => setSelectionModal(false)}
            >
              İptal
            </Button>
          </div>
        </ModalBody>
      </Modal>


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
              onChange={handleFilter}
            />
          </Col>
        </Row>
        <CardBody>
          <div className="react-dataTable">
            <DataTable
              noHeader
              pagination
              selectableRowsNoSelectAll
              columns={columns}
              className="react-dataTable"
              paginationPerPage={10}
              sortIcon={<ChevronDown size={10} />}
              paginationDefaultPage={currentPage + 1}
              paginationComponent={() => CustomPagination(searchValue.length ? filteredData : data, currentPage, (value) => setCurrentPage(value))}

              data={searchValue.length ? filteredData : data}
              noDataComponent={"Kamera Bulunamadı"}
            />
          </div>
        </CardBody>
        <CardFooter>
          <CardText className="mb-0"></CardText>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CameraList;
