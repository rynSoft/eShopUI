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
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Spinner ,
  InputGroup,
  ButtonGroup,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { Turkish } from "flatpickr/dist/l10n/tr.js"
import DataTable from "react-data-table-component";
import { selectThemeColors } from "@utils";
import Select from "react-select";
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
const ShiftList = () => {
  const [data, setData] = useState([]);
  const [buttonName, setButtonName] = useState("Ekle");
  const [name, setName] = useState("");
  const [active, setActive] = useState(true);
  
  const [startPicker, setStartPicker] = useState([new Date()])
  const [endPicker, setEndPicker] = useState([new Date()])
  const [shiftId, setShıftId] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [disabledButton, setDisabledButton] = useState(false);
  const [selectionModal, setSelectionModal] = useState(false);
  const addParameters = {
    id: shiftId != undefined ? shiftId : undefined,
    name: name,
    active:active,
    startDate: startPicker[0].toLocaleTimeString(),
    endDate: endPicker[0].toLocaleTimeString(),
  };


  const shiftUpdate = (newState, rowId, names,startDates,endDates) => {
    setDisabledButton(true);
    axios
      .post(
        process.env.REACT_APP_API_ENDPOINT +
        "api/ShiftDefinition/Update", { id: rowId, active: newState, name : names,startDate : startDates ,endDate : endDates  }

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
          process.env.REACT_APP_API_ENDPOINT + "api/ShiftDefinition/Add",
          addParameters
        )
        .then((res) => {
          if (res.data.success) {
            setSelectionModal(false);
            loadData();
            toastData("Vardiya Başarıyla Kaydedildi", true);
          } else {
            toastData("Vardiya Kaydedilemedi !", false);
          }
        })
        .catch((err) => toastData("Vardiya Kaydedilemedi !", false));
    } else {
      axios
        .post(
          process.env.REACT_APP_API_ENDPOINT + "api/ShiftDefinition/Update",
          addParameters
        )
        .then((res) => {
          if (res.data.success) {
            setSelectionModal(false);
            loadData();
            toastData("Vardiya Başarıyla Güncellendi", true);
          } else {
            toastData("Vardiya Güncellenemedi !", false);
          }
        })
        .catch((err) => toastData("Vardiya Güncellenemedi !", false));
    }
  };
  const deleteData = () => {

    axios
      .delete(process.env.REACT_APP_API_ENDPOINT + "api/ShiftDefinition/Delete?Id=" + shiftId)
      .then((res) => {
        if (res.data.success) {
          setSelectionModal(false);
          loadData();
          toastData("Vardiya Başarıyla Silindi", true);
        } else {
          toastData("Vardiya Silinemedi !", false);
        }
      })
      .catch((err) => toastData("Vardiya Silinemedi !", false));
  };
  const columns = [
    {
      name: "Adı",
      sortable: true,
      maxWidth: "300px",
      selector: (row) => row.name,
    },
    {
      name: "Baslangıç Zamanı",
      sortable: true,
      selector: (row) => row.startDate,
    },
    {
      name: "Bitiş Zamanı",
      sortable: true,
      selector: (row) => row.endDate,
    },
    {
      name: "Aktif/Pasif",
      maxWidth: "50px",
      selector: (row) => row.active,
      cell: (row) => {
        return (
          disabledButton ? <Badge color={row.active ? "light-info" : "light-info"} style={{ cursor: "pointer" }}><Spinner size="sm" /></Badge>
            : <Badge color={row.active ? "light-success" : "light-danger"} style={{ cursor: "pointer" }} onClick={() => shiftUpdate(!row.active, row.id,row.name,row.startDate,row.endDate)}>{row.active ? "Aktif" : "Pasif"}</Badge>



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
          ExportPdf(data, "VardiyaTanimListesi", "VARDİYA TANIM LİSTESİ");
        }}
      >
        <Printer size={17} />
      </Button.Ripple><Button.Ripple
        outline
        id="excelPrint"
        className="btn-icon rounded-circle pull-right"
        color="success"
        style={{ marginLeft: 5 }}
        onClick={() => {
          ExportExcel(searchValue.length ? filteredData : data, "VardiyaTanimListesi", "VARDİYA TANIM LİSTESİ");
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
                setShıftId(row.id),
                  setButtonName("Güncelle"),
                  setSelectionModal(true),
                  setName(row.name)
                  setActive(row.active)

                setEndPicker([new Date("October 13, 2014 " + row.endDate)])
                setStartPicker([new Date("October 13, 2014 " + row.startDate)])
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
                setShıftId(row.id),
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
    },
  ];



  const handleFilter = (e) => {
    const value = e.target.value;
    let updatedData = [];
    setSearchValue(value);

    if (value.length) {
      updatedData = data.filter((item) => {
        const startsWith =
          item.name?.toLowerCase?.().startsWith(value.toLowerCase())
        const includes =
          item.name?.toLowerCase?.().startsWith(value.toLowerCase())
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
      .get(process.env.REACT_APP_API_ENDPOINT + "api/ShiftDefinition/GetAll")
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
                {"Vardiya Listesi"}
              </h2>
              <div className="breadcrumb-wrapper vs-breadcrumbs d-sm-block d-none col-12">
                <Breadcrumb className="ms-1">
                
                  <BreadcrumbItem>
                    <span> Tanımlar </span>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <span> Vardiya Tanımları </span>
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

                  setShıftId(undefined),
                  setName("")
              }}
            >
              <PlusSquare size={20} />
            </Button.Ripple>
            <UncontrolledTooltip placement="left" target="newProductionOrder">
              Yeni Vardiya Tanımı
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
            ? "Vardiya Güncelle"
            : buttonName === "Sil"
              ? "Vardiya Sil"
              : "Yeni Vardiya"}
        </ModalHeader>
        <ModalBody>
          {buttonName === "Sil" ? (
            <div className="mb-1 text-center">{name} İsimli Vardiya Silinecek</div>
          ) : (
            <Fragment>
              <div className="mb-1">
                <Label className="form-label" for="ad">
                  İsim
                </Label>
                <Input
                  id="ad"
                  placeholder="Vardiya Adı"
                  onChange={(event) => setName(event.target.value)}
                  value={name}
                />
              </div>

              <div className="mb-1">
                <Label className="form-label" for="ad">
                  Başlangıç Zamanı
                </Label>
                <Flatpickr
                  style={{ textAlign: "center" }}
                  value={startPicker}

                  className='form-control'
                  onChange={date => setStartPicker(date)}
                  options={{
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: "H:i",

                    locale: "tr",
                    position: "auto center",

                  }}
                />
              </div>

              <div className="mb-1">
                <Label className="form-label" for="ad">
                  Bitiş Zamanı
                </Label>
                <Flatpickr
                  style={{ textAlign: "center" }}
                  value={endPicker}
                  id='default-picker'
                  className='form-control'
                  onChange={date => setEndPicker(date)}
                  options={{
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: "H:i",

                    locale: "tr",
                    position: "auto center",

                  }}
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
              noDataComponent={"Vardiya Bulunamadı"}
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

export default ShiftList;
