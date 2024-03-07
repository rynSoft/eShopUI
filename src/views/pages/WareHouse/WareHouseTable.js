// ** React Imports
import { Fragment, useState, forwardRef, useEffect } from "react";

// ** Table Data & Columns
//import { data, columns } from '../data'
import '@styles/react/libs/tables/react-dataTable-component.scss'
// ** Add New Modal Component
import UpdateWareModal from "./UpdateWareModal";
import DeleteWareModal from "./DeleteWareModal";

import axios from "axios";
import AddWareHouseModal from "./AddWareHouseModal";
// ** Third Party Components
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import {

  ChevronDown,

  FileText,

  Plus,

  PlusSquare,

  Printer,

  Trash,

} from "react-feather";
import { useSelector, useDispatch } from "react-redux";
// import { ctgTableFalse } from "../../../redux/refreshData";
// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  Row,
  Col,
  Card,
  Input,
  Label,
  Button,
  CardTitle,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledButtonDropdown,
  Badge,
  UncontrolledTooltip,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  CardBody,
} from "reactstrap";
import { Link } from "react-router-dom";
import CustomPagination from "../../../@core/components/gridTable/CustomPagination";
import ExportPdf from "../../../@core/components/gridTable/ExportPdf/exportPdf";
import ExportExcel from "../../../@core/components/gridTable/ExportExcel";
// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className='form-check'>
    <Input type='checkbox' ref={ref} {...props} />
  </div>
));

const WareHouseTable = () => {
  const NoDataConst = "Depo Tanım verisi bulunamadı.";
  // ** States

  const getdata = () => {
    axios
      .get(process.env.REACT_APP_API_ENDPOINT + "api/WareHouse/GetAll")
      .then((response) => {
        setData(response.data.data);
      });
  };
  const [searchValue, setSearchValue] = useState('');
  const [modal, setModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const [data, setData] = useState([]);
  const [modalUptData, setModalUpdateData] = useState("");
  const [modalDeleteData, setModalDeleteData] = useState("");

  const [counterAdd, counterAddSet] = useState(2500);
  const [addModalState, setAddModalState] = useState(false);
  const addModal = () => {
    setAddModalState(true);
    counterAddSet(counterAdd + 1);
  };

  const updateModalController = (data) => {
    setModalUpdateData(data), showUptModalFunction();
  };
  const deleteModalController = (data) => {
    setModalDeleteData(data), showDeleteModalFunction();
  };
  const [filteredData, setFilteredData] = useState([]);
  const [modalUpdState, setUpdModalState] = useState(false);
  const [modalDeleteState, setModalDeleteState] = useState(false);
  const [counter, counterSet] = useState(0);
  const [counterDelete, counterDeleteSet] = useState(1000);
  const showUptModalFunction = () => {
    setUpdModalState(true);
    counterSet(counter + 1);
  };
  const showDeleteModalFunction = () => {
    setModalDeleteState(true);
    counterDeleteSet(counterDelete + 1);
  };
  const status = {
    true: { title: "Aktif", color: "light-success" },
    false: { title: "Pasif", color: "light-primary" },
  };

  const columns = [
    {
      name: "Kod",
      sortable: true,
      minWidth: "200px",
      
      selector: (row) => row.code,
    },
    {
      name: "Açıklama",
      sortable: true,
      minWidth: "150px",
   
      selector: (row) => row.name,
    },
    {
      name: "Aktif/Pasif",
      sortable: true,
      minWidth: "220px",
      maxWidth: "220px",
      cell: (row) => {
        return (
          <Badge className='text-center' color='light-primary' pill>
            {!row.active ? "Aktif" : "Pasif"}
          </Badge>
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
          ExportPdf(data, "DepoTanimListesi", "DEPO TANIM LİSTESİ");
        }}
      >
        <Printer size={17} />
      </Button.Ripple>
      <Button.Ripple
        outline
        id="excelPrint"
        className="btn-icon rounded-circle pull-right"
        color="success"
        style={{ marginLeft: 5 }}
        onClick={() => {
          ExportExcel(searchValue.length ? filteredData : data, "DepoTanimListesi", "DEPO TANIM LİSTESİ");
        }}
      >
          <Printer size={17} />
        </Button.Ripple>
      </Fragment>,
      allowOverflow: true,
      maxWidth: "20px",
      minWidth:"200px",
      allowOverflow: true,
      cell: (row) => (
        <div className='column-action d-flex align-items-center'>
          <FileText
            size={17}
            id={`pw-tooltipUpdate-${row.id}`}
            className='cursor-pointer'
            onClick={(e) => updateModalController(row)}
          />

          <UncontrolledTooltip
            placement='top'
            target={`pw-tooltipUpdate-${row.id}`}
          >
            Güncelle
          </UncontrolledTooltip>

          <Trash
            size={17}
            id={`pw-tooltips-${row.id}`}
            className='mx-1 cursor-pointer'
            onClick={(e) => deleteModalController(row)}
          />

          <UncontrolledTooltip placement='top' target={`pw-tooltips-${row.id}`}>
            Sil
          </UncontrolledTooltip>
        </div>
      ),
    },
  ];
  // ** Function to handle Pagination


  useEffect(() => {
    getdata();
  }, []);
  const handleFilter = e => {
    const value = e.target.value
    let updatedData = []
    setSearchValue(value)



    if (value.length) {
        updatedData = data.filter((item) => {
          const startsWith =
            item.code?.toLowerCase?.().startsWith(value.toLowerCase()) ||
            item.name?.toLowerCase?.().startsWith(value.toLowerCase()) 
  
          const includes =
          item.code?.toLowerCase?.().startsWith(value.toLowerCase()) ||
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
}


  // ** Converts table to CSV
  function convertArrayOfObjectsToCSV(array) {
    let result;

    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const keys = Object.keys(data[0]);

    result = "";
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach((item) => {
      let ctr = 0;
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];

        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }

  // ** Downloads CSV
  function downloadCSV(array) {
    const link = document.createElement("a");
    let csv = convertArrayOfObjectsToCSV(array);
    if (csv === null) return;

    const filename = "export.csv";

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", filename);
    link.click();
  }

  return (
    <Fragment>
       <div className='content-header row'>
                  <div className='content-header-left col-md-9 col-12 mb-2'>
                    <div className='row breadcrumbs-top'>
                        <div className='col-12'>
                            <h2 className='content-header-title float-start mb-0'>{'Depo Listesi'}</h2>
                            <div className='breadcrumb-wrapper vs-breadcrumbs d-sm-block d-none col-12'>
                                <Breadcrumb className='ms-1'>
                                    <BreadcrumbItem>
                                        <Link to='/'> Dashboard </Link>
                                    </BreadcrumbItem>
                                    <BreadcrumbItem>
                                        <span> Tanımlar </span>
                                    </BreadcrumbItem>
                                    <BreadcrumbItem>
                                        <span> Depo Tanımları</span>
                                    </BreadcrumbItem>
                                </Breadcrumb>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='content-header-right text-md-end col-md-3 col-12 d-md-block d-none'>
                    <div className='breadcrumb-right'>
                        <Button.Ripple className='btn-icon' color='primary' id='newProductionOrder'
                                       onClick={addModal}>
                            <PlusSquare size={20}/>
                        </Button.Ripple>
                        <UncontrolledTooltip placement='left' target='newProductionOrder'>
                            Yeni Depo Tanımı
                        </UncontrolledTooltip>
                    </div>
                </div></div>
      <Card>
      <Row className='justify-content-end mx-0'>
                    <Col className='d-flex align-items-center justify-content-end mt-1' md='6' sm='12'>
                        <Label className='me-1' for='search-input-1'> {'Ara'} </Label>
                        <Input
                            className='dataTable-filter mb-50'
                            type='text'
                            bsSize='sm'
                            id='search-input-1'
                         value={searchValue}
                           onChange={handleFilter}
                        />
                    </Col>
                </Row>
<CardBody>
        <div className='react-dataTable'>
          <DataTable
            noHeader
            pagination
            columns={columns}
            paginationPerPage={10}
            className='react-dataTable'
            sortIcon={<ChevronDown size={10} />}
            paginationDefaultPage={currentPage + 1}
            paginationComponent={ ()=>CustomPagination(searchValue.length ? filteredData : data,currentPage,(value)=>setCurrentPage(value))}
            data={searchValue.length ? filteredData : data}
            noDataComponent={"Depo Tanım Bulunamadı"}
            
          />
        </div>
        </CardBody>
      </Card>
      <AddWareHouseModal key={counterAdd} modalState={addModalState}    refreshFunction={getdata} />


      <UpdateWareModal
        key={counter}
        data={modalUptData}
        controller={modalUpdState}
        refreshFunction={getdata}
      />

      <DeleteWareModal
        key={counterDelete}
        data={modalDeleteData}
        controller={modalDeleteState}
        refreshFunction={getdata}
      />
    </Fragment>
  );
};

export default WareHouseTable;
