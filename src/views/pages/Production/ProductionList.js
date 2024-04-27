import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    CardText,
    Table,
    Row,
    Col,
    Input,
    Label,
    CardFooter,
    Button, UncontrolledTooltip, Modal, ModalHeader, ModalBody, ModalFooter, Breadcrumb, BreadcrumbItem
} from 'reactstrap'
import DataTable from 'react-data-table-component'
import { isUserLoggedIn } from "@utils";
import { ChevronDown, Edit, Info, PlusSquare, Printer, Trash2, X } from "react-feather";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { dateFormat, serverDateFormat } from "../../../utility/Constants";
import ReactPaginate from 'react-paginate'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { Link, useHistory } from "react-router-dom";
import CustomPagination from '../../../@core/components/gridTable/CustomPagination';
import ExportPdf from '../../../@core/components/gridTable/ExportPdf/exportPdf';
import ClassicDataTable from '../../../@core/components/gridTable/ClassicDataTable';
import ExportExcel from '../../../@core/components/gridTable/ExportExcel';
import toastData from '../../../@core/components/toastData';
import { authSlice } from "../../../redux/authentication";
import { XAxis } from 'recharts';
const ProductionList = () => {
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        if (isUserLoggedIn() !== null) {
          setUserData(JSON.parse(localStorage.getItem("userData")));
        }
      }, []);
    let columns = [

        {
            name: "Üretim Emri",
            sortable: true,
            maxWidth: "200px",
            selector: (row) => row.orderNo,
        },
        {
            name: 'Üretim Adı',
            sortable: true,
            maxWidth: '200px',
            selector: row => row.uretimAdi
        },
        {
            name: 'Açıklama',
            sortable: true,
            maxWidth: '1200px',
            selector: row => row.aciklama
        },
        {
            name: "Üretim Adedi",
            sortable: true,
            maxWidth: "200px",
            selector: (row) => row.quantity,
        },
        {
            name: "Açılış Tarihi",
            maxWidth: "200px",
            sortable: true,
            selector: (row) =>
                moment(row.startDate, serverDateFormat).format(dateFormat),
        },
        {
            name: 'Oluşturma Tarihi',
            maxWidth: "200px",
            sortable: true,
            selector: row => row.startDate != null ? moment(row.createDate, serverDateFormat).format(dateFormat) : null
        },
        {
            name: <Fragment><Button.Ripple
                outline
                id="pdfPrint"
                className="btn-icon rounded-circle pull-right"
                color="danger"
                onClick={() => {
                    ExportPdf(data, "uretimPlanlamaListesi", "ÜRETİM PLANLAMA LİSTESİ");
                }}
            >
                <Printer size={17} />
            </Button.Ripple><Button.Ripple
        outline
        id="excelPrint"
        className="btn-icon rounded-circle pull-right"
        color="success"
        style={{ marginLeft: 5 }}
        onClick={() => {
          ExportExcel(searchValue.length ? filteredData : data, "uretimRapor", "ÜRETİM RAPORU");
        }}
      >
          <Printer size={17} />
        </Button.Ripple></Fragment>,
            allowOverflow: true,
            maxWidth: "150px",
            cell: (row) => {
                return (
                    <div className="d-flex"    key={userData}>
                        <Button.Ripple
                            className="btn-icon"
                            color="flat-primary"
                            onClick={() => { openDetail(row.id) }}
                        >
                            <Info size={18} />
                        </Button.Ripple>
                       {userData && userData.permissions && userData.permissions.filter(x=>x=="Üretim Planlama Sil").length>0 ?    <>        <Button.Ripple
                            className="btn-icon"
                            
                            color="flat-primary"
                            onClick={() => { removeProduction(row.id) }}
                        >
                            <Trash2 size={18} />
                        </Button.Ripple>
                        
                        <Button.Ripple
                        className="btn-icon"
                    
                        color="flat-primary"
                        onClick={() => { printProduction(row.id,row.orderNo) }}
                    >
                        <Printer size={18} />
                    </Button.Ripple> </>
                        :null}

         

                        
                       
                    </div>
                );
            },
        },
    ];
    console.log(authSlice.getInitialState().userData,"tolga")
    const [data, setData] = useState([]);
    const [key, setKey] = useState(0);
    const [searchValue, setSearchValue] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [selectionModal, setSelectionModal] = useState(false);
    const [removeItem, setRemoveItem] = useState(null);
    
  


    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)



        if (value.length) {
            updatedData = data.filter((item) => {
                const startsWith =
                    item.orderNo?.toLowerCase?.().startsWith(value.toLowerCase()) ||
                    item.quantity?.toString().toLowerCase?.().startsWith(value.toLowerCase()) ||
                    new Date(item.startDate)
                        .toLocaleDateString()
                        .startsWith(value.toLowerCase())

                const includes =
                    item.orderNo?.toLowerCase?.().includes(value.toLowerCase()) ||
                    item.quantity?.toString().toLowerCase?.().includes(value.toLowerCase()) ||
                    new Date(item.startDate)
                        .toLocaleDateString()
                        .startsWith(value.toLowerCase())


                if (startsWith) {
                    return startsWith;
                } else if (!startsWith && includes) {
                    return includes;
                } else return null;
            });
            setFilteredData(updatedData);
            setSearchValue(value);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'api/Production/GetAll').then(response => {
            setData(response.data.data);
        })
    }



    const history = useHistory();
    const openExcelImport = () => {
        setSelectionModal(false);
        let path = '/production/import-excel';
        history.push(path);
    }

    const openDetail = (id) => {
        setSelectionModal(false);
        let path = '/production/' + id;
        history.push(path);}
    const removeProduction=(id)=>{
        setRemoveItem(id)
    }

    const printProduction=(id,orderNo)=>{
axios.get(process.env.REACT_APP_API_ENDPOINT+"api/Production/GetAllQrCodeDetail?productionId="+id).then((res)=>{
  
        ExportExcel(res.data.data,orderNo, "QR");
   
})
    }
    const handleModal = () => setRemoveItem(null);
    const deleteRegion = () => {
        try {
            
          axios.delete(process.env.REACT_APP_API_ENDPOINT +"api/Production/Delete?Id="+removeItem).then((res) => {
       
            if(res.data.success){
              handleModal();
              loadData();
              toastData("Üretim Planlama Başarıyla Silindi",true);
            }
            else{
              handleModal();
              toastData("Üretim Planlama Silinemez !",false);
            }     
          }).catch(err=>toastData("Üretim Planlama Silinemez !",false));
      
        } catch (error) {
            handleModal();
            toastData("Üretim Emri Silinemez !",false);

        }
      };
    return (<>
        <Modal
        isOpen={removeItem!=null}
        toggle={handleModal}
        className={`modal-dialog-centered modal-sm`}
     
        contentClassName='pt-0'
      >
        <ModalHeader className='mb-1' toggle={handleModal} close={<X className='cursor-pointer' size={15} onClick={handleModal} />} tag='div'>
          <h5 className='modal-title'>Üretim Emri Sil</h5>
        </ModalHeader>
        <ModalBody className='flex-grow-1'>
        <div className="text-center">Üretim emrini silmek istediğinize eminmisiniz?</div>
          <div className="text-center">
  
          <Button className='me-1' color='primary' onClick={deleteRegion}>
            Evet
          </Button>
          <Button color='secondary' onClick={handleModal} outline>
            Hayır
          </Button>
          </div>
        </ModalBody>
      </Modal>
        <div>
            <div className='content-header row'>
                <div className='content-header-left col-md-9 col-12 mb-2'>
                    <div className='row breadcrumbs-top'>
                        <div className='col-12'>
                            <h2 className='content-header-title float-start mb-0'>{'Üretim Plan Listesi'}</h2>
                            <div className='breadcrumb-wrapper vs-breadcrumbs d-sm-block d-none col-12'>
                                <Breadcrumb className='ms-1'>
                                    <BreadcrumbItem>
                                        <Link to='/'> Dashboard </Link>
                                    </BreadcrumbItem>
                                    <BreadcrumbItem>
                                        <span> Üretim Planlama </span>
                                    </BreadcrumbItem>
                                </Breadcrumb>
                            </div>
                        </div>
                    </div>
                </div>


                <div className='content-header-right text-md-end col-md-3 col-12 d-md-block d-none'>
                    <div className='breadcrumb-right'>
                        <Button.Ripple className='btn-icon' color='primary' id='newProductionOrder'
                            onClick={() => setSelectionModal(!selectionModal)}>
                            <PlusSquare size={20} />
                        </Button.Ripple>
                        <UncontrolledTooltip placement='left' target='newProductionOrder'>
                            Yeni Üretim Emri
                        </UncontrolledTooltip>
                    </div>
                </div>
            </div>
            <Modal isOpen={selectionModal} toggle={() => setSelectionModal(!selectionModal)}
                className='modal-dialog-centered'>
                <ModalHeader toggle={() => setSelectionModal(!selectionModal)}>Yeni Üretim Emri</ModalHeader>
                <ModalBody>
                    <Button.Ripple block outline color='secondary' className={'mb-1'} onClick={()=>history.push("/newProduction")}>
                        Formdan Oluştur
                    </Button.Ripple>
                    <Button.Ripple block outline color='secondary' onClick={() => openExcelImport()}>
                        Excel'den Aktar
                    </Button.Ripple>
                </ModalBody>
            </Modal>

            <Card>
                <Row className='justify-content-end mx-0' >
                    <Col className='d-flex align-items-center justify-content-end mt-1' md='6' sm='12'>
                        <Label className='me-1' for='search-input-1'> {'Ara'} </Label>
                        <Input
                            className='dataTable-filter mb-50'
                            type='text'
                            bsSize='sm'
                            id='search-input-1'
                            value={searchValue}
                            onChange={(e)=>setSearchValue(e.target.value)}
                        />
                    </Col>
                </Row>
                
                <div className='react-dataTable' style={{ height: '75vh', width: '100%', overflow: 'auto' }}  >
                    <ClassicDataTable key={key} data={data} columns={columns} noDataText="Üretim Bulunamadı"  searchValue={searchValue} />
                </div>


            </Card>


        </div>
        </>
    )
}

export default ProductionList
