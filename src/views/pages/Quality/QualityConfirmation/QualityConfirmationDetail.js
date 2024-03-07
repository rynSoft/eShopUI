import { Col, Row } from "antd";
import Cleave from "cleave.js/react";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { Check, CheckCircle, ChevronDown, Circle, Clipboard, Edit, Info, Plus, PlusSquare, Printer, Trash2, XOctagon } from "react-feather";
import { Button, ButtonGroup, Card, Input, Label, Modal, ModalBody, ModalHeader, Nav, NavItem, NavLink, Table, UncontrolledTooltip } from "reactstrap";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import { useEffect } from "react";
import moment from "moment";
import { toast, Slide } from "react-toastify";
import PerfectScrollbar from "react-perfect-scrollbar";
import Avatar from "@components/avatar";
import axios from "axios";

import { Fragment } from "react";
import QualityConfirmationModal from "./QualityConfirmationModal";
import { useSelector, useDispatch } from "react-redux";
import { qualityRefresh} from "../../../../redux/refreshData";
import { dateFormat, serverDateFormat } from "../../../../utility/Constants";
import toastData from "../../../../@core/components/toastData";
const QualityConfirmationDetail = (props) => {
   const newWorkingData = useDispatch();
   const userQualityWorker = useSelector((state) => state.refreshData.qualityList);
   const [workOrderNumber, setWorkOrderNumber] = useState("")
   const [operationList, setOperationList] = useState([])
   const [keyController, setKeyController] = useState(0)
   
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
   const [modal, setModal] = useState(false);
   const [confirmationId, setConfirmationId] = useState(1);
   useEffect(() => {
   if(!modal){
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
   }, [userQualityWorker,modal]);


 



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
      if(!modal){
         axios
         .get(process.env.REACT_APP_API_ENDPOINT + "api/QualityOperation/GetApprowingUserDetail", { params: { id: props.match.params.id } })
         .then((res) => {
            if (res.data.data.length > 0) {
               setKeyController(keyController+1);
               setOperationList(res.data.data)

               setNonConformanceCode(res.data.data[0].quality.nonComplianceCode);
               setPiece(res.data.data[0].quality.piece)
               setProductionCode(res.data.data[0].quality.productionCode)
               setQualityType(qualityTypeList.find(x => x.ad == res.data.data[0].quality.qualityType).id);
               setSerialCode(res.data.data[0].quality.serialCode)
               setWorkOrderNumber(res.data.data[0].quality.workOrderNumber)
            }
         });
         newWorkingData(qualityRefresh());
      }
 
   }, [modal]);
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
         <QualityConfirmationModal  modalState={modal} setModal={setModal} confirmation={confirmationId} toastData={toastData}/>
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

                  <div className="mb-1" style={{visibility:piece!=1 ?"hidden":"visible"}}>
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
                              outline={qualityType !== prices.id}
                           >
                              {prices.ad}
                           </Button>
                        ))}
                     </ButtonGroup>
                  </div>

                  <div className="mb-1 text-center">
                        <h3>TANIMLI ONAYLAR</h3>
                  </div>
      
                     <Table size="sm">
                        <thead>
                           <tr>
                              <th >Operasyon</th>
                              <th>SORUMLU TEKNİSYEN</th>
                              <th>EKİP SÖZCÜSÜ</th>
                              <th>Kalite</th>
                              <th>Onaylanma t.</th>
                              <th style={{ textAlign: "right" }}>
                              </th>
                           </tr>
                        </thead>
                        <tbody >
                           {operationList.map((obj, index) =>
                              <tr
                                 key={`${obj.id}`}
                              >
                                 <td style={{ width: "33%" }}>       {obj.operation}</td>
                                 <td> {userData.find(x => x.id == obj.userLiableId)?.name}    {userData.find(x => x.id == obj.userLiableId)?.surName} </td>
                                 <td>    {userData.find(x => x.id == obj.userApprovingId)?.name}    {userData.find(x => x.id == obj.userApprovingId)?.surName}     </td>
                                 <td>    {userData.find(x => x.id == obj.authorizedPersonId)?.name}    {userData.find(x => x.id == obj.authorizedPersonId)?.surName}     </td>
                              
                                 <td>{obj.editDate=="0001-01-01T00:00:00+00:00"? "Onay Bekliyor": moment(obj.editDate, serverDateFormat).format(dateFormat)}</td>
                                 <td  key={keyController} style={{ textAlign: "right" }}>                 <div className='breadcrumb-right'>
                                    <Button.Ripple outline className="btn-icon  pull-right" color={obj.confirmation ? 'danger':'success'} disabled={obj.confirmation} id={obj.confirmation ? 'danger':'success'} onClick={() => {
                                       {
                                             setConfirmationId({id:obj.id,operation:obj.operation,name:userData.find(x => x.id == obj.userLiableId)?.name,  surName: (userData.find(x => x.id == obj.userLiableId)?.surName)})
                                             setModal(true);
                                       }
                                    }}>
                                        {obj.confirmation?<CheckCircle size={14} />:<Circle size={14} />}  
                                    </Button.Ripple>
                                    <UncontrolledTooltip placement='left' target={obj.confirmation ? 'danger':'success'}>
                                       {obj.confirmation?'Onaylanmış':'Onayla'}
                                    </UncontrolledTooltip>
                                 </div>
                                 
                                    <div className="d-flex" style={{ textAlign: "right" }}>
                                    </div></td>
                                  
                              </tr>
                           )}
                        </tbody>
                     </Table>
                
               </Col>
            </Row>
         </Card>
      </Fragment>
   );
};

export default QualityConfirmationDetail;
