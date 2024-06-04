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
import { X } from "react-feather";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import toastData from "../../../@core/components/toastData";
import TransferRouteMaterial from "./TransferRouteMaterial";

const MaterialMatchModal = ({  closeModal, productionId }) => {
  
  const [modalActive, setModalActive] = useState(true);
  const modalClose = () => closeModal();
  
  const CloseBtn = (
    <X className="cursor-pointer" onClick={modalClose} size={15} />
  );

  const addUser = async () => {
    await  axios.post(
      process.env.REACT_APP_API_ENDPOINT + "api/WorkProcessRouteUser/Add",
      addParameters
    ).then((res) => {
      if (res.data.success) {
        closeModal();
        toastData(userId.label + " İş Atandı", true);
      }
      else {
        toastData(userId.label + " İş Atanamadı", false);
      }
    });
  };

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_ENDPOINT + "api/Account/GetAllAsync")
      .then((res) => {
        if (res.data.data.length > 0) {

          // axios
          //   .get(process.env.REACT_APP_API_ENDPOINT + "api/WorkProcessRouteUser/GetById?id=" + userModalData.id)
          //   .then((ressponse) => {
          //     if (ressponse.data.userId != null) {
          //       let user = dumyUserList.find(xt => xt.id == ressponse.data.userId);
          //       setUserId({
          //         value: user.id,
          //         label: user.name + " " + user.surName,
          //       });
          //     }
          //   });
        }
      });
  }, []);
  return (
    <Modal
      isOpen={modalActive}
      className="modal-dialog-centered modal-xl"
      contentClassName="pt-0"
    >
      <ModalHeader className="mb-1" close={CloseBtn} tag="div">
        {/* <h5 className="modal-title">{userModalData.explanation}</h5> */}
      </ModalHeader>
      <ModalBody className="flex-grow-1">
        <div className="text-center">
         <TransferRouteMaterial></TransferRouteMaterial>
          <Button color="secondary" onClick={modalClose} outline>
            İptal
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default MaterialMatchModal;
