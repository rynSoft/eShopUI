import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Breadcrumb,
  BreadcrumbItem,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Button,
} from "reactstrap";
import DataTable from "react-data-table-component";
import {
  Check,
  Clock,
  MoreHorizontal,
  Pause,
  PlayCircle,
  Settings,
  StopCircle,
  User,
  UserMinus,
  UserPlus,
  X,
  XOctagon,
} from "react-feather";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { Link, useHistory } from "react-router-dom";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import Avatar from "../../../@core/components/avatar";
import "./ProductionDetail.css";
import UILoader from "../../../@core/components/ui-loader";
import moment from "moment";
import { dateFormat, serverDateFormat } from "../../../utility/Constants";
import ProductionLogs from "./ProductionLogs";
import Select from "react-select";
import toastData from "../../../@core/components/toastData";
import { workingActive,workingPassive} from "../../../redux/refreshData";
import { UseSelector, useDispatch } from "react-redux";
const UserModal = ({ modalType,closeModal, userModalData,productionId }) => {
  const newWorking = useDispatch();

  const [modalActive, setModalActive] = useState(true);


  const modalClose = () => closeModal();
  const [userList, setUserList] = useState([
    { id: -1, name: "Kullanıcı Mevcut Değil" },
  ]);
  const [userId, setUserId] = useState({
    value: -1,
    label: "Kullanıcı Mevcut Değil",
  });

  const addParameters = {
    workProcessRouteId: Number(userModalData.id),
    userId: userId.value
  };

  const addTaskParameters = {
    productionId: productionId,
    userId: userId.value
  };



  const CloseBtn = (
    <X className="cursor-pointer" onClick={modalClose} size={15} />
  );

  const apiController=()=>{
    if(modalType=="insert"){
      addUser();
    }
    else{
      deleteUser();
    }
  }
  const addUser = () => {
    axios.post(
      process.env.REACT_APP_API_ENDPOINT + "api/WorkProcessRouteUser/Add",
      addParameters                         
    ).then((res) => {
      if(res.data.success){
        toastData(userId.label +" İş Atandı", true);
        newWorking(workingActive());
       // addTask();
        closeModal();
      }
      else{
        toastData(userId.label +" İş Atanamadı", false);
      }   
    });
  };

  const addTask = () => {
    axios.post(
      process.env.REACT_APP_API_ENDPOINT + "api/RouteInfoUser/Add",
      addTaskParameters
    ).then((res) => {
      if(res.data.success){
        closeModal();
      }
      else{
        toastData(userId.label +" İş Atanamadı", false);
      }   
    });
  };

  const deleteUser=()=>{
    axios
      .delete(process.env.REACT_APP_API_ENDPOINT + "api/WorkProcessRouteUserService/Delete?Id="+userModalData.id)
      .then((res) => {
        if (res.data.success) {
          toastData(userId.label +" İş Silindi", true);
          newWorking(workingActive());
          closeModal();
        } else {
          toastData(userId.label +" İş Silinemedi", false);
        }
      })
      .catch((err) =>  toastData(userId.label +" İş Silinemedi", false));
  }

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_ENDPOINT + "api/Account/GetAllAsync")
      .then((res) => {
        if (res.data.data.length > 0) {
          let dumyUserList=res.data.data
          setUserList(dumyUserList);
          setUserId({
            value: res.data.data[0].id,
            label: res.data.data[0].name + " " + res.data.data[0].surName,
          });

          axios
          .get(process.env.REACT_APP_API_ENDPOINT + "api/WorkProcessRouteUserService/GetById?id="+userModalData.id)
          .then((ressponse) => {
            if(ressponse.data.userId!=null){
             let user= dumyUserList.find(xt=>xt.id==ressponse.data.userId);
              setUserId({
                value: user.id,
                label: user.name + " " + user.surName,
              });
            }
          });
        }
      });
  }, [userModalData]);
  return (
    <Modal
      isOpen={modalActive}
      className="modal-dialog-centered modal-sm"
      contentClassName="pt-0"
    >
      <ModalHeader className="mb-1" close={CloseBtn} tag="div">
        <h5 className="modal-title">{userModalData.explanation}</h5>
      </ModalHeader>
      <ModalBody className="flex-grow-1">
        <div className="mb-1">
          <Label className="form-label" for="ad">
            Kullanıcı
          </Label>
          <Select
          isDisabled={modalType=="delete"}
            isClearable={false}
            className="react-select"
            classNamePrefix="select"
            options={userList.map((option) => ({
              value: option.id,
              label: option.name + " " + option.surName,
            }))}
            value={userId}
            onChange={(event) =>
              setUserId({
                value: event.value,
                label: event.label,
              })
            }
            styles={{ width: "100%" }}
          />
          {modalType=="delete" ? "Kullanıcısı Silinecek !" :null}
        </div>
        <div className="text-center">
            <Button className="me-1" color="primary" onClick={()=>apiController()} >
              {modalType=="insert"?"Ekle":"Sil"}
            </Button>
            <Button color="secondary" onClick={modalClose} outline>
              İptal
            </Button>
          </div>
      </ModalBody>
    </Modal>
  );
};

export default UserModal;
