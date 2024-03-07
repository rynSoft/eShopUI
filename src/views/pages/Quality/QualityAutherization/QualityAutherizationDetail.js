import { Col, Row } from "antd";
import Cleave from "cleave.js/react";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { Check, CheckCircle, ChevronDown, Circle, Clipboard, Edit, File, Info, Pause, Play, PlayCircle, Plus, PlusCircle, PlusSquare, Printer, StopCircle, Trash2, XOctagon } from "react-feather";
import { Button, ButtonGroup, Card, Input, Label, Modal, ModalBody, ModalHeader, Nav, NavItem, NavLink, Table, UncontrolledTooltip } from "reactstrap";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import { useEffect } from "react";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { toast, Slide } from "react-toastify";
import PerfectScrollbar from "react-perfect-scrollbar";
import Avatar from "@components/avatar";
import axios from "axios";
import moment from "moment";
import { Fragment } from "react";
import ReactPaginate from "react-paginate";
import CustomPagination from "../../../../@core/components/gridTable/CustomPagination";

import { useSelector, useDispatch } from "react-redux";
import { qualityRefresh } from "../../../../redux/refreshData";
import { dateFormat, serverDateFormat } from "../../../../utility/Constants";
import QualityAutherizationModal from "./QualityAutherizationModal";

import toastData from "../../../../@core/components/toastData";
const QualityAutherizationDetail = (props) => {
   const newWorkingData = useDispatch();
   useEffect(() => {
      axios
         .get(
            process.env.REACT_APP_API_ENDPOINT +
            "api/Account/GetAllTaskQualityAsync?Id=" +
            JSON.parse(localStorage.getItem("userData")).id
         )
         .then((response) => {

            let processWorking = response.data.data.filter(
               (x) =>
                  x.qualityId == props.match.params.id && x.qualityProcess === 3
            );
            if (processWorking.length > 0) {
               axios
                  .get(
                     process.env.REACT_APP_API_ENDPOINT +
                     "api/Account/UpdateTaskQualityAsync?Id=" +
                     processWorking[0].id
                  )
                  .then((response) => {
                     newWorkingData(qualityRefresh());
                  });
            }

         });
   }, []);

   const [rowCount, setRowCount] = useState(window.screen.height < 801 ? 8 : 11);
   const [currentPage, setCurrentPage] = useState(0);
   const [currentRow, setCurrentRow] = useState(null);
   const NoDataConst = "Kalite Operasyonu Mevcut Değil";
   const NoDataConstLog = "Operasyon Detayı Yok";
   const [currentPageLog, setCurrentPageLog] = useState(0);
   const [data, setData] = useState([])
   const [workOrderNumber, setWorkOrderNumber] = useState("")

   const [completedButton, setCompletedButton] = useState(false)
   const [buttonName, setButtonName] = useState("Süreci Tamamla")
   const [operationList, setOperationList] = useState([])
   const [productionCode, setProductionCode] = useState("")
   const [serialCode, setSerialCode] = useState("")
   const [piece, setPiece] = useState()
   const [userData, setUserData] = useState([])
   const [nonConformanceCode, setNonConformanceCode] = useState("")
   const [qualityTypeList, setQualityTypeList] = useState([
      { id: 1, ad: "Repair" },
      { id: 2, ad: "Rework" },
   ]);
   const [qualityType, setQualityType] = useState(1);


   const [dataLog, setDataLog] = useState([]);
   const [filesList, setFilesList] = useState([]);
   const [processModal, setProcessModal] = useState(false);
   const [qualityEndModal, setQualityEndModal] = useState(false);
   const [operationId, setOperationId] = useState(0);
   const [qualityId, setqualityId] = useState(0);
   const [buttonDisabled, setButtonDisabled] = useState(false);
   const [searchValue, setSearchValue] = useState("");
   const [filteredData, setFilteredData] = useState([]);
   const columnsLog = [



      {
         name: "Tip",
         sortable: true,
         maxWidth: "100px",
         selector: (row) => row.qualityProcessType,
      },
      {
         name: "ürün kodu",
         sortable: true,
         selector: (row) => row.productionCode,
      },
      {
         name: "LOT",
         sortable: true,
         selector: (row) => row.lotInformation,
      },
      ,
      {
         name: "Açıklama",
         sortable: true,
         selector: (row) => row.description,
      },
      {
         name: "Miktar",
         sortable: true,
         selector: (row) => row.piece,
      },
      {
         name: "Tarih",
         sortable: true,

         selector: (row) =>
            new Date(row.createDate).toLocaleDateString() +
            " " +
            new Date(row.createDate).toLocaleTimeString(),
      }
   ];
   const onRowClicked = (rowState, rowContent) => {
      setCurrentPageLog(0);
      setCurrentRow(rowContent)
      if (rowState) {
         axios
            .get(
               process.env.REACT_APP_API_ENDPOINT +
               "api/QualityInfo/GetQualityOperation", { params: { id: rowContent.id } })
            .then((response) => {

               setDataLog(response.data.data)
            });

         axios
            .get(
               process.env.REACT_APP_API_ENDPOINT +
               "api/QualityOperationDocument/GetDocumentList", { params: { id: rowContent.id } })
            .then((response) => {
               setFilesList(response.data.data)

            });
      }
   };
   const calcDate = () => {

      let baslangic = new Date(currentRow?.startOperationDate);
      let bitis = new Date(currentRow?.endOperationDate);
      let zamanFark = Math.abs(bitis.getTime() - baslangic.getTime());
      var saniyeFark = Math.ceil(zamanFark / (1000))
      return "Toplam Operasyon Süresi:" + saniyeFark + " Saniye"


   }
   const downloadItem = (downloadFile) => {

      const blob = b64toBlob(downloadFile.data, downloadFile.dataType);
      const blobUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = blobUrl;
      let Type = downloadFile.dataType == "image/png" ? ".png" : "image/jpg" ? ".jpg" : downloadFile.dataType;
      Type = downloadFile.dataType == "application/pdf" ? ".pdf" : Type;
      Type = downloadFile.dataType == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ? ".xlsx" : Type;
      Type = downloadFile.dataType == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? ".docx" : Type;
      Type = downloadFile.dataType == "application/msword" ? ".doc" : Type;
      Type = downloadFile.dataType == "application/vnd.ms-excel" ? ".xls" : Type;
      a.download = new Date().toLocaleString() + "." + Type;
      a.click();
   }

   const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
         const slice = byteCharacters.slice(offset, offset + sliceSize);

         const byteNumbers = new Array(slice.length);
         for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
         }

         const byteArray = new Uint8Array(byteNumbers);
         byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
   }
   const ExpandableTable = ({ data }) => {

      return (<Fragment>
         <div className="expandable-content p-2 ">
            <DataTable
               key={dataLog}
               noHeader
               pagination
               data={dataLog}
               paginationPerPage={rowCount}
               columns={columnsLog}
               className="react-dataTable"
               sortIcon={<ChevronDown size={10} />}
               paginationComponent={ ()=>CustomPagination(dataLog,currentPageLog,(value)=>setCurrentPageLog(value))}
               paginationDefaultPage={currentPageLog + 1}
               paginationRowsPerPageOptions={[10, 25, 50, 100]}
               noDataComponent={NoDataConstLog}
               style={{ textAlign: "right" }}
            />
         </div>
         <div className="expandable-content p-2 " style={{ textAlign: "center" }}>
            <h5>Belgeler</h5>

            {filesList.map((x, index) => {

               return <Fragment key={index} > {x.dataType ? (x.dataType == "image/png" || x.dataType == "image/jpg" ? <img
                  className="rounded" src={`data:image/jpeg;base64,${x.data}`} height="28" width="28" style={{ margin: 20, cursor: "pointer" }}
                  onClick={() => downloadItem(x)}
               /> :
                  x.dataType == "application/pdf" ? <img
                     className="rounded" src={require('@src/assets/images/logo/pdf.png').default} height="28" width="28" style={{ margin: 20, cursor: "pointer" }}
                     onClick={() => downloadItem(x)} /> :
                     x.dataType == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || x.dataType == "application/vnd.ms-excel" ? <img style={{ margin: 20, cursor: "pointer" }}
                        className="rounded" src={require('@src/assets/images/logo/excel.png').default} height="28" width="28"
                        onClick={() => downloadItem(x)} /> :
                        x.dataType == "application/msword" || x.dataType == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? <img style={{ margin: 20, cursor: "pointer" }}
                           className="rounded" src={require('@src/assets/images/logo/word.png').default} height="28" width="28"
                           onClick={() => downloadItem(x)} /> : "diğer") : null}</Fragment>
            })

            }

            <h5>Belge Açıklaması</h5>{filesList.length > 0 ? filesList[0].description : null}
         </div>
         <div className="expandable-content p-2 " style={{ textAlign: "center" }}>
            {currentRow?.endOperation ? calcDate() : null}
         </div>
      </Fragment>
      );
   };


   const startJob = (obj) => {

      axios
         .get(
            process.env.REACT_APP_API_ENDPOINT +
            "api/QualityOperationDocument/GetDocumentList", { params: { id: obj.id } })
         .then((response) => {
            setFilesList(response.data.data)

         });
      setqualityId(obj.quality.id),
         setOperationId(obj.id),
         setProcessModal(true)
   }

   const operationEnd = (obj) => {
      setqualityId(obj.quality.id),
         setOperationId(obj.id),
         setQualityEndModal(true)
   }

   const operationStart = (obj) => {
      setButtonDisabled(true)
      axios.post(
         process.env.REACT_APP_API_ENDPOINT + "api/QualityOperation/StartOperation?id=" + obj.id,

      ).then((res) => {

         if (res.data.success) {


            data.find(o => o == obj).startOperation = true;
            data.find(o => o == obj).startOperationDate = new Date();
            toastData("Operasyon Süreci Başlatıldı.", true)

         }
         else {

            toastData("Operasyon Süreci Başlatılamadı.", false)
         }
         setButtonDisabled(false)
      }).catch((error) => { setButtonDisabled(false), toastData("Operasyon Süreci Başlatılamadı", false) });
   }



   const sureciTamamla = () => {

      axios.put(
         process.env.REACT_APP_API_ENDPOINT + "api/Quality/UpdateState?Id=" + props.match.params.id
      ).then((res) => {
        
         if (res.data.success) {
           setButtonName("Süreç Tamamlanmış");
            setCompletedButton(true)
            toastData("Süreç Başarıyla Tamamlandı", true)
         }
         else {
            toastData("Süreç  Tamamlanamadı", false)
         }
      });
   }



   const columns = [
      {
         name: "Operasyon Başlama T.",
         sortable: true,
         width: "225px",
         cell: (obj) => {
            return (<div >
               {moment(obj.startOperationDate, serverDateFormat).format(dateFormat)}
            </div>

            )
         }
      },
      {
         name: "Operasyon Bitirme T.",
         allowOverflow: true,
         width: "200px",
         cell: (obj) => {
            return (
               <div >
                  {moment(obj.endOperationDate, serverDateFormat).format(dateFormat)}
               </div>
            );
         },
      },
      {
         name: "OPERASYON",
         sortable: true,
         maxWidth: "500px",
         cell: (obj) => {
            return (<div>
               {obj.operation}
            </div>

            )
         }

      },
      {
         name: 'SORUMLU TEKNİSYEN',
         sortable: true,
         maxWidth: '450px',

         cell: (obj) => {
            return (
               <div>
                  {userData.find(x => x.id == obj.userLiableId)?.name}    {userData.find(x => x.id == obj.userLiableId)?.surName}
               </div>
            );
         },
      },
      {
         name: 'EKİP SÖZCÜSÜ',
         sortable: true,

         cell: (obj) => {
            return (<div>
               {userData.find(x => x.id == obj.userApprovingId)?.name}    {userData.find(x => x.id == obj.userApprovingId)?.surName}
            </div>
            );
         },
      },
      {
         name: 'KALİTE',
         sortable: true,

         cell: (obj) => {
            return (<div>
               {userData.find(x => x.id == obj.authorizedPersonId)?.name}    {userData.find(x => x.id == obj.authorizedPersonId)?.surName}
            </div>
            );
         },
      },
      {
         name: 'Onaylanma T.',
         sortable: true,
         cell: (obj) => {
            return (<div>
               {obj.editDate == "0001-01-01T00:00:00+00:00" ? "Onay Bekliyor" : moment(obj.editDate, serverDateFormat).format(dateFormat)}
            </div>
            );
         },
      },


      {
         name: "BELGELER",
         allowOverflow: true,
         width: "150px",
         cell: (obj) => {
            return (
               <div >

                  <Fragment>
                     <Button.Ripple disabled={buttonDisabled} outline className="btn-icon  pull-right" color={'info'} id={'belge'} onClick={() => {
                        {
                           startJob(obj)
                        }
                     }}>
                        <File size={14} />
                     </Button.Ripple>
                     <UncontrolledTooltip placement='left' target={'belge'}>
                        Belgeler
                     </UncontrolledTooltip>
                  </Fragment>



               </div>
            );
         },
      },
   ];

   const [operation, setOperation] = useState([""]);
   useEffect(() => {
      axios
         .get(process.env.REACT_APP_API_ENDPOINT + "api/Account/GetAllAsync")
         .then((res) => {
            if (res.data.data.length > 0) {
               setUserData(res.data.data);
            }
         });
   }, []);
   useEffect(() => {
      if (!processModal) {
         getData();
      }

   }, [processModal]);

   const getData = () => {
      axios
         .get(process.env.REACT_APP_API_ENDPOINT + "api/QualityOperation/GetUserAutherizationDetail", { params: { id: props.match.params.id } })
         .then((res) => {
            if (res.data.data.length > 0) {
               setButtonDisabled(false);
               setData(res.data.data)
               setOperationList(res.data.data)
               setNonConformanceCode(res.data.data[0].quality.nonComplianceCode);
               setPiece(res.data.data[0].quality.piece)
               setProductionCode(res.data.data[0].quality.productionCode)
               setQualityType(qualityTypeList.find(x => x.ad == res.data.data[0].quality.qualityType).id);
               setSerialCode(res.data.data[0].quality.serialCode)
               setWorkOrderNumber(res.data.data[0].quality.workOrderNumber)
            }
         });

      axios
         .get(process.env.REACT_APP_API_ENDPOINT + "api/QualityOperation/EndProcess", { params: { id: props.match.params.id } })
         .then((res) => {
        
            if (res.data.success) {
               res.data.message=="Sonlandırıldı" ? setButtonName("Süreç Tamamlanmış"):setButtonName("Süreci Tamamla")
               setCompletedButton(true)
            }
            else {
               setCompletedButton(false)
              
            }
       
         });
   }
   const styles = {
      menuList: (base) => ({
         ...base,
         height: "200px",

         "::-webkit-scrollbar": {
            width: "9px"
         },
         "::-webkit-scrollbar-track": {
            background: "dark"
         },
         "::-webkit-scrollbar-thumb": {
            background: "#888"
         },
         "::-webkit-scrollbar-thumb:hover": {
            background: "#555"
         }
      })
   }
   return (
      <Fragment>
         <QualityAutherizationModal modalState={processModal} setModal={setProcessModal} filesList={filesList} toastData={toastData} />

         <Card>


            <Row>
               <Col span={6} style={{ paddingLeft: 10 }}>    <div className="mb-1">
                  <Label className="form-label" for="ad">
                     İş Emri No
                  </Label>
                  <Cleave
                     className="form-control"
                     placeholder="İş Emri No"
                     maxLength={30}
                     disabled={true}
                     id="numeral-formatting"
                     onChange={(event) => setWorkOrderNumber(event.target.value)}
                     value={workOrderNumber}
                  />
               </div>
                  <div className="mb-1">
                     <Label className="form-label" for="ad">
                        Ürün Kodu
                     </Label>
                     <Cleave
                        className="form-control"
                        placeholder="Ürün Kodu"
                        maxLength={30}
                        disabled={true}
                        id="numeral-formatting"
                        onChange={(event) => setProductionCode(event.target.value)}
                        value={productionCode}
                     />
                  </div>

                  <div className="mb-1" style={{ visibility: piece != 1 ? "hidden" : "visible" }}>
                     <Label className="form-label" for="serino">
                        Seri No
                     </Label>

                     <Cleave
                        className="form-control"
                        placeholder="Seri Numarası"
                        maxLength={30}
                        id="numeral-formatting"
                        disabled={true}
                        onChange={(event) => setSerialCode(event.target.value)}
                        value={serialCode}
                     />
                  </div>
               </Col>  <Col span={6} style={{ marginLeft: 20 }}  >
                  <div className="mb-1">
                     <Label className="form-label" for="ürün">
                        Ürün Adet
                     </Label>


                     <Cleave

                        className="form-control"
                        placeholder="Ürün Adet Bilgisi"
                        maxLength={30}
                        options={{
                           numeral: true,

                        }}
                        disabled={true}
                        id="numeral-formatting"
                        onChange={(event) => setPiece(event.target.value)}
                        value={piece}
                     />
                  </div>
                  <div className="mb-1">
                     <Label className="form-label" for="uygunsuzluk">
                        Uygunsuzluk Kodu
                     </Label>

                     <Cleave
                        className="form-control"
                        placeholder="Uygunsuzluk Kodu"
                        maxLength={30}
                        disabled={true}
                        id="numeral-formatting"
                        onChange={(event) => setNonConformanceCode(event.target.value)}
                        value={nonConformanceCode}
                     />
                  </div>

               </Col>
               <Col span={24} style={{ paddingLeft: 10 }}>


                  <div className="mb-1 text-center">
                     <h3>TAMAMLANAN OPERASYONLAR</h3>
                  </div>

                  <div className="react-dataTable" >
                     <DataTable
                        noHeader

                        pagination
                        expandableRows
                        expandableRowExpanded={(row) => (row === currentRow)}//sadece aktif detayı gösterir diğerlerini kapatır
                        columns={columns}
                        expandOnRowClicked
                        onRowExpandToggled={onRowClicked}
                        className="react-dataTable"
                        sortIcon={<ChevronDown size={10} />}
                        paginationPerPage={rowCount}
                        paginationComponent={ ()=>CustomPagination(searchValue.length ? filteredData : data,currentPage,(value)=>setCurrentPage(value))}
      
                        paginationDefaultPage={currentPage + 1}
                        expandableRowsComponent={ExpandableTable}
                        paginationRowsPerPageOptions={[10, 25, 50, 100]}
                        data={searchValue.length ? filteredData : data}
                        noDataComponent={NoDataConst}
                        style={{ textAlign: "center" }}
                     />
                  </div>



               </Col>
            </Row>
         </Card>
      </Fragment>
   );
};

export default QualityAutherizationDetail;
