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
import { AvForm, AvField } from "availity-reactstrap-validation";
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

const ShiftDefinitionProcessList = (props) => {
  const { userData } = props;
  
  const [data, setData] = useState([]);
  const [buttonName, setButtonName] = useState("Ekle");
  const [name, setName] = useState("");
  const [startPicker, setStartPicker] = useState([new Date()])
  const [endPicker, setEndPicker] = useState([new Date()])
  const [shiftProcessId, setShiftProcessId] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [disabledButton, setDisabledButton] = useState(false);
  const [selectionModal, setSelectionModal] = useState(false);

  const [lineData, setLineData] = useState([
    { id: 0, name: "Hat Yok" },
]);
const [lineDetail, setLineDetail] = useState({ value: 0, label: 'Hat Yok' })

const [shiftList, setShiftList] = useState([
    { id: 0, name: "Vardiya Yok" },
]);
const [selectShift, setSelectShift] = useState({ value: 0, label: 'Vardiya Yok' })
const [quantity, setQuantity] = useState("")
const [description, setDescription] = useState("")
const [form, setForm] = useState();
useEffect(() => {

  axios.get(process.env.REACT_APP_API_ENDPOINT + 'api/Line/GetAllFilter').then(response => {
      if (response.data.data.length > 0) {
          setLineData(response.data.data)
          setLineDetail({ value: response.data.data[0].id, label: response.data.data[0].name })
      }
  })

  axios.get(process.env.REACT_APP_API_ENDPOINT + 'api/ShiftDefinition/GetAllFilter').then(response => {
      if (response.data.data.length > 0) {
          setShiftList(response.data.data)
          setSelectShift({ value: response.data.data[0].id, label: response.data.data[0].name })
      }
  })
}, []);

  const addParameters = {
    id: shiftProcessId != undefined ? shiftProcessId : undefined,
    name: name,
    // startDate: startPicker[0].toLocaleTimeString(),
    // endDate: endPicker[0].toLocaleTimeString(),
  };


  const shiftUpdate = (newState, rowId, names,startDates,endDates) => {
    setDisabledButton(true);
    axios
      .post(
        process.env.REACT_APP_API_ENDPOINT +
        "api/ShiftDefinitionProcess/Update", { id: rowId, active: newState, name : names,startDate : startDates ,endDate : endDates  }

      )
      .then((res) => {
        if (res.data.success) {
          loadData();
          toastData("Vardiya Hedefi Başarıyla Güncellendi", true);
        }
        else {
          toastData("Vardiya Hedefi Başarıyla Güncellenemedi", false);
        }
        setDisabledButton(false);
      });

  };

  let parameters = {
    explanation:description,
    shiftDefinitionId: selectShift.value,
    lineId: lineDetail.value,
    userId: userData?.id,
    targetQuantity: quantity
}
  const saveData = () => {
   
    axios
        .post(
            process.env.REACT_APP_API_ENDPOINT + "api/ShiftDefinitionProcess/Add",
            parameters
        )
        .then((res) => {
            if (res.data.success) {
                toastData("Vardiya Hedefi Başarıyla Eklendi", true);
                setQuantity('');
                form && form.reset();
                setSelectionModal(false);
                loadData();
            } else {
                toastData(res.data.message, false);
            }
        })
        .catch((err) => toastData("Vardiya Hedefi  Eklenemedi!", false));
};


  const deleteData = () => {

    axios
      .delete(process.env.REACT_APP_API_ENDPOINT + "api/ShiftDefinitionProcess/Delete?Id=" + shiftProcessId)
      .then((res) => {
        if (res.data.success) {
          setSelectionModal(false);
          loadData();
          toastData("Vardiya Hedefi Başarıyla Silindi", true);
        } else {
          toastData("Vardiya Hedefi Silinemedi !", false);
        }
      })
      .catch((err) => toastData("Vardiya Hedefi Silinemedi !", false));
  };
  const columns = [
    {
      name: "Tarih",
      sortable: true,
      maxWidth: "200px",
      selector: (row) => new Date(
        row.createDate
      ).toLocaleDateString() ,


    },
    {
      name: "Vardiya Adı",
      sortable: true,
      maxWidth: "300px",
      selector: (row) => row.shiftDefinitionName,
    },
    {
      name: "Hat Numarası",
      sortable: true,
      selector: (row) => row.lineNumber,
    },
    {
      name: "Hat Adı",
      sortable: true,
      selector: (row) => row.lineName,
    },
    {
      name: "Hedef Miktarı",
      sortable: true,
      selector: (row) => row.targetQuantity,
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
          ExportPdf(data, "VardiyaTanimListesi", "VARDİYA HEDEF MİKTAR LİSTESİ");
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
          ExportExcel(searchValue.length ? filteredData : data, "VardiyaTanimListesi", "VARDİYA HEDEF MİKTAR LİSTESİ");
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
                 setShiftProcessId(row.id),
                  setButtonName("Sil"),
                //  setSelectionModal(true),

                //  setName(row.name);
                  deleteData();
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
      .get(process.env.REACT_APP_API_ENDPOINT + "api/ShiftDefinitionProcess/GetAll")
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
                {"Vardiya - Hat Tanımları Listesi"}
              </h2>
              <div className="breadcrumb-wrapper vs-breadcrumbs d-sm-block d-none col-12">
                <Breadcrumb className="ms-1">
               
                  <BreadcrumbItem>
                    <span> Tanımlar </span>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <span> Vardiya - Hat Tanımları Listesi</span>
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
                  setShiftProcessId(undefined),
                  setName("")
              }}
            >
              <PlusSquare size={20} />
            </Button.Ripple>
            <UncontrolledTooltip placement="left" target="newProductionOrder">
                Vardiyadaki Hatların Hedef Miktarı Tanımı
            </UncontrolledTooltip>
          </div>
        </div>
      </div>
 
      <Modal
                isOpen={selectionModal}
                toggle={() => setSelectionModal(!selectionModal)}
                className='modal-dialog-centered modal-lg'
                contentClassName='pt-0'
            >
                <ModalHeader className='mb-1' tag='div'  toggle={() => setSelectionModal(!selectionModal)}>
                    <h5 className='modal-title'>Vardiyadaki Hat Hedef Tanımlama Ekranı</h5>
                </ModalHeader>
                <ModalBody>
                    <AvForm onValidSubmit={saveData} ref={c => (setForm(c))}>
                        <div className="mb-1">
                            <Label className="form-label" for="Hat">
                                Vardiya
                            </Label>
                            <Select
                                isClearable={false}
                                className='react-select'
                                classNamePrefix='select'
                                options={shiftList.map((option) => (
                                    { value: option.id, label: option.name }
                                ))}
                                theme={selectThemeColors}
                                defaultValue={selectShift}
                                value={selectShift}
                                onChange={(event) => setSelectShift({ value: event.value, label: event.label })}
                            />
                        </div>
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
                            <Label className="form-label" for="names">
                                Hedef Miktarı
                            </Label>
                            <AvField
                                name="names"
                                placeholder="Hedef Miktarı"
                                type="number"
                                onChange={(event) => setQuantity(event.target.value)}
                                value={quantity}
                                validate={{
                                    pattern: { value: "^[0-9]+$", errorMessage: 'Sayısal Değer İçermeli' },
                                    required: { value: true, errorMessage: "Hedef Miktar Boş Olamaz" },
                                    maxLength: { value: 10, errorMessage: "En Fazla 10 Karakter" },
                                }}
                            />
                        </div>
                        <div className="mb-1">
                            <Label className="form-label" for="code">
                                Açıklama
                            </Label>
                            <Input
                                id='code'
                                type="textarea"
                                placeholder='Açıklama'
                                onChange={(event) => setDescription(event.target.value)}
                                value={description}
                            />
                        </div>
                       

                        <div className="text-center">
                            <Button className="me-1" color="primary">
                                Kaydet
                            </Button>
                            <Button className="me-1" color="secondary" outline onClick={() => setShiftDefinitionModal(false
                            )} >
                                Kapat
                            </Button>

                        </div>
                    </AvForm>
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

export default ShiftDefinitionProcessList;
