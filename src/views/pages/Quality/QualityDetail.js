import { Col, Row } from "antd";
import Cleave from "cleave.js/react";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { Check, ChevronDown, Clipboard, Edit, Info, Plus, PlusSquare, Printer, Trash2, XOctagon } from "react-feather";
import { Button, ButtonGroup, Card, Input, Label, Modal, ModalBody, ModalHeader, Nav, NavItem, NavLink, Table, UncontrolledTooltip } from "reactstrap";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import { useEffect } from "react";
import "./Quality.css";
import { toast, Slide } from "react-toastify";
import PerfectScrollbar from "react-perfect-scrollbar";
import Avatar from "@components/avatar";
import axios from "axios";
import moment from "moment";
import { useSkin } from '@hooks/useSkin'
import { Fragment } from "react";
import NewOperationModal from "./NewOperationModal";
import DeleteOperationModal from "./DeleteOperationModal";
import NewQualityModal from "./NewQualityModal";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import ReactPaginate from "react-paginate";
import { useSelector, useDispatch } from "react-redux";
import { qualityRefresh } from "../../../redux/refreshData";
import toastData from "../../../@core/components/toastData";
import { dateFormat, serverDateFormat } from "../../../utility/Constants";
import CustomPagination from "../../../@core/components/gridTable/CustomPagination";
const QualityDetail = (props) => {
   const [workOrderNumber, setWorkOrderNumber] = useState("")
   const newWorkingData = useDispatch();
  




   const [currentPage, setCurrentPage] = useState(0);
   const [rowCount, setRowCount] = useState(window.screen.height < 801 ? 8 : 11);
   const columns = [

      {
         name: "Tipi",
         sortable: true,
         maxWidth: "100px",
         selector: (row) => row.qualityProcessType
      },
      {
         name: "OPERASYON",
         sortable: true,
         width: "400px",
         selector: (row) =>
            <div>
               {operationList.find(x => x.id == row.qualityOperationId)?.operation}

            </div>
      },
      {
         name: "Ürün Kodu",
         sortable: true,
         maxWidth: "200px",
         selector: (row) => row.productionCode,
      },

      {
         name: "Lot Bilgisi",
         sortable: true,
         maxWidth: "200px",
         selector: (row) => row.lotInformation,
      },
      {
         name: "Adet",
         sortable: true,
         maxWidth: "100px",
         selector: (row) => row.piece,
      },
      {
         name: "Açıklama",
         sortable: true,

         selector: (row) => row.description,
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
   const NoDataConst = "Operasyon İşlemi Mevcut Değil";
   const [operationList, setOperationList] = useState([])
   const [updateButton, setUpdateButton] = useState(false)
   
   const [productionCode, setProductionCode] = useState("")
   const [serialCode, setSerialCode] = useState("")
   const [piece, setPiece] = useState()
   const [userData, setUserData] = useState([])
   const [nonConformanceCode, setNonConformanceCode] = useState("")
   const [qualityTypeList, setQualityTypeList] = useState([
      { id: 1, ad: "Repair" },
      { id: 2, ad: "Rework" },
   ]);
   const [newOperationModal, setNewOperationModal] = useState(false);
   const [OperationDetail, setOperationDetail] = useState(undefined);
   const [processModal, setProcessModal] = useState(false);
   const [deleteOperationModal, setDeleteOperationModal] = useState(false);
   const [activeTab, setActiveTab] = useState(1);
   const [operationId, setOperationId] = useState(false);
   const [processData, setProcessData] = useState([]);
   const [keyControl, setKeyControl] = useState(1);
   const [qualityType, setQualityType] = useState(1);
   const [mudurDetail, setMudurDetail] = useState([{ value: 0, label: 'Personel Yok' }])
   const [authorizedPersonDetail, setAuthorizedPersonDetail] = useState([{ value: 0, label: 'Personel Yok' }])
   useEffect(() => {

      if (!newOperationModal && !deleteOperationModal) {
         setKeyControl(keyControl + 1)
         setOperationDetail(undefined);     //her modal kapatıldığında  row datayı 0 lıyor
         axios
            .get(
               process.env.REACT_APP_API_ENDPOINT +
               "api/Quality/GetQualityDetail?id=" +
               props.match.params.id
            )
            .then((response) => {
               setUpdateButton(response.data.quality.state)
               setOperationList(response.data.operationList)
               setWorkOrderNumber(response.data.quality.workOrderNumber)
               setProductionCode(response.data.quality.productionCode)
               setSerialCode(response.data.quality.serialCode)
               setPiece(response.data.quality.piece)
               setNonConformanceCode(response.data.quality.nonComplianceCode)
               setQualityType(response.data.quality.qualityType)

            });
      }
   }, [newOperationModal, deleteOperationModal]);
   useEffect(() => {
      if (!newOperationModal && !deleteOperationModal) {
         setKeyControl(keyControl + 1)
         newWorkingData(qualityRefresh());
         setOperationDetail(undefined);     //her modal kapatıldığında  row datayı 0 lıyor
         axios
            .get(
               process.env.REACT_APP_API_ENDPOINT +
               "api/QualityInfo/GetAllQuality", { params: { id: props.match.params.id } }
            )
            .then((response) => {

               setProcessData(response.data.data)
            });
      }
   }, [activeTab]);




   const updateQuality = () => {
      let quality = {
         id: props.match.params.id,
         workOrderNumber: workOrderNumber,
         productionCode: productionCode,
         serialCode: piece==1 ? serialCode:null,
         piece: piece,
         nonComplianceCode: nonConformanceCode,
         qualityType: qualityType
      }


      axios.put(
         process.env.REACT_APP_API_ENDPOINT + "api/Quality/Update",
         quality
      ).then((res) => {

         
         if (res.data.data.success) {

            toastData("Kalite Emri Güncelleme Başarılı", true)
         }
         else {
            toastData("Kalite Emri Güncelleme Başarısız", false)
         }
      }).catch((error) => toastData("Kalite Emri Güncelleme Başarısız", false));
   }


   const [personelDetail, setPersonelDetail] = useState([{ value: 0, label: 'Personel Yok' }])

   useEffect(() => {

      if (userData.length > 0) {
         let dumyMudur = [];
         let dumypersonelDetail = [];
         let operationDumy = [];
         let AuthPersonDumy = [];

         operationList.map((x, index) => {
            let userPersonel = userData.find(y => y.id == x.userLiableId)
            let userMudur = userData.find(y => y.id == x.userApprovingId)
            let authPerson = userData.find(y => y.id == x.authorizedPersonId)
            operationDumy.push(x.operation)
            dumypersonelDetail.push({ value: userPersonel?.id, label: userPersonel?.name + " " + userPersonel?.surName });
            dumyMudur.push({ value: userMudur?.id, label: userMudur?.name + " " + userMudur?.surName });
            AuthPersonDumy.push({ value: authPerson?.id, label: authPerson?.name + " " + authPerson?.surName });
         })
         setAuthorizedPersonDetail(AuthPersonDumy)
         setPersonelDetail(dumypersonelDetail)
         setMudurDetail(dumyMudur)
         setOperation(operationDumy)
         
      }
   }, [operationList, userData])

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
         <NewOperationModal key={keyControl} qualityId={props.match.params.id} userData={userData} setModal={setNewOperationModal} modalState={newOperationModal} toastData={toastData} updateOperationData={OperationDetail} />
         <DeleteOperationModal key={keyControl + 1} operationId={operationId} setModal={setDeleteOperationModal} modalState={deleteOperationModal} toastData={toastData} />


         <Card>
            <Row className={"mt-2"}>
               <Col>
                  <Nav className="justify-content-center" tabs>

                     <NavItem key={1}>
                        <NavLink
                           active={activeTab == 1}
                           onClick={() => {
                              {
                                 setActiveTab(1)
                              }
                           }}
                        >
                           Genel Bilgiler
                        </NavLink>
                     </NavItem>
                     <NavItem key={2}>
                        <NavLink
                           active={activeTab == 2}
                           onClick={() => {
                              {
                                 setActiveTab(2)
                              }
                           }}
                        >
                           İşlemler
                        </NavLink>
                     </NavItem>
                  </Nav>

               </Col>
            </Row>


            {activeTab == 1 ? <Row>
               <Col span={6} style={{ paddingLeft: 10 }}>    <div className="mb-1">
                  <Label className="form-label" for="ad">
                     İş Emri No
                  </Label>
                  <Cleave
                     className="form-control"
                     placeholder="İş Emri No"
                     maxLength={30}
                     disabled={updateButton}
                     // options={{ numeral: true }}
                     id="numeral-formatting"
                     onChange={(event) => setWorkOrderNumber(event.target.value)}
                     value={workOrderNumber}
                  />
               </div>
                  <div className="mb-1">
                     <Label className="form-label" for="ad">
                        Ürün Kodu
                     </Label>

                     {/* <InputGroupText>
    <User size={15} />
  </InputGroupText> */}
                     <Cleave
                        className="form-control"
                        placeholder="Ürün Kodu"
                        maxLength={30}
                        disabled={updateButton}
                        id="numeral-formatting"
                        onChange={(event) => setProductionCode(event.target.value)}
                        value={productionCode}
                     />
                  </div>

                  <div className="mb-1" style={{visibility:piece!=1 ?"hidden":"visible"}}>
                     <Label className="form-label" >
                        Seri No
                     </Label>

                     {/* <InputGroupText>
    <User size={15} />
  </InputGroupText> */}
                     <Cleave
                   disabled={updateButton}
                        className="form-control"
                        placeholder="Seri Numarası"
                        maxLength={30}
                        id="numeral-formatting"
                        onChange={(event) => setSerialCode(event.target.value)}
                        value={serialCode}
                     />
                  </div>
               </Col>  <Col span={6} style={{ marginLeft: 20 }}  >
                  <div className="mb-1">
                     <Label className="form-label" for="ürün">
                        Ürün Adet
                     </Label>

                     {/* <InputGroupText>
    <User size={15} />
  </InputGroupText> */}
                     <Cleave

                        className="form-control"
                        placeholder="Ürün Adet Bilgisi"
                        maxLength={30}
                        options={{
                           numeral: true,

                        }}
                        disabled={updateButton}
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
                        disabled={updateButton}
                        id="numeral-formatting"
                        onChange={(event) => setNonConformanceCode(event.target.value)}
                        value={nonConformanceCode}
                     />

                  </div>

               </Col>
               <Col span={24} style={{ paddingLeft: 10 }}>
                  <div className="mb-1 text-center" >
                     <ButtonGroup style={{ zIndex: 0 }}>
                        {qualityTypeList.map((prices) => (
                           <Button
                              color="primary"
                              onClick={() => setQualityType(prices.id)}
                              active={qualityType === prices.id}
                              outline
                              
                              key={prices.id}
                           >
                              {prices.ad}
                           </Button>
                        ))}
                     </ButtonGroup>
                  </div> 

                  {!updateButton?            <div className="text-center" style={{ marginBottom: 10 }}>
                     <Button
                     disabled={updateButton}
                        className="me-1"
                        color="primary"
                        onClick={updateQuality}
                     >
                        Güncelle
                     </Button>

                  </div>:null}
      
                  <PerfectScrollbar
                     options={{ wheelPropagation: false, suppressScrollX: true }}
                     style={{ marginLeft: -10 }}
                     className="ScroolDetail"
                  >
                     <Table >
                        <thead>
                           <tr>
                              <th >Operasyon</th>
                              <th>SORUMLU TEKNİSYEN</th>
                              <th>EKİP SÖZCÜSÜ</th>
                              <th>Kalite</th>
                              <th>Onaylanma T.</th>
                              <th style={{ textAlign: "right" }}>

                                 <div className='breadcrumb-right'>
                                    <Button.Ripple outline className="btn-icon rounded-circle pull-right" color='primary' id='newProductionOrder'
                                        disabled={updateButton}
                                      onClick={() => {
                                          
                                          setNewOperationModal(true);
                                       }}>


                                       +
                                    </Button.Ripple>
                                    <UncontrolledTooltip placement='left' target='newProductionOrder'>
                                       Yeni Operasyon
                                    </UncontrolledTooltip>
                                 </div>


                              </th>
                           </tr>
                        </thead>
                        <tbody >
                           {operationList.map((obj, index) =>
                              <tr
                                 key={`${obj.id}`}
                              >
                                 <td >            {operation[index]}</td>
                                 <td>{personelDetail[index]?.label}</td>
                                 <td>   {mudurDetail[index]?.label}
                                 </td>
                                 <td>   {authorizedPersonDetail[index]?.label}
                                 </td>
                                 <td>{obj.editDate == "0001-01-01T00:00:00+00:00" || obj.editDate == null ? "Onay Bekliyor" : moment(obj.editDate, serverDateFormat).format(dateFormat)}</td>
                                 <td style={{ textAlign: "right" }}>      
                                    
                                 {obj.confirmation ? "-":<div>                   <div className='breadcrumb-right'>
                                    <Button.Ripple  disabled= {obj.confirmation} outline className="btn-icon  pull-right" color='info' id='newUpdate' onClick={() => {
                                       {
                                          setOperationDetail({ id: obj.id, operation: obj.operation, onaylayan: obj.userLiableId, sorumlu: obj.userApprovingId,yetkili:obj.authorizedPersonId })
                                          setNewOperationModal(true)
                                       }
                                    }}>
                                       <Edit size={14} />
                                    </Button.Ripple>
                                    <UncontrolledTooltip placement='left' target='newUpdate'>
                                       Güncelle
                                    </UncontrolledTooltip>

                                    <Button.Ripple  disabled= {obj.confirmation} outline className="btn-icon  pull-right" color='danger' id='newProductionOrders' style={{ marginLeft: 10 }} onClick={() => {
                                       {
                                          setDeleteOperationModal(true)
                                          setOperationId(obj.id)
                                       }
                                    }}>
                                       <Trash2 size={14} />
                                    </Button.Ripple>
                                    <UncontrolledTooltip placement='left' target='newProductionOrders'>
                                       Sil
                                    </UncontrolledTooltip>
                                 </div>
                                    <div className="d-flex" style={{ textAlign: "right" }}>
                                    </div></div>}
                         </td>
                              </tr>
                           )}
                        </tbody>
                     </Table>
                  </PerfectScrollbar>
               </Col>
            </Row> :

               <div className="react-dataTable">
                  <DataTable
                     noHeader
                     pagination
                     columns={columns}
                     className="react-dataTable"
                     sortIcon={<ChevronDown size={10} />}
                     paginationPerPage={rowCount}
                     paginationComponent={ ()=>CustomPagination(searchValue.length ? filteredData : data,currentPage,(value)=>setCurrentPage(value))}
      
                     paginationDefaultPage={currentPage + 1}
                     data={processData}
                     noDataComponent={NoDataConst}
                  />
               </div>
            }

         </Card>
      </Fragment>
   );
};

export default QualityDetail;
