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
const UpdateWareModal = ({data,controller,refreshFunction}) => {
  const [modalActive, setModalActive] = useState(false)
  const [counter, setCounter] = useState(0)
  if (controller== true && counter == 0) {   
    setModalActive(controller);
    axios.get(process.env.REACT_APP_API_ENDPOINT + 'api/WareHouse/GetById?id='+data.id).then(response => {
      setName(response.data.name ===null ? "":response.data.name );
      setCode(response.data.code===null ? "":response.data.code );

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
      axios.put(process.env.REACT_APP_API_ENDPOINT +"api/WareHouse/Update", searchParameters).then((res) => {

        if(res.data.success){
          handleModal();
          refreshFunction();
          toastData("Depo Başarıyla Güncellendi",true);
        }
        else{
          toastData("Depo Güncellenemedi !",false);
        }     
      }).catch(err=>toastData("Depo Güncellenemedi !",false));
  
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
      <h5 className='modal-title'>Depo Güncelle</h5>
    </ModalHeader>
    <ModalBody className='flex-grow-1'>

    <div className='mb-1'>
          <Label className='form-label' for='code'>
            Kod
          </Label>
          <InputGroup>
  
            <Input
              id='code'
          
              onChange={(event) => setCode(event.target.value)}
              value={code}
            />
          </InputGroup>
        </div>       
        <div className='mb-1'>
          <Label className='form-label' for='name'>
            Açıklama
          </Label>
          <Input
            id='name'
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
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

export default UpdateWareModal
