import {
  Card,
  Row,
  Col,
  Input,
  Label,
  CardFooter,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  UncontrolledTooltip,
  Tooltip,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { ChevronDown, Edit, Info, PlusSquare, Printer } from "react-feather";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { dateFormat, serverDateFormat } from "../../../utility/Constants";

import "@styles/react/libs/tables/react-dataTable-component.scss";
import { Link, useHistory } from "react-router-dom";
import CustomPagination from "../../../@core/components/gridTable/CustomPagination";
import ExportPdf from "../../../@core/components/gridTable/ExportPdf/exportPdf.js";
import ExportExcel from "./ExportExcel";
import ClassicDataTable from "./ClassicDataTable";
const ExpandableTable = (props) => {
  const history = useHistory();
  const { productionProcess, searchValue, noDataText } = props;
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_ENDPOINT + "api/Production/GetProductionProcessAll?ps=" + productionProcess)
      .then((response) => {
        console.log(response.data.data)
        setData(response.data.data);
      });
  }, []);
  
  const [data, setData] = useState([]);
  useEffect(() => {
    const value = searchValue;
    let updatedData = [];
    if (value.length) {
    
      updatedData = data.filter((item) => {
        const startsWith =

          item?.orderNo?.toLowerCase?.().startsWith(value.toLowerCase()) ||
          item?.aciklama?.toString().toLowerCase?.().startsWith(value.toLowerCase()) ||

          item?.uretimAdi?.toString().toLowerCase?.().startsWith(value.toLowerCase()) 

        const includes =
          item?.orderNo?.toLowerCase?.().startsWith(value.toLowerCase()) ||
          item?.aciklama?.toString().toLowerCase?.().startsWith(value.toLowerCase()) ||
          item?.uretimAdi?.toString().toLowerCase?.().startsWith(value.toLowerCase()) 


        if (startsWith) {
          return startsWith;
        } else if (!startsWith && includes) {
          return includes;
        } else return null;
      });
      setFilteredData(updatedData);
    }
  }, [searchValue])

  const columns = [

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
      maxWidth: "200px",
      sortable: true,
      selector: (row) =>
      row.startDate != null ?       new Date(row.startDate).toLocaleDateString() : null
    },
    {
      name: 'Oluşturma Tarihi',
      maxWidth: "200px",
      sortable: true,
      selector: row => row.createDate != null ? moment(row.createDate, serverDateFormat).format(dateFormat) : null
    },
    //!= null ?  row.previousProcess.explanation:null
    {
      name: "Route",
      sortable: true,
      maxWidth: "50px",
      selector: (row) => row.previousProcess ,
    },
    {
      name: <Fragment><Button.Ripple
        outline
        id="pdfPrint"
        className="btn-icon rounded-circle pull-right"
        color="danger"
        onClick={() => {
          ExportPdf(searchValue.length ? filteredData : data, "uretimRapor", "ÜRETİM RAPORU");
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
          ExportExcel(searchValue.length ? filteredData : data, "uretimRapor", "ÜRETİM RAPORU");
        }}
      >
          <Printer size={17} />
        </Button.Ripple>
      </Fragment>,
      allowOverflow: true,
      maxWidth: "150px",
      innerHeight: 20,
      cell: (row) => {
        return (
          <div className="d-flex">
            <Button.Ripple
              className="btn-icon"
              color="flat-primary"
              onClick={() => { openDetail(row.id,row.previousProcess) }}
            >
              <Info size={18} />
            </Button.Ripple>
          </div>
        );
      },
    },
  ];
  const openDetail = (id,previousProcess) => {
    let path = history.location.pathname + "/" + id+ "/" +previousProcess;
    history.push(path);
  };
  const [currentRow, setCurrentRow] = useState(null);
  const [rowCount, setRowCount] = useState(window.screen.height < 801 ? 8 : 11);
  const [dataLog, setDataLog] = useState([]);
  const columnsLog = [
    {
      name: "Tarih",
      sortable: true,

      selector: (row) =>
        new Date(row.date).toLocaleDateString() +
        " " +
        new Date(row.date).toLocaleTimeString(),
    },
    {
      name: "üretim Zaman Durumu",
      sortable: true,
      selector: (row) => row.productionTimeStatus,
    },
    {
      name: "Mola Sebebi",
      sortable: true,
      selector: (row) => row.restCause === null ? "" : row.restCause,
    },
    {
      name: "Mola Açıklaması",
      sortable: true,
      selector: (row) => row.message === null ? "" : row.message,
    },

    {
      name: "Geçen Süre",
      sortable: true,
      selector: (row) =>   row.elapsedTime!=undefined ? row.elapsedTime.split(".")[0] === "00:00:00" ? "" : row.elapsedTime.split(".")[0]:null,
    },
    {
      name: "Ad Soyad",
      sortable: true,
      selector: (row) => row.userAd + " " + row.userSoyad,
    },
    {
      name: <Fragment><Button.Ripple
        outline
        id="pdfPrint"
        className="btn-icon rounded-circle pull-right"
        color="danger"
        onClick={() => {
          ExportPdf(dataLog,  "uretimLog", "ÜRETİM LOG");
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
          ExportExcel(dataLog, "uretimLog", "ÜRETİM LOG");
        }}
      >
          <Printer size={17} />
        </Button.Ripple>
      </Fragment>,
      allowOverflow: true,
      maxWidth: "150px",
      innerHeight: 20,
      cell: (row) => {
        return (
          <div className="d-flex">
            <Button.Ripple
              className="btn-icon"
              color="flat-primary"
              onClick={() => { openDetail(row.id,row.previousProcess) }}
            >
              <Info size={18} />
            </Button.Ripple>
          </div>
        );
      },
    },
  ];
  const customStyles = {
    head: {
      style: {
        height: '60px',

      },
    },
    headCells: {
      style: {
        height: '60px',

      },
    },
  };//datatable  header height props
  const [currentPage, setCurrentPage] = useState(0);


  const ExpandableTable = ({ data }) => {
    return (
      <div className="expandable-content p-2">
        <Row style={{ width: "100%" }}>
          <Col xs={1}></Col>
          <Col xs={10}>
            <ClassicDataTable data={dataLog} columns={columnsLog} noDataText="Log Kaydı Bulunamadı" searchValue="" />
          </Col>
          <Col xs={1}></Col>
        </Row>
      </div>
    );
  };
  const onRowClicked = (rowState, rowContent) => {
    setCurrentRow(rowContent)
    if (rowState) {
      axios
        .get(
          process.env.REACT_APP_API_ENDPOINT +
          "api/ProductionTimeProcecss/GetAllAsyncProductId?id=" +
          rowContent.id +
          "&ps=" + productionProcess
        )
        .then((response) => {
setDataLog(response.data)
          
        });
    }
  };
  return (
    <DataTable
      key={filteredData}
      noHeader
      heade
      pagination
      expandableRows
      expandableRowExpanded={(row) => (row === currentRow)}//sadece aktif detayı gösterir diğerlerini kapatır
      columns={columns}
      customStyles={customStyles}
      expandOnRowClicked
      onRowExpandToggled={onRowClicked}
      className="react-dataTable"
      sortIcon={<ChevronDown size={10} />}
      paginationPerPage={rowCount}
      paginationComponent={() => CustomPagination(searchValue.length ? filteredData : data, currentPage, (value) => setCurrentPage(value))}
      paginationDefaultPage={currentPage + 1}
      expandableRowsComponent={ExpandableTable}
      paginationRowsPerPageOptions={[10, 25, 50, 100]}
      data={searchValue.length ? filteredData : data}
      noDataComponent={noDataText}
    />
  );
};

export default ExpandableTable;
