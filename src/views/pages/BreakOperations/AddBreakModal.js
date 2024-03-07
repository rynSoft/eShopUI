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
import toastData from "../../../@core/components/toastData";
import { UseSelector, useDispatch } from "react-redux";

// import { ctgTableRst } from "../../../redux/refreshData";
const AddBreakModal = ({ modalState ,refreshFunction}) => {
  const newWorking = useDispatch();
  const modalClose = () => setModalActive(false);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const searchParameters = {
    code: code,
    name: name,

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
          process.env.REACT_APP_API_ENDPOINT + "api/RestCause/Add",
          searchParameters
        )
        .then((res) => {
   
          if (res.data.success) {
  
            setModalActive(false);
            toastData("Mola Başarıyla Kaydedildi", true);
            refreshFunction();
          } else {
            toastData("Mola Kaydedilemedi !", false);
          }
        }).catch(err=>toastData("Mola Kaydedilemedi !",false));

  };
  return (
    <Modal
      isOpen={modalActive}
      className='modal-dialog-centered modal-lg'
      contentClassName='pt-0'
    >
      <ModalHeader className='mb-1' close={CloseBtn} tag='div'>
        <h5 className='modal-title'>Yeni Mola</h5>
      </ModalHeader>
      <ModalBody className='flex-grow-1'>
        <div className='mb-1'>
          <Label className='form-label' for='ad'>
            İsim
          </Label>
          <Input
            id='ad'
            placeholder='Mola Adı'
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='baslik'>
            Kod
          </Label>
          <InputGroup>
  
            <Input
              id='baslik'
              placeholder='Kod'
              onChange={(event) => setCode(event.target.value)}
              value={code}
            />
          </InputGroup>
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

export default AddBreakModal;
