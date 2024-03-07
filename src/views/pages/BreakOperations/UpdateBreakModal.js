// ** React Imports
import { useState,Fragment } from 'react'

import Avatar from "@components/avatar";
import { User, Briefcase, Mail, Calendar, DollarSign, X ,Check, XOctagon } from 'react-feather'
// import FileUploaderRestrictions from './FileUploaderRestrictions'
// ** Reactstrap Imports
import { Modal, Input, Label,Button, ModalHeader, ModalBody, InputGroup, InputGroupText, Row,ButtonGroup } from 'reactstrap'
Select
// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { selectThemeColors } from '@utils' 
import Select from 'react-select'
import axios from "axios";
import toastData from '../../../@core/components/toastData';
const UpdateModal = ({data,controller,refreshFunction}) => {
  const [modalActive, setModalActive] = useState(false)
  const [counter, setCounter] = useState(0)
  if (controller== true && counter == 0) {   
    setModalActive(controller);
    axios.get(process.env.REACT_APP_API_ENDPOINT + 'api/RestCause/GetById?id='+data.id).then(response => {
      setName(response.data.data.name ===null ? "":response.data.data.name );
      setCode(response.data.data.code===null ? "":response.data.data.code );

 })
    setCounter(1);
  }

  const [name, setName] = useState("")
  const [code, setCode] = useState("")

  const searchParameters = {
    id:data.id,
    code:code,
    name: name,

  };
  const handleModal = () => setModalActive(false);


  const saveData = () => {
    try {    
      axios.post(process.env.REACT_APP_API_ENDPOINT +"api/RestCause/Update", searchParameters).then((res) => {

        if(res.data.success){
          handleModal();
          refreshFunction();
          toastData("Mola Başarıyla Güncellendi",true);
        }
        else{
          toastData("Mola Güncellenemedi !",false);
        }     
      }).catch(err=>toastData("Mola Güncellenemedi !",false));
  
    } catch (error) {
      console.error(error.message);
    }
  };
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleModal} />
  return (

    <Modal
    isOpen={modalActive}
    toggle={handleModal}
    className='modal-dialog-centered modal-lg'
    contentClassName='pt-0'
  >
    <ModalHeader className='mb-1' toggle={handleModal} close={CloseBtn} tag='div'>
      <h5 className='modal-title'>Mola Güncelle</h5>
    </ModalHeader>
    <ModalBody className='flex-grow-1'>
    <div className='mb-1'>
          <Label className='form-label' for='ad'>
            İsim
          </Label>
          <Input
            id='ad'
            placeholder='Kategori Adı'
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
              placeholder='Kategori Başlığı'
              onChange={(event) => setCode(event.target.value)}
              value={code}
            />
          </InputGroup>
        </div>    
      <div className="text-center">
      <Button className='me-1' color='primary' onClick={saveData}>
        Güncelle
      </Button>
      <Button color='secondary' onClick={handleModal} outline>
        İptal
      </Button>
      </div>
    </ModalBody>
  </Modal>
  )
}

export default UpdateModal
