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
  ButtonGroup,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { selectThemeColors } from "@utils";
import Select from "react-select";
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
import CustomPagination from "../../../@core/components/gridTable/CustomPagination";
import toastData from "../../../@core/components/toastData";
import ExportPdf from "../../../@core/components/gridTable/ExportPdf/exportPdf";
const NonComplianceCodeList = () => {
  const [data, setData] = useState([]);
  const [buttonName, setButtonName] = useState("Ekle");
  const [machineId, setMachineId] = useState();
  const [name, setName] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectionModal, setSelectionModal] = useState(false);
  const addParameters = {
    id: machineId != undefined ? machineId : undefined,
    name: name,
  };

  const saveData = () => {

    if (buttonName == "Ekle") {
      axios
        .post(
          process.env.REACT_APP_API_ENDPOINT + "api/NonComplianceCode/Add",
          addParameters
        )
        .then((res) => {
          if (res.data.success) {
            setSelectionModal(false);
            loadData();
            toastData("Uygunsuzluk Kodu Başarıyla Kaydedildi", true);
          } else {
            toastData("Uygunsuzluk Kodu Kaydedilemedi !", false);
          }
        })
        .catch((err) => toastData("Uygunsuzluk Kodu Kaydedilemedi !", false));
    } else {
      axios
        .post(
          process.env.REACT_APP_API_ENDPOINT + "api/NonComplianceCode/Update",
          addParameters
        )
        .then((res) => {
          if (res.data.success) {
            setSelectionModal(false);
            loadData();
            toastData("Uygunsuzluk Kodu Başarıyla Güncellendi", true);
          } else {
            toastData("Uygunsuzluk Kodu Güncellenemedi !", false);
          }
        })
        .catch((err) => toastData("Uygunsuzluk Kodu Güncellenemedi !", false));
    }
  };
  const deleteData = () => {

    axios
      .delete(process.env.REACT_APP_API_ENDPOINT + "api/NonComplianceCode/Delete?Id=" + machineId)
      .then((res) => {
        if (res.data.success) {
          setSelectionModal(false);
          loadData();
          toastData("Uygunsuzluk Kodu Başarıyla Silindi", true);
        } else {
          toastData("Uygunsuzluk Kodu Silinemedi !", false);
        }
      })
      .catch((err) => toastData("Uygunsuzluk Kodu Silinemedi !", false));
  };
  const columns = [
    {
      name: "Uygunsuzluk Kodu",
      sortable: true,

      selector: (row) => row.name,
    },

    {
      name: <Fragment>İSLEM <Button.Ripple style={{ marginLeft: 10 }}
        outline
        id="pdfPrint"
        className="btn-icon rounded-circle pull-right"
        color="danger"

        onClick={() => {
          ExportPdf(data, "Uygunsuzluk", "UYGUNSUZLUK KODU TANIM LİSTESİ");
        }}
      >
        <Printer size={17} />
      </Button.Ripple></Fragment>,
      allowOverflow: true,
      maxWidth: "150px",
      cell: (row) => {
        return (
          <div className="column-action d-flex align-items-center">
            <FileText
              size={17}
              id={`pw-tooltipUpdate-${row.id}`}
              className="cursor-pointer"
              onClick={() => {
                setMachineId(row.id),
                  setButtonName("Güncelle"),
                  setSelectionModal(true),    
                  setName(row.name)
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
                setMachineId(row.id),
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
          item.ledNumber
            ?.toString()
            .toLowerCase?.()
            .startsWith(value.toLowerCase()) ||
          item.name?.toLowerCase?.().startsWith(value.toLowerCase()) ||
          item.code?.toLowerCase?.().startsWith(value.toLowerCase()) ||
          item.barcodeReaderId?.toLowerCase?.().startsWith(value.toLowerCase())



        const includes =
          item.ledNumber
            ?.toString()
            .toLowerCase?.()
            .startsWith(value.toLowerCase()) ||
          item.name?.toLowerCase?.().startsWith(value.toLowerCase()) ||
          item.code?.toLowerCase?.().startsWith(value.toLowerCase()) ||
          item.barcodeReaderId?.toLowerCase?.().startsWith(value.toLowerCase())

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
      .get(process.env.REACT_APP_API_ENDPOINT + "api/NonComplianceCode/GetAll")
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
                {"Uygunsuzluk Kod Listesi"}
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
                    <span> Uygunsuzluk Kod Tanımları</span>
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
                  setMachineId(undefined),
                  setName("")
              }}
            >
              <PlusSquare size={20} />
            </Button.Ripple>
            <UncontrolledTooltip placement="left" target="newProductionOrder">
              Yeni Makine Tanımı
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
            ? "Uygunsuzluk Kodu Güncelle"
            : buttonName === "Sil"
              ? "Uygunsuzluk Kodu Sil"
              : "Yeni Uygunsuzluk Kodu"}
        </ModalHeader>
        <ModalBody>
          {buttonName === "Sil" ? (
            <div className="mb-1 text-center">{name} İsimli Uygunsuzluk Kodu Silinecek</div>
          ) : (
            <Fragment>

              <div className="mb-1">
                <Label className="form-label" for="ad">
                  Uygunsuzluk Kodu
                </Label>
                <Input
                  id="ad"
                  placeholder="Uygunsuzluk Kodu"
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
              paginationComponent={ ()=>CustomPagination(searchValue.length ? filteredData : data,currentPage,(value)=>setCurrentPage(value))}
      
              data={searchValue.length ? filteredData : data}
              noDataComponent={"Uygunsuzluk Kodu Bulunamadı"}
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

export default NonComplianceCodeList;
