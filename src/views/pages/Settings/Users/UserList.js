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
import { Check, ChevronDown, Delete, Edit, Edit3, FileText, Info, PlusSquare, Printer, Trash, XOctagon } from "react-feather";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import ReactPaginate from 'react-paginate'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { Link, useHistory } from "react-router-dom";
import UserForm from "./UserForm";
import { Avatar, Popconfirm, Space } from 'antd';
import toastData from '../../../../@core/components/toastData';
import CustomPagination from '../../../../@core/components/gridTable/CustomPagination';
import ExportPdf from '../../../../@core/components/gridTable/ExportPdf/exportPdf';
import ExportExcel from '../../../../@core/components/gridTable/ExportExcel';
const UserList = () => {
    const [data, setData] = useState([]);
    const [userData, setUserData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchValue, setSearchValue] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [userFormModal, setUserFormModal] = useState(false);
    const deleteRow = (id) => {

        axios.delete(process.env.REACT_APP_API_ENDPOINT + 'api/Account/' + userData.id)
            .then(function (response) {

                toastData("Kullanıcı Başarıyla Silindi", true);
                setDeleteModalState(false);
                loadData();
            })


    };

    const columns = [

        {
            name: 'E-mail',
            sortable: true,
            cell: (row) => {
                return (

                    row.image == null ? <Fragment><Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>U</Avatar> &nbsp;{row.email}</Fragment> : <Fragment> <Avatar src={`data:image/jpeg;base64,${row.image}`} />  &nbsp;  {row.email}</Fragment>

                )
            }

        },
        {
            name: 'Adı Soyadı',
            sortable: true,
            selector: row => row.name + " " + row.surName
        },
        {
            name: <Fragment>İSLEM <Button.Ripple style={{ marginLeft: 10 }}
                outline
                id="pdfPrint"
                className="btn-icon rounded-circle pull-right"
                color="danger"

                onClick={() => {

                    ExportPdf(data, "personelListesi", "PERSONEL LİSTESİ");
                }}
            >
                <Printer size={17} />
            </Button.Ripple>
                <Button.Ripple
                    outline
                    id="excelPrint"
                    className="btn-icon rounded-circle pull-right"
                    color="success"
                    style={{ marginLeft: 5 }}
                    onClick={() => {
                        ExportExcel(searchValue.length ? filteredData : data, "personelListesi", "PERSONEL LİSTESİ");
                    }}
                >
                    <Printer size={17} />
                </Button.Ripple>
            </Fragment>,
            allowOverflow: true,
            sortable: false,
            minWidth: "200px",
            maxWidth: "200px",

            cell: (row) => (
                <div className="column-action d-flex align-items-center">

                    <FileText
                        className="cursor-pointer"
                        size={17}
                        onClick={(e) => { setUserFormModal(true), setUserData(row) }}
                        id={`send-tooltip-${row.id}`}
                    />

                    <UncontrolledTooltip
                        placement="top"
                        target={`send-tooltip-${row.id}`}
                    >
                        Güncelle
                    </UncontrolledTooltip>

                    <Trash
                        size={17}
                        id={`pw-tooltips-${row.id}`}
                        className="mx-1 cursor-pointer"
                        onClick={(e) => deleteModalController(row)}
                    />

                    <UncontrolledTooltip placement="top" target={`pw-tooltips-${row.id}`}>
                        Sil
                    </UncontrolledTooltip>
                </div>
            ),
        },
    ]

    const [deleteModalState, setDeleteModalState] = useState(false);

    const deleteModalController = row => {
        setUserData(row)
        setDeleteModalState(true)
    }



    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)



        if (value.length) {
            updatedData = data.filter((item) => {
                const startsWith =
                    item.email?.toLowerCase?.().startsWith(value.toLowerCase()) ||
                    item.name?.toLowerCase?.().startsWith(value.toLowerCase()) ||
                    item.surName?.toLowerCase?.().startsWith(value.toLowerCase()) ||
                    (item.name?.toLowerCase?.() + " " + item.surName?.toLowerCase?.()).startsWith(value.toLowerCase())
                const includes =
                    item.code?.toLowerCase?.().startsWith(value.toLowerCase()) ||
                    item.name?.toLowerCase?.().startsWith(value.toLowerCase()) ||
                    item.surName?.toLowerCase?.().startsWith(value.toLowerCase()) ||
                    (item.name?.toLowerCase?.() + " " + item.surName?.toLowerCase?.()).startsWith(value.toLowerCase())
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
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'api/Account/GetAllAsync').then(response => {
            setData(response.data.data);
        })
    }

    const userFormCallback = () => {
        loadData();
        setUserFormModal(false);
    }





    return (
        <div>
            <div className='content-header row'>
                <div className='content-header-left col-md-9 col-12 mb-2'>
                    <div className='row breadcrumbs-top'>
                        <div className='col-12'>
                            <h2 className='content-header-title float-start mb-0'>{'Kullanıcı Listesi'}</h2>
                            <div className='breadcrumb-wrapper vs-breadcrumbs d-sm-block d-none col-12'>
                                <Breadcrumb className='ms-1'>
                                    <BreadcrumbItem>
                                        <Link to='/'> Dashboard </Link>
                                    </BreadcrumbItem>
                                    <BreadcrumbItem>
                                        <span> Tanımlar </span>
                                    </BreadcrumbItem>
                                    <BreadcrumbItem>
                                        <span> Kullanıcılar </span>
                                    </BreadcrumbItem>
                                </Breadcrumb>
                            </div>
                        </div>
                    </div>
                </div>


                <div className='content-header-right text-md-end col-md-3 col-12 d-md-block d-none'>
                    <div className='breadcrumb-right'>
                        <Button.Ripple className='btn-icon' color='primary' id='newProductionOrder'
                            onClick={() => { setUserFormModal(!userFormModal), setUserData([]) }}>
                            <PlusSquare size={20} />
                        </Button.Ripple>
                        <UncontrolledTooltip placement='left' target='newProductionOrder'>
                            Yeni Kullanıcı
                        </UncontrolledTooltip>
                    </div>
                </div>
            </div>

            <Card>
                <Row className='justify-content-end mx-0'>
                    <Col className='d-flex align-items-center justify-content-end mt-1' md='6' sm='12'>
                        <Label className='me-1' for='search-input-1'> {'Ara'} </Label>
                        <Input
                            className='dataTable-filter mb-50'
                            type='text'
                            bsSize='sm'
                            id='search-input-1'
                            value={searchValue}
                            onChange={handleFilter}
                        />
                    </Col>
                </Row>
                <CardBody>
                    <div className='react-dataTable'>
                        <DataTable
                            noHeader
                            pagination
                            selectableRowsNoSelectAll
                            columns={columns}
                            className='react-dataTable'
                            paginationPerPage={10}
                            sortIcon={<ChevronDown size={10} />}
                            paginationDefaultPage={currentPage + 1}
                            paginationComponent={() => CustomPagination(searchValue.length ? filteredData : data, currentPage, (value) => setCurrentPage(value))}

                            data={searchValue.length ? filteredData : data}
                            noDataComponent={"Kullanıcı Bulunamadı"}
                        />
                    </div>
                </CardBody>
                <CardFooter>
                    <CardText className='mb-0'>
                    </CardText>
                </CardFooter>
            </Card>

            <Modal className='modal-dialog-centered modal-lg' isOpen={userFormModal} toggle={() => setUserFormModal(!userFormModal)}>
                <ModalHeader className='bg-transparent' toggle={() => setUserFormModal(!userFormModal)}></ModalHeader>
                <ModalBody className='px-sm-5 mx-50 pb-5'>
                    <UserForm callBack={userFormCallback} userData={userData} />
                </ModalBody>
            </Modal>
            <Modal
                className={`modal-dialog-centered modal-sm`}
                isOpen={deleteModalState}
                toggle={() => setDeleteModalState(!deleteModalState)}
            >
                <ModalHeader
                    className="mb-1"
                    toggle={() => setDeleteModalState(!deleteModalState)}
                > Kullanıcı Sil</ModalHeader>


                <ModalBody>
                    <div className="mb-1">
                        {userData?.name} {userData?.surName} Kullanıcısı Silinecek
                    </div>
                    <div className="text-center">
                        <Button className="me-1" color="primary" onClick={deleteRow}>
                            Onay
                        </Button>
                        <Button color="secondary" onClick={() => setDeleteModalState(false)} outline>
                            İptal
                        </Button>
                    </div>
                </ModalBody>
            </Modal>

        </div>
    )
}

export default UserList
