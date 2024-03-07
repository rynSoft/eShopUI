// ** React Imports
import { useState,Fragment } from 'react'

import Avatar from "@components/avatar";
import { User, Briefcase, Mail, Calendar, DollarSign, X ,Check, XOctagon } from 'react-feather'
// import FileUploaderRestrictions from './FileUploaderRestrictions'
// ** Reactstrap Imports
import { Modal, Input, Label,Button, ModalHeader, ModalBody, InputGroup, InputGroupText, Row } from 'reactstrap'
Select
// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'

import Select from 'react-select'
import axios from "axios";

import toastData from '../../../@core/components/toastData';
import {UseSelector,useDispatch} from "react-redux";

// import {ctgTableRst} from '../../../redux/refreshData';

const DeleteBreakModal = ({data,controller,refreshFunction}) => {
  const refreshData=useDispatch();
  const [modalActive, setModalActive] = useState(false)
  const [counter, setCounter] = useState("");
  const [id, setId] = useState(0);
  if (controller== true && counter == 0) {
   
    setModalActive(controller);
    setId(data.id);
    setCounter(1);
  }


  const deleteParameters = {
    id: id,
  };
  
  const handleModal = () => setModalActive(false);
  const handleImage = (msg) => setImagePath(msg);

  const deleteRegion = () => {
    try {
    
      axios.delete(process.env.REACT_APP_API_ENDPOINT +"api/RestCause/Delete?Id="+id).then((res) => {
   
        if(res.data.success){
          handleModal();
          refreshFunction();
          toastData("Mola Başarıyla Silindi",true);
 
        }
        else{
          toastData("Mola Silinemedi !",false);
        }     
      }).catch(err=>toastData("Mola Silinemedi !",false));
  
    } catch (error) {
      console.error("jhgjg");
    }
  };

  // ** Custom close btn
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleModal} />


  return (
    <Modal
      isOpen={modalActive}
      toggle={handleModal}
      className={`modal-dialog-centered modal-sm`}
   
      contentClassName='pt-0'
    >
      <ModalHeader className='mb-1' toggle={handleModal} close={CloseBtn} tag='div'>
        <h5 className='modal-title'>Mola Silinecek</h5>
      </ModalHeader>
      <ModalBody className='flex-grow-1'>
      <div className="text-center">Seçilen Mola Silinecek Lütfen Onaylayınız!</div>
        <div className="text-center">

        <Button className='me-1' color='primary' onClick={deleteRegion}>
          Onay
        </Button>
        <Button color='secondary' onClick={handleModal} outline>
          İptal
        </Button>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default DeleteBreakModal
