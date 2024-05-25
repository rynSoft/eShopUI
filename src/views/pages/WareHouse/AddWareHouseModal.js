// ** React Imports
import { useState, Fragment, useEffect } from "react";

import Avatar from "@components/avatar";
// ** Third Party Components
import Flatpickr from "react-flatpickr";
import {
  User,
  Briefcase,
  Mail,
  Calendar,
  DollarSign,
  X,
  Check,
  XOctagon,
} from "react-feather";
// import FileUploaderRestrictions from "./FileUploaderRestrictions";
// ** Reactstrap Imports
import {
  Modal,
  Input,
  Label,
  Button,
  ModalHeader,
  ModalBody,
  InputGroup,
  InputGroupText,
  ButtonGroup,
} from "reactstrap";
Select;
// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import axios from "axios";

import { UseSelector, useDispatch } from "react-redux";
import toastData from "../../../@core/components/toastData";
const AddWareHouseModal = ({ modalState ,refreshFunction}) => {
  const modalClose = () => setModalActive(false);
  const refreshData = useDispatch();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [barcodeCode, setBarcodeCode] = useState("");
  
  const searchParameters = {
    code: code,
    name: name,
    description : description,
    barcodeCode : barcodeCode

  };
  const [modalActive, setModalActive] = useState(false);
  const [counter, setCounter] = useState(0);
  if (modalState == true && counter == 0) {
    setModalActive(modalState);
    setCounter(1);

  }
  const CloseBtn = (
    <X className='cursor-pointer' onClick={modalClose} size={15} />
  );


  const saveData = () => {
    
      axios
        .post(
          process.env.REACT_APP_API_ENDPOINT + "api/WareHouse/Add",
          searchParameters
        )
        .then((res) => {
   
          if (res.data.success) {
  
            setModalActive(false);
            toastData("Depo Başarıyla Kaydedildi", true);
            refreshFunction();
          } else {
            toastData("Depo Kaydedilemedi !", false);
          }
        }).catch(err=>toastData("Depo Kaydedilemedi !",false));

  };
  return (
    <Modal
      isOpen={modalActive}
      className='modal-dialog-centered modal-lg'
      contentClassName='pt-0'
    >
      <ModalHeader className='mb-1' close={CloseBtn} tag='div'>
        <h5 className='modal-title'>Yeni Depo</h5>
      </ModalHeader>
      <ModalBody className='flex-grow-1'>
      <div className='mb-1'>
          <Label className='form-label' for='code'>
            Kod
          </Label>
          <Input
            id='code'
            placeholder='Depo Kodu'
            onChange={(event) => setCode(event.target.value)}
            value={code}
          />
        </div>
      <div className='mb-1'>
          <Label className='form-label' for='ad'>
            Ad
          </Label>
          <Input
            id='ad'
            placeholder='Depo Ad'
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='barcodeCode'>
            Barkod Kodu
          </Label>
          <Input
            id='barcodeCode'
            placeholder='barkod kodu'
            onChange={(event) => setBarcodeCode(event.target.value)}
            value={barcodeCode}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='description'>
            Açıklama
          </Label>
          <Input
            id='description'
            placeholder='Açıklama'
            onChange={(event) => setDescription(event.target.value)}
            value={description}
          />
        </div>
       
        <div className='text-center'>
          <Button className='me-1' color='primary' onClick={saveData}>
            Ekle
          </Button>
          <Button color='secondary' onClick={modalClose} outline>
            İptal
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default AddWareHouseModal;
