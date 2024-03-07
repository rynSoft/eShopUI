// ** React Imports
import { Fragment, useState ,useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { Switch, Transfer } from 'antd';
import PerfectScrollbar from "react-perfect-scrollbar";
// import './index.css';
import { ConfigProvider } from 'antd';
import trTR from 'antd/es/locale/tr_TR';
// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Label,
  Input,
  Table,
  Modal,
  Button,
  CardBody,
  ModalBody,
  ModalHeader,
  FormFeedback,
  UncontrolledTooltip
} from 'reactstrap'

// ** Third Party Components
import { Copy, Info, Plus } from 'react-feather'
import { useForm, Controller } from 'react-hook-form'

// ** Custom Components
import AvatarGroup from '@components/avatar-group'

// ** FAQ Illustrations
import illustration from '@src/assets/images/illustration/faq-illustrations.svg'


const RoleCards = (props) => {

  // ** States
  const [show, setShow] = useState(false)
  const [modalType, setModalType] = useState('Ekle')
  const [permissionsData, setPermissionsData] = useState([])
  const [data, setRolesData] = useState([])
  const [rolesName, setRoleName] = useState('')

  const [mockData, setMockData] = useState([])
  const [targetKeys, setTargetKeys] = useState([])

  const getMock = (datas) => {
    const tempTargetKeys = [];
    const tempMockData = [];
    let counter = 0;
    datas.map(element=> {

      if(element.title!=null){
    
  
          
          const data = {
        
            chosen : element.chosen,
            key:  element.title,
            title :element.title
          };
          if (data.chosen) {
            tempTargetKeys.push(data.key);
          }
    
          tempMockData.push(data);}
        }
     
      


);


    setMockData(tempMockData);
    setTargetKeys(tempTargetKeys);
  };
  

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_ENDPOINT + 'api/Role/rolewithuser').
    then(({ data }) => {
      setRolesData(data["userData"])
    });
  }, [props.refreshData])
  // ** Hooks
  const {
    reset,
    control,
    setError,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { roleName: '' } })

  const onSubmit = data => {
    
    data.name = data.roleName == "" ?  rolesName :   data.roleName;
    data.roleName = data.roleName == "" ?  rolesName :   data.roleName;

    data.claimListId = targetKeys;


    if (data.roleName.length) {
      axios.post(process.env.REACT_APP_API_ENDPOINT + 'api/Role/rolRegister', data).then(()=>{
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'api/Role/rolewithuser').
        then(({ data }) => {
          setRolesData(data["userData"])
          props.setRefreshData(!props.refreshData)
        });
        setShow(false)
      });

    } else {
      setError('roleName', {
        type: 'manual'
      })
    }
  }

  const handleSearch = (dir, value) => {
    console.log('search:', dir, value);
  };

  const filterOption = (inputValue, option) =>
  option.title.indexOf(inputValue) > -1;

  const handleChange = (newTargetKeys) => {
   
  
    setTargetKeys(newTargetKeys);
  }

  const onReset = () => {
    setShow(false)
    reset({ roleName: '' })
  }

  const handleModalClosed = () => {
    setModalType('Ekle ')
    setValue('roleName')
  }

  const handleDuzenleClick = (id,title) => {
    axios.get(process.env.REACT_APP_API_ENDPOINT + 'api/Role/GetRoleById?Id=' + id)
    .then(({ data }) => {
       getMock(data["userData"]["currentPermissions"]);
       setRoleName(title);
    })
  }



  const handleAddClick = async () => {
    axios.get(process.env.REACT_APP_API_ENDPOINT + 'api/Role/getPermissions').
    then(({ data }) => {
      getMock(data["userData"]);
     setPermissionsData(data["userData"])
         });
   
  }

  return (
    <Fragment>

      <Row>
        {data.map((item, index) =>
         {
          return (
            <Col key={index} xl={4} md={6}>
              <Card>
                <CardBody>
                  <div className='d-flex justify-content-between'>
                    <span>{`Toplam ${item.totalUsers} kullanıcı`}</span>
                 
                
                    {/* <AvatarGroup data={item.users} /> */}
                  </div>
                  <div className='d-flex justify-content-between align-items-end mt-1 pt-25'>
                    <div className='role-heading'>
                      <h4 className='fw-bolder'>{item.title}</h4>
                      <Link
                        to='/'
                        className='role-edit-modal'
                        onClick={e => {
                          e.preventDefault()
                          handleDuzenleClick(item.id,item.title)
                          setModalType('Düzenle')
                          setShow(true)
                        }}
                      >
                        <small className='fw-bolder'>Düzenle</small>
                      </Link>
                    </div>
                    {/* <Link to='' className='text-body' onClick={e => e.preventDefault()}>
                      <Copy className='font-medium-5' />
                    </Link> */}
                  </div>
                </CardBody>
              </Card>
            </Col>
          )
        })}
        <Col xl={4} md={6}>
          <Card>
            <Row>
              <Col sm={5}>
                <div className='d-flex align-items-end justify-content-center h-100'>
                  <img className='img-fluid mt-2' src={illustration} alt='Image' width={85} />
                </div>
              </Col>
              <Col sm={7}>
                <CardBody className='text-sm-end text-center ps-sm-0'>
                  <Button
                    color='primary'
                    className='text-nowrap mb-1'
                    onClick={() => {
                      setModalType('Ekle')
                      setShow(true)
                      setRoleName("")
                      handleAddClick()
                    }}
                  >
                   <Plus></Plus> Rol Ekle
                  </Button>
               
                </CardBody>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Modal
        isOpen={show}
        onClosed={handleModalClosed}
        toggle={() => setShow(!show)}
        className='modal-dialog-centered modal-lg'
      >
        <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
        <ModalBody className='px-5 pb-5' tag='form' onSubmit={handleSubmit(onSubmit)}>
          <div className='text-center mb-4'>
            <h1>Rol {modalType} </h1>
            <p>Rol Yetkilendirmelerini ayarlayın</p>
          </div>
          <Row >

            <Col xs={12}>
              <Label className='form-label' for='roleName'>
                Rol Ad
              </Label>
              <Controller
                name='roleName'
                control={control}
                render={({ field }) => (
                  <div>
                  { rolesName == '' 
                  ? <Input {...field} id='roleName' placeholder='rol adını giriniz.' invalid={errors.roleName && true} />
                  : <Input {...field} id='roleName' value={rolesName} placeholder='rol adını giriniz.' invalid={errors.roleName && true} />
                  }
                 </div>
                )}
              />
              {errors.roleName && <FormFeedback>Please enter a valid role name</FormFeedback>}
            </Col>
            <Col xs={12}>
              <h4 className='mt-2 pt-10'>Rol Yetkileri</h4>
              <br/>


           <Row >
            <Col xs={6}>
              <Label className='form-label' for='roleName'>
                Rol Listesi 
              </Label>
            </Col>


            <Col xs={6}>
              <Label className='form-label' for='roleName'>
                Kullanıcıya Atanan Roller
              </Label>
            </Col>
            </Row>
    
            <ConfigProvider locale={trTR}>
              
              <Transfer listStyle={{
        width: 330,
        height: 500,
      }}

        dataSource={mockData}
        showSearch
    
        filterOption={filterOption}
        onChange={handleChange}
        pagination
        targetKeys={targetKeys}
        onSearch={handleSearch}
         render={item => item.title}
      />
      
            </ConfigProvider>
   
            </Col>
            
            <Col className='text-center mt-2' xs={12}>
              <Button type='submit' color='primary' className='me-1'>
                Kaydet
              </Button>
              <Button type='reset' outline onClick={onReset}>
                İptal 
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default RoleCards
