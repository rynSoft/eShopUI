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
const MachineList = () => {
  const [data, setData] = useState([]);

  const [lineData, setLineData] = useState([
    { id: 0, name: "Hat Yok" },
  ]);
  const [machineType, setMachineType] = useState([
    { id: 0, ad: "Ön " },
    { id: 1, ad: "Arka" },
    { id: 2, ad: "Ön-Arka" },
  ]);
  const [machineTypeEstate, setMachineTypeEstate] = useState(machineType[0].id);
  const [lineDetail, setLineDetail] = useState({ value: 0, label: 'Hat Yok' })
  const [buttonName, setButtonName] = useState("Ekle");
  const [ledCounter, setLedCounter] = useState(undefined);
  const [machineId, setMachineId] = useState();
  const [inputCameraId, setInputCameraId] = useState({ value: 0, label: 'Kamera Yok' });
  const [outputCameraId, setOutputCameraId] = useState({ value: 0, label: 'Kamera Yok' });
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [barcodeReaderId, setBarcodeReader] = useState("");
  const [cameras, setCameras] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectionModal, setSelectionModal] = useState(false);

  const saveData = (params) => {
    if (buttonName == "Ekle") {
      axios
        .post(
          process.env.REACT_APP_API_ENDPOINT + "api/Machine/Add",
          params
        )
        .then((res) => {
          if (res.data.success) {
            setSelectionModal(false);
            loadData();
            toastData("Makine Başarıyla Kaydedildi", true);
          } else {
            toastData("Makine Kaydedilemedi !", false);
          }
        })
        .catch((err) => toastData("Makine Kaydedilemedi !", false));
    } else {
      axios
        .post(
          process.env.REACT_APP_API_ENDPOINT + "api/Machine/Update",
          params
        )
        .then((res) => {
          if (res.data.success) {
            setSelectionModal(false);
            loadData();
            toastData("Makine Başarıyla Güncellendi", true);
          } else {
            toastData("Makine Güncellenemedi !", false);
          }
        })
        .catch((err) => toastData("Makine Güncellenemedi !", false));
    }
  };
  const deleteData = () => {

    axios
      .delete(process.env.REACT_APP_API_ENDPOINT + "api/Machine/Delete?Id=" + machineId)
      .then((res) => {
        if (res.data.success) {
          setSelectionModal(false);
          loadData();
          toastData("Makine Başarıyla Silindi", true);
        } else {
          toastData("Makine Silinemedi !", false);
        }
      })
      .catch((err) => toastData("Makine Silinemedi !", false));
  };
  const columns = [
    {
      name: "Hat Adı",
      sortable: true,
      maxWidth: "300px",
      selector: (row) => lineData.filter(xr => xr.id === row.lineId)[0]?.name,
    },
    {
      name: "Kod",
      sortable: true,
      selector: (row) => row.code,
    },
    {
      name: "Makine Adı",
      sortable: true,
      selector: (row) => row.name,
    },
    {
      name: "Barcode No",
      sortable: true,
      selector: (row) => row.barcodeReaderId,
    },
    {
      name: "LED",
      sortable: true,
      selector: (row) => row.ledNumber,
    },
    {
      name: <Fragment>İSLEM <Button.Ripple style={{ marginLeft: 10 }}
        outline
        id="pdfPrint"
        className="btn-icon rounded-circle pull-right"
        color="danger"

        onClick={() => {
          ExportPdf(data, "MakineTanimListesi", "MAKİNE TANIM LİSTESİ");
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
          ExportExcel(searchValue.length ? filteredData : data, "MakineTanimListesi", "MAKİNE TANIM LİSTESİ");
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
                setMachineId(row.id),
                  setButtonName("Güncelle"),
                  setSelectionModal(true),
                  setCode(row.code),
                  setName(row.name),
                  setBarcodeReader(row.barcodeReaderId),
                  setLineDetail({ value: row.lineId, label: lineData.filter(xr => xr.id === row.lineId)[0]?.name })
                setMachineTypeEstate(row.machineType)
                setLedCounter(row.ledNumber)
                setInputCameraId({ value: row.inputCameraId, label: cameras.filter(xr => xr.id === row.inputCameraId)[0]?.name })
                setOutputCameraId({ value: row.outputCameraId, label: cameras.filter(xr => xr.id === row.outputCameraId)[0]?.name })
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
                  setCode(row.code),
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
          item.barcodeReaderId?.toLowerCase?.().startsWith(value.toLowerCase()) ||
          lineData.filter(xr => xr.id === item.lineId)[0]?.name.toLowerCase?.().startsWith(value.toLowerCase())


        const includes =
          item.ledNumber
            ?.toString()
            .toLowerCase?.()
            .startsWith(value.toLowerCase()) ||
          item.name?.toLowerCase?.().startsWith(value.toLowerCase()) ||
          item.code?.toLowerCase?.().startsWith(value.toLowerCase()) ||
          item.barcodeReaderId?.toLowerCase?.().startsWith(value.toLowerCase()) ||
          lineData.filter(xr => xr.id === item.lineId)[0]?.name.toLowerCase?.().startsWith(value.toLowerCase())

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
    axios.get(process.env.REACT_APP_API_ENDPOINT + 'api/Line/GetAll').then(response => {
      if (response.data.data.length > 0) {
        setLineData(response.data.data)
        setLineDetail({ value: response.data.data[0].id, label: response.data.data[0].name })
      }
    })
    axios.get(process.env.REACT_APP_API_ENDPOINT + 'api/Camera/GetAll').then(
      response => {
        if (response.data.data.length > 0){
          setCameras(response.data.data)
          setInputCameraId({ value: response.data.data[0].id, label: response.data.data[0].name })
          setOutputCameraId({ value: response.data.data[0].id, label: response.data.data[0].name })
        }
      }

    )
  }, []);
  const loadData = () => {
    axios
      .get(process.env.REACT_APP_API_ENDPOINT + "api/Machine/GetAll")
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
                {"Makine Listesi"}
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
                    <span> Makine Tanımları </span>
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
                  setName(""),
                  setBarcodeReader(""),
                  setCode("");
                setLedCounter(undefined)
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
            ? "Makine Güncelle"
            : buttonName === "Sil"
              ? "Makine Sil"
              : "Yeni Makine"}
        </ModalHeader>
        <ModalBody>
          {buttonName === "Sil" ? (
            <div className="mb-1 text-center">{name} İsimli Makine Silinecek</div>
          ) : (
            <Fragment>
              <div className="mb-1">
                <Label className="form-label" for="Hat">
                  Hat
                </Label>
                <Select
                  isClearable={false}
                  className='react-select'
                  classNamePrefix='select'
                  options={lineData.map((option) => (
                    { value: option.id, label: option.name }
                  ))}
                  theme={selectThemeColors}
                  defaultValue={lineDetail}
                  value={lineDetail}
                  onChange={(event) => setLineDetail({ value: event.value, label: event.label })}
                />
              </div>
              <div className="mb-1">
                <Label className="form-label" for="baslik">
                  Kod
                </Label>
                <InputGroup>
                  <Input
                    id="Makine Kodu"

                    placeholder="Makine Kodu"
                    onChange={(event) => setCode(event.target.value)}
                    value={code}
                  />
                </InputGroup>
              </div>{" "}
              <div className="mb-1">
                <Label className="form-label" for="ad">
                  İsim
                </Label>
                <Input
                  id="ad"
                  placeholder="Makine Adı"
                  onChange={(event) => setName(event.target.value)}
                  value={name}
                />
              </div>
              <div className="mb-1">
                <Label className="form-label" for="ad">
                  Barkod Reader Id
                </Label>
                <Input
                  id="barcodeReaderId"
                  placeholder="Barcode Reader No"
                  onChange={(event) => setBarcodeReader(event.target.value)}
                  value={barcodeReaderId}
                />
              </div>
              <div className="mb-1 ">
                <Label className="form-label" for="led">
                  Giriş Kamerası
                </Label>
                <Select
                  isClearable={false}
                  className="react-select"
                  classNamePrefix="select"
                  placeholder="Makina seç"
                  options={cameras.map((camera) => (
                    { value: camera.id, label: camera.name }
                  ))}
                  onChange={(event) => setInputCameraId({ value: event.value, label: event.label })}
                  value={inputCameraId}
                />
              </div>
              <div className="mb-1 ">
                <Label className="form-label" for="led">
                  Çıkış Kamerası
                </Label>
                <Select
                  isClearable={false}
                  className="react-select"
                  classNamePrefix="select"
                  placeholder="Makina seç"
                  options={cameras.map((camera) => (
                    { value: camera.id, label: camera.name }
                  ))}
                  onChange={(event) => setOutputCameraId({ value: event.value, label: event.label })}
                  value={outputCameraId}
                />
              </div>
            </Fragment>
          )}

          <div className="text-center">
            <Button className="me-1" color="primary" onClick={() => {
              buttonName === "Sil" ? deleteData() : saveData({
                id: machineId != undefined ? machineId : undefined,
                lineId: lineDetail.value,
                lineAd: lineDetail.label,
                code: code,
                name: name,
                barcodeReaderId: barcodeReaderId,
                ledNumber: ledCounter,
                inputCameraId: inputCameraId?.value,
                outputCameraId: outputCameraId?.value,
              })
            }}>
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
              noDataComponent={"Makine Bulunamadı"}
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

export default MachineList;
