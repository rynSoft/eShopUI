import { Col, Row } from "antd";
import Cleave from "cleave.js/react";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { Check, CheckCircle, ChevronDown, Circle, Clipboard, Edit, FilePlus, Info, Pause, Play, PlayCircle, Plus, PlusCircle, PlusSquare, Printer, StopCircle, Trash2, XOctagon } from "react-feather";
import { Button, ButtonGroup, Card, Input, Label, Modal, ModalBody, ModalHeader, Nav, NavItem, NavLink, Table, UncontrolledTooltip } from "reactstrap";

import { useEffect } from "react";
import "@styles/react/libs/tables/react-dataTable-component.scss";

import axios from "axios";
import moment from "moment";
import { Fragment } from "react";
import toastData from "../../../../@core/components/toastData";
import QualityProcessModal from "./QualityProcessModal";
import { useSelector, useDispatch } from "react-redux";
import { qualityRefresh } from "../../../../redux/refreshData";
import { dateFormat, serverDateFormat } from "../../../../utility/Constants";
import QualityOperationEndModal from "./QualityOperationEndModal";
import CustomPagination from "../../../../@core/components/gridTable/CustomPagination";
const QualityOperationDetail = (props) => {
   const newWorkingData = useDispatch();
   const userQualityWorker = useSelector((state) => state.refreshData.qualityList);
   const [qualityEndModal, setQualityEndModal] = useState(false);
   useEffect(() => {
      if(!qualityEndModal){
         let processWorking = userQualityWorker.filter(
            (x) =>
               x.qualityId == props.match.params.id && x.qualityProcess === 1
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
      }

   }, [userQualityWorker,qualityEndModal]);

   const [rowCount, setRowCount] = useState(window.screen.height < 801 ? 8 : 11);
   const [currentPage, setCurrentPage] = useState(0);
   const [currentRow, setCurrentRow] = useState(null);
   const NoDataConst = "Kalite Operasyonu Mevcut Değil";
   const NoDataConstLog = "Operasyon Detayı Yok";
   const [currentPageLog, setCurrentPageLog] = useState(0);
   const [data, setData] = useState([])
   const [workOrderNumber, setWorkOrderNumber] = useState("")
   const [operationList, setOperationList] = useState([])
   const [productionCode, setProductionCode] = useState("")
   const [serialCode, setSerialCode] = useState("")
   const [completedButton, setCompletedButton] = useState(false)
   
   const [piece, setPiece] = useState()
   const [userData, setUserData] = useState([])
   const [nonConformanceCode, setNonConformanceCode] = useState("")
   const [qualityTypeList, setQualityTypeList] = useState([
      { id: 1, ad: "Repair" },
      { id: 2, ad: "Rework" },
   ]);
   const [qualityType, setQualityType] = useState(1);


   const [dataLog, setDataLog] = useState([]);
   const [processModal, setProcessModal] = useState(false);

   const [modalType, setModalType] = useState("Tamamla");
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
      }
   };
   const calcDate = () => {

      let baslangic = new Date(currentRow?.startOperationDate);
      let bitis = new Date(currentRow?.endOperationDate);
      let zamanFark = Math.abs(bitis.getTime() - baslangic.getTime());
      var saniyeFark = Math.ceil(zamanFark / (1000))
      return "Toplam Operasyon Süresi:" + saniyeFark + " Saniye"


   }
   const ExpandableTable = ({ data }) => {

      return (<Fragment>
         <div className="expandable-content p-2 ">
            <DataTable
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
            {currentRow?.endOperation ? calcDate() : null}
         </div>
      </Fragment>
      );
   };



   const startJob = (obj) => {

      setqualityId(obj.quality.id),
         setOperationId(obj.id),
         setProcessModal(true)
   }

   const operationEnd = (obj, newModalType) => {
      setModalType(newModalType)
      setqualityId(obj.quality.id),
         setOperationId(obj.id),
         setQualityEndModal(true)
   }

   const operationStart = (obj, index) => {
      if (index != 0) {
         if (data[index - 1].endOperation == false || data[index - 1].endOperation == null) {
            toastData("Bitirilmeyen Operasyon Mevcut")
         }
         else {
            operationStartRespons(obj)
         }
      }
      else {
         operationStartRespons(obj)
      }//bir önceki işin bitip bitmediğinin kontrolünü saglar
   }

   const operationStartRespons = (obj) => {
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


   const columns = [
      {
         name: "",
         sortable: true,
         width: "250px",
         cell: (obj, index) => {
            return (<div key={data}>


               {!obj.startOperation ? <Fragment>       <Button.Ripple disabled={buttonDisabled || completedButton} outline className="btn-icon  pull-right" color={'success'} id={'baslat'} onClick={() => {
                  {

                     operationStart(obj, index)
                  }
               }}>
                  <Play size={14} />
               </Button.Ripple>
                  <UncontrolledTooltip placement='left' target={'baslat'}>
                     Operasyonu Başlat
                  </UncontrolledTooltip></Fragment> :
                  <Fragment>
                     <Row>

                        <Col span={20}>     Operasyon Başlama Zamanı {moment(obj.startOperationDate, serverDateFormat).format(dateFormat)} </Col>

                        {obj.endOperation ? <Col span={4}>
                           <Button.Ripple disabled={buttonDisabled || completedButton} outline className="btn-icon  pull-right" color={'warning'} id={'belge'} onClick={() => {
                              {
                                 operationEnd(obj, "Belge");
                              }
                           }}>
                              <FilePlus size={14} />
                           </Button.Ripple>
                           <UncontrolledTooltip placement='left' target={'belge'}>
                              Belge Ekle
                           </UncontrolledTooltip></Col> : <Col span={4}>
                           <Button.Ripple disabled={buttonDisabled || completedButton} outline className="btn-icon  pull-right" color={'info'} id={'bitir'} onClick={() => {
                              {
                                 operationEnd(obj, "Tamamla");
                              }
                           }}>
                              <CheckCircle size={14} />



                           </Button.Ripple>
                           <UncontrolledTooltip placement='left' target={'bitir'}>
                              Operasyonu Tamamla
                           </UncontrolledTooltip></Col>}



                     </Row>


                  </Fragment>




               }








            </div>

            )
         }

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
         name: 'DURUM',
         sortable: true,

         cell: (obj) => {
            return (<div>
               {obj.endOperation ? "Operasyon Tamamlandı" : !obj.startOperation ? "Operasyon Başlatılmadı" : "Devam Ediyor"}
            </div>
            );
         },
      },
      {
         name: "",
         allowOverflow: true,
         width: "250px",
         cell: (obj) => {
            return (
               <div >

                  {obj.endOperation ? <Col span={20}>     Operasyon Bitirme Zamanı {moment(obj.endOperationDate, serverDateFormat).format(dateFormat)} </Col> : <Fragment>
                     <Button.Ripple disabled={buttonDisabled} outline className="btn-icon  pull-right" color={'warning'} id={'ekle'} onClick={() => {
                        {
                           { obj.startOperation ? startJob(obj) : toastData("Operasyon Sürecini Başlatınız !", false) }

                        }
                     }}>
                        <PlusCircle size={14} />
                     </Button.Ripple>
                     <UncontrolledTooltip placement='left' target={'ekle'}>
                        Operasyon Ekle
                     </UncontrolledTooltip>
                  </Fragment>}



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

   }, [processModal, qualityEndModal]);

   const getData = () => {
      axios
         .get(process.env.REACT_APP_API_ENDPOINT + "api/QualityOperation/GetApprowingUserDetailConfirmation", { params: { id: props.match.params.id } })
         .then((res) => {

            if (res.data.data.length > 0) {
               setCompletedButton(res.data.data[0].quality.state)
               newWorkingData(qualityRefresh());
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
         <QualityProcessModal key={processModal} modalState={processModal} setModal={setProcessModal} operationId={operationId} qualityId={qualityId} toastData={toastData} />
         <QualityOperationEndModal modalType={modalType} modalState={qualityEndModal} setModal={setQualityEndModal} operationId={operationId} qualityId={qualityId} toastData={toastData} />
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
                     <ButtonGroup>
                        {qualityTypeList.map((prices) => (
                           <Button
                              color="primary"

                              onClick={() => setQualityType(prices.id)}
                              active={qualityType === prices.id}

                              key={prices.id}
                              disabled
                              outline={qualityType != prices.id}
                           >
                              {prices.ad}
                           </Button>
                        ))}
                     </ButtonGroup>
                  </div>

                  <div className="mb-1 text-center">
                     <h3>TANIMLI OPERASYONLAR</h3>
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

export default QualityOperationDetail;
