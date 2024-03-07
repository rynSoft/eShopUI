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
  UncontrolledTooltip,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Breadcrumb,
  BreadcrumbItem,
  InputGroup,
  Badge,
  Spinner ,
} from "reactstrap";
import DataTable from "react-data-table-component";
import CustomPagination from "../../../@core/components/gridTable/CustomPagination";
import {
  User,
  Briefcase,
  Mail,
  Calendar,
  DollarSign,
  X,
  Check,
  XOctagon,
  ChevronDown,
  PlusSquare,
  FileText,
  Trash,
  Printer,
} from "react-feather";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { dateFormat, serverDateFormat } from "../../../utility/Constants";
import ReactPaginate from "react-paginate";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { Link, useHistory } from "react-router-dom";
import toastData from "../../../@core/components/toastData";
import ExportPdf from "../../../@core/components/gridTable/ExportPdf/exportPdf";
import ExportExcel from "../../../@core/components/gridTable/ExportExcel";
const LineList = () => {
  const [data, setData] = useState([]);

  const [buttonName, setButtonName] = useState("Ekle");
  const [lineId, setLineId] = useState();
  const [lineNumber, setLineNumber] = useState(0);
  const [name, setName] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [disabledButton, setDisabledButton] = useState(false);
  const [selectionModal, setSelectionModal] = useState(false);
  const addParameters = {
    id: lineId != undefined ? lineId : null,
    number: lineNumber,
    name: name,
  };

  const lineUpdate = (newState, rowId, names,numbers) => {
    setDisabledButton(true);
    axios
      .post(
        process.env.REACT_APP_API_ENDPOINT +
        "api/Line/Update", { id: rowId, active: newState, name : names,number : numbers   }

      )
      .then((res) => {
        if (res.data.success) {
          loadData();
          toastData("Vardiya Tanımı Güncellendi", true);
        }
        else {
          toastData("Vardiya Tanımı Güncellenemedi", false);
        }
        setDisabledButton(false);
      });

  };

  const saveData = () => {
    if (buttonName == "Ekle") {
      axios
        .post(
          process.env.REACT_APP_API_ENDPOINT + "api/Line/Add",
          addParameters
        )
        .then((res) => {
          if (res.data.success) {
            setSelectionModal(false);
            loadData();
            toastData("Hat Başarıyla Kaydedildi", true);
          } else {
            toastData("Hat Kaydedilemedi !", false);
          }
        })
        .catch((err) => toastData("Hat Kaydedilemedi !", false));
    } else {
      axios
        .post(
          process.env.REACT_APP_API_ENDPOINT + "api/Line/Update",
          addParameters
        )
        .then((res) => {
          if (res.data.success) {
            setSelectionModal(false);
            loadData();
            toastData("Hat Başarıyla Güncellendi", true);
          } else {
            toastData("Hat Güncellenemedi !", false);
          }
        })
        .catch((err) => toastData("Hat Güncellenemedi !", false));
    }
  };
  const deleteData = () => {

    axios
      .delete(process.env.REACT_APP_API_ENDPOINT + "api/Line/Delete?Id=" + lineId)
      .then((res) => {
        if (res.data.success) {
          setSelectionModal(false);
          loadData();
          toastData("Hat Başarıyla Silindi", true);
        } else {
          toastData("Hat Silinemedi !", false);
        }
      })
      .catch((err) => toastData("Hat Silinemedi !", false));
  };
  const columns = [
    {
      name: "Hat Numarası",
      sortable: true,
      maxWidth: "300px",
      selector: (row) => row.number,
    },
    {
      name: "Hat İsmİ",
      sortable: true,
      selector: (row) => row.name,
    },
    {
      name: "Aktif/Pasif",
      maxWidth: "50px",
      selector: (row) => row.active,
      cell: (row) => {
        return (
          disabledButton ? <Badge color={row.active ? "light-info" : "light-info"} style={{ cursor: "pointer" }}><Spinner size="sm" /></Badge>
            : <Badge color={row.active ? "light-success" : "light-danger"} style={{ cursor: "pointer" }} onClick={() => lineUpdate(!row.active, row.id,row.name,row.number)}>{row.active ? "Aktif" : "Pasif"}</Badge>

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
                setLineId(row.id),
                  setButtonName("Güncelle"),
                  setSelectionModal(true),
                  setLineNumber(row.number),
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
                setLineId(row.id),
                  setButtonName("Sil"),
                  setSelectionModal(true),
                  setLineNumber(row.number),
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
          item.number
            ?.toString()
            .toLowerCase?.()
            .startsWith(value.toLowerCase()) ||
          item.name?.toString().toLowerCase?.().startsWith(value.toLowerCase());

        const includes =
          item.number
            ?.toString()
            .toLowerCase?.()
            .startsWith(value.toLowerCase()) ||
          item.name?.toString().toLowerCase?.().startsWith(value.toLowerCase());

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
      .get(process.env.REACT_APP_API_ENDPOINT + "api/Line/GetAll")
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
                {"Hat Listesi"}
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
                    <span> Hat Tanımları </span>
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
                  setLineId(undefined),
                  setName(""),
                  setLineNumber(0);
              }}
            >
              <PlusSquare size={20} />
            </Button.Ripple>
            <UncontrolledTooltip placement="left" target="newProductionOrder">
              Yeni Hat Tanımı
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
            ? "Hat Güncelle"
            : buttonName === "Sil"
              ? "Hat Sil"
              : "Yeni Hat"}
        </ModalHeader>
        <ModalBody>
          {buttonName === "Sil" ? (
            <div className="mb-1 text-center">{name} İsimli Hat Silinecek</div>
          ) : (
            <Fragment>
              <div className="mb-1">
                <Label className="form-label" for="baslik">
                  Hat No
                </Label>
                <InputGroup>
                  <Input
                    id="Hat Numarası"
                    type="number"
                    placeholder="Hat Numarası"
                    onChange={(event) => setLineNumber(event.target.value)}
                    value={lineNumber}
                  />
                </InputGroup>
              </div>{" "}
              <div className="mb-1">
                <Label className="form-label" for="ad">
                  İsim
                </Label>
                <Input
                  id="ad"
                  placeholder="Hat Adı"
                  onChange={(event) => setName(event.target.value)}
                  value={name}
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

      {/* <Card className="text-center">
        <CardTitle> Panel Adı</CardTitle>

        <CardBody>
          <Row >
            <Col>
              <Avatar color="light-danger" icon={<Circle size={14} />} />
            </Col>
            <Col>
              <Avatar color="light-success" icon={<CheckCircle size={14} />} />
            </Col>
            <Col>
              <Avatar color="light-success" icon={<CheckCircle size={14} />} />
            </Col>
            <Col>
              <Avatar color="light-danger" icon={<Circle size={14} />} />
            </Col>
            <Col>
              <Avatar color="light-danger" icon={<Circle size={14} />} />
            </Col>
            <Col>
              <Avatar color="light-danger" icon={<Circle size={14} />} />
            </Col>
            <Col>
              <Avatar color="light-danger" icon={<Circle size={14} />} />
            </Col>
            <Col>
              <Avatar color="light-danger" icon={<Circle size={14} />} />
            </Col>
            <Col>
              <Avatar color="light-danger" icon={<Circle size={14} />} />
            </Col>
            <Col>
              <Avatar color="light-success" icon={<CheckCircle size={14} />} />
            </Col>
            <Col>
              <Avatar color="light-success" icon={<CheckCircle size={14} />} />
            </Col>
            <Col>
              <Avatar color="light-danger" icon={<Circle size={14} />} />
            </Col>
            <Col>
              <Avatar color="light-danger" icon={<Circle size={14} />} />
            </Col>
            <Col>
              <Avatar color="light-danger" icon={<Circle size={14} />} />
            </Col>
            <Col>
              <Avatar color="light-danger" icon={<Circle size={14} />} />
            </Col>
            <Col>
              <Avatar color="light-danger" icon={<Circle size={14} />} />
            </Col>
          </Row>
          
        </CardBody>
      </Card> */}
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
              noDataComponent={"Hat Bulunamadı"}
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

export default LineList;
