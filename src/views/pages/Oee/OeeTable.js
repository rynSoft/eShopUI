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

import CustomPagination from "../../../@core/components/gridTable/CustomPagination";
import ExportPdf from "../../../@core/components/gridTable/ExportPdf/exportPdf.js";
import ExportExcel from "../../../@core/components/gridTable/ExportExcel";
import OeeChart from "./OeeChart.js"
const OeeTable = (props) => {
 
  const { data} = props;

  const [name, setName] = useState(["1","2"]);
  const [elapsadTime, setElapsadTime] = useState([2,3]);
  const gridColumnName = (title,headerWidth) => {

      return  <div style={  { whiteSpace:'pre-wrap', overflowWrap: 'break-word',width:headerWidth,paddingLeft:5}}>
     {title}
  </div>

  };
  const columns = [
    {
      name: gridColumnName("Tarih",110),
      sortable: true,
      width: "110px",
      maxWidth: "110px",
      selector: (row) =>
        row.dates != null ? new Date(row.dates).toLocaleDateString() : null
    },
    // {
    //   name: gridColumnName("PR-Id",70),
    //   sortable: true,
    //   width: "70px",
    //   maxWidth: "70px",
    //   selector: (row) => row.productionId,
    // },
    {
      name: gridColumnName("Ürün",140),
      sortable: true,
      width: "140px",
      selector: (row) => row.product,
    },
    {
      name: gridColumnName("Hat",120),
      sortable: true,
      width: "120px",
      selector: (row) => row.lineAd,
    },
    {
      name: gridColumnName("Vardiya",100),
      sortable: true,
      width: "100px",
      selector: (row) => row.vardiyaAd,
    },
    {
      name: gridColumnName("Operatör",140),
      sortable: true,
      width: "140px",
      selector: (row) => row.operator,
    },
    {
      name:gridColumnName("Başlgç",100),
      sortable: true,
      width: "100px",
      maxWidth: "100px",
      selector: (row) => row.shiftBeginTime,
    },
    {
      name: gridColumnName("Bitiş",100),
      sortable: true,
      width: "100px",
      maxWidth: "100px",
      selector: (row) => row.shiftEndTime,
    },
    {
      name:  gridColumnName("Mola/ Yemek",90),
      sortable: true,
      width: "90px",
      maxWidth: "90px",
      selector: (row) => row.breakTime,
    },
    {
      name: gridColumnName("Toplam Çalışma",105) ,
      sortable: true,
      width: "105px",
      maxWidth: "105px",
      selector: (row) => row.totalWork,
    },
    {
      name: gridColumnName("Toplam Duruş",120) ,
      sortable: true,
      width: "120px",
      maxWidth: "120px",
      selector: (row) => row.totalStops,
    },
    {
      name:  gridColumnName("Kullanılabilir Zaman",145),
      sortable: true,
      width: "145px",
      maxWidth: "145px",
      selector: (row) => row.totalWorkHour ,
    },
    // {
    //   name:  gridColumnName("Klnblrr Zmn (dk)",100),
    //   sortable: true,
    //   width: "100px",
    //   maxWidth: "100px",
    //   selector: (row) => row.totalWorkMinute,
    // },
    {
      name: gridColumnName("Yükleme Seviyesi",105) ,
      sortable: true,
      width: "105px",
      maxWidth: "105px",
      selector: (row) => parseInt(row.loadingLevel),
    },

  
    {
      name:gridColumnName("Teorik Hız",95) ,
      sortable: true,
      width: "95px",
      width: "95px",
      selector: (row) => row.teoricSpeed,
    },
    {
      name:gridColumnName("Üretilebilecek Panel Adeti",135) ,
      sortable: true,
      width: "135px",
      maxWidth: "135px",
      selector: (row) => parseInt(row.totalWorkMinute / row.teoricSpeed) ,
    },
    {
      name: gridColumnName("Üretilen Kart Adeti",100) ,
      sortable: true,
      width: "100px",
      maxWidth: "100px",
      selector: (row) => parseInt(row.producedCard),
    },
    {
      name:gridColumnName("Performans Seviyesi",135) , 
      sortable: true,
      width: "135px",
      maxWidth: "135px",
      selector: (row) => parseInt((row.performanceLevel / (row.totalWorkMinute / row.teoricSpeed )) * 100),
    },
    
    {
      name:gridColumnName(" Sağlam Kart Adt",100),
      sortable: true,
      width: "100px",
      maxWidth: "100px",
      selector: (row) => parseInt(row.durableCard),
    },
    {
      name:gridColumnName("Uygunsuz Ürün",120) ,
      sortable: true,
      width: "120px",
      maxWidth: "120px",
      selector: (row) => parseInt(row.improrerCard),
    },

    {
      name: gridColumnName("Kalite Seviyesi",100) ,
      sortable: true,
      width: "100px",
      maxWidth: "100px",
      selector: (row) => parseInt(row.qualityLevel),
    },
    {
      name: gridColumnName("OEE",90) ,
      sortable: true,
      width: "90px",
      selector: (row) => parseInt((
        (row.loadingLevel / 100) * 
         (((row.performanceLevel / (row.totalWorkMinute / row.teoricSpeed )) * 100)/ 100) 
         * (row.qualityLevel/ 100)
      )*100) ,
    },

    
    {
      name: <Fragment><Button.Ripple
        outline
        id="pdfPrint"
        className="btn-icon rounded-circle pull-right"
        color="danger"
        onClick={() => {
          ExportPdf(data, "oeeHesaplama", "OEE HESAPLAMA RAPORU");
        }}
      >
        <Printer size={17} />
      </Button.Ripple><Button.Ripple
        outline
        id="excelPrint"
        className="btn-icon rounded-circle pull-right"
        color="success"
     
        onClick={() => {
          ExportExcel( data, "oeeHesaplama", "OEE HESAPLAMA RAPORU");
        }}
      >
          <Printer size={17} />
        </Button.Ripple>
      </Fragment>,
      allowOverflow: true,

      width: "125px",
      innerHeight: 20,

    },
  ];

  const [currentRow, setCurrentRow] = useState();
  const [chartData, setChartData] = useState([]);
  const [rowCount, setRowCount] = useState(window.screen.height < 801 ? 8 : 11);
  

  const customStyles = {
    head: {
      style: {
        height: '90px',


      },
    },
    headCells: {
      style: {
        height: '90px',

     
      },
    },
  };//datatable  header height props
  const [currentPage, setCurrentPage] = useState(0);


  const ExpandableTable = ({ data }) => {
    return (
      <div className="expandable-content p-2">
        <Row style={{ width: "100%" }}>
       
        <Col xs={2}>
         </Col>
          <Col xs={3}>
            
          <Row style={{ fontSize:"30px" }} >Y {new Date(currentRow.dates).toLocaleDateString()}</Row>
          <Row style={{ fontSize:"26px" }} >{currentRow.product} - {currentRow.operator} - {currentRow.lineAd} - {currentRow.vardiyaAd}</Row>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <Row style={{ fontSize:"26px" }} > TOPLAM DURUŞ </Row>
          <Row style={{ fontSize:"26px" }} > {currentRow.totalWorkMinute} DK.</Row>
          </Col>
          <Col  xs={3}>
             <OeeChart  chartData={chartData}/>
          </Col>
          <Col xs={4}>
          <Row style={{ fontSize:"26px" }} >PERFORMANS % {parseInt((currentRow.performanceLevel / (currentRow.totalWorkMinute / currentRow.teoricSpeed )) * 100)}</Row>
          <Row style={{ fontSize:"26px" }} >YÜKLEME % {parseInt(currentRow.loadingLevel)}</Row>
          <Row style={{ fontSize:"26px" }} >KALİTE % {parseInt(currentRow.qualityLevel)}</Row>
          <br></br>
          <br></br>
          <br></br>
          {/* <Row style={{ fontSize:"26px" }} >ÜRETİLEBİLECEK POTANSİYEL {parseInt(row.totalWorkMinute / row.teoricSpeed)}</Row> */}
          <Row style={{ fontSize:"26px" }} >ÜRETİLEN KART ADETİ  {parseInt(currentRow.producedCard)}</Row>
          <Row style={{ fontSize:"26px" }} >ÜRETİLEBİLECEK KART ADETİ {parseInt(currentRow.qualityLevel)}</Row>
          <Row style={{ fontSize:"26px" }} >HATALI KART ADETİ {currentRow.improrerCard}</Row>
         </Col>

        </Row>
        <Row  className="justify-content-center" style={{ fontSize:"38px", color :"yellowgreen"  }}>

        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; OEE  :  {parseInt((
        (currentRow.loadingLevel / 100) * 
         (((currentRow.performanceLevel / (currentRow.totalWorkMinute / currentRow.teoricSpeed )) * 100)/ 100) 
         * (currentRow.qualityLevel/ 100)
      )*100)}
        </Row>
      </div>
    );
  };

  
  const onRowClicked = async (rowState, rowContent) => {
    await setCurrentRow(rowContent);
    if (rowState) {
      axios
        .get(
          process.env.REACT_APP_API_ENDPOINT +
            "api/Oee/GetRestCauseTimeGroup?shiftTargetParametersId="
          +rowContent.id 
        )
        .then((response) => {
            setChartData(response.data)
        });
    }
  };
  return (
    <DataTable
   
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
      paginationComponent={() => CustomPagination(data, currentPage, (value) => setCurrentPage(value))}
      paginationDefaultPage={currentPage + 1}
      expandableRowsComponent={ExpandableTable}
      paginationRowsPerPageOptions={[10, 25, 50, 100]}
      data={ data}
      noDataComponent={"Veri Bulunamadı"}
    />
  );
};

export default OeeTable;
