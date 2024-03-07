import {
    Card,

    CardBody,

    CardText,

    Row,
    Col,
    Input,
    Label,
    CardFooter,
    Button,
    Breadcrumb,
    BreadcrumbItem,
    UncontrolledTooltip,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { ChevronDown, Edit, Info, PlusSquare, Printer } from "react-feather";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";

import ReactPaginate from "react-paginate";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { Link, useHistory } from "react-router-dom";
import CustomPagination from "../../../../@core/components/gridTable/CustomPagination";
import ExportPdf from "../../../../@core/components/gridTable/ExportPdf/exportPdf";
import ExportExcel from "../../../../@core/components/gridTable/ExportExcel";


const QualityConfirmationList = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        loadData();

    }, []);
    const loadData = () => {
        axios
            .get(process.env.REACT_APP_API_ENDPOINT + "api/QualityOperation/GetApprowingUserList")
            .then((response) => {
                setData(response.data.data);
            });
    };
    const [rowCount, setRowCount] = useState(window.screen.height < 801 ? 8 : 11);
    const NoDataConst = "Kalite Onayı Mevcut Değil";


    const [currentPage, setCurrentPage] = useState(0);




    const [searchValue, setSearchValue] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [selectionModal, setSelectionModal] = useState(false);

    const columns = [
        {
            name: "Tip",
            sortable: true,
            maxWidth: "100px",
            selector: (row) => row.quality.qualityType
        },
        {
            name: "İş Emri",
            sortable: true,
            maxWidth: "200px",
            selector: (row) => row.quality.workOrderNumber,
        },

        {
            name: "Ürün Kodu",
            sortable: true,
            maxWidth: "200px",
            selector: (row) => row.quality.productionCode,
        },
        {
            name: "Seri No",
            sortable: true,
            maxWidth: "200px",
            selector: (row) => row.quality.serialCode,
        },
        {
            name: "Adet",
            sortable: true,
            maxWidth: "100px",
            selector: (row) => row.quality.piece,
        },
        {
            name: "DURUM",
            sortable: true,
            minWidth: "200px",
            maxWidth: "200px",
            selector: (row) => row.quality.state ?"Tamamlandı": "Devam Ediyor"

        },
        {
            name: "Uygunsuzluk Kodu",
            sortable: true,
            minWidth: "200px",
            selector: (row) => row.quality.nonComplianceCode
        },

        {
            name:  <Fragment><Button.Ripple
            outline
            id="pdfPrint"
            className="btn-icon rounded-circle pull-right"
            color="danger"
            onClick={() => {
              ExportPdf(data, "kaliteOnayListesi", "KALİTE ONAY LİSTESİ");
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
                    ExportExcel(searchValue.length ? filteredData : data, "kaliteOnayListesi", "KALİTE ONAY LİSTESİ");
                  }}
                >
                    <Printer size={17} />
                  </Button.Ripple></Fragment> ,
            allowOverflow: true,
            maxWidth: "150px",
            cell: (row) => {
                return (
                    <div className="d-flex">
                        <Button.Ripple
                            className="btn-icon"
                            color="flat-primary"
                            onClick={() => { openDetail(row.quality.id) }}
                        >
                            <Info size={18} />
                        </Button.Ripple>
                    </div>
                );
            },
        },
    ];


    const handleFilter = (e) => {
        const value = e.target.value;
        let updatedData = [];
        setSearchValue(value);

        if (value.length) {
            updatedData = data.filter((item) => {
                const startsWith =

                    item.production?.orderNo?.toLowerCase?.().startsWith(value.toLowerCase()) ||
                    item.production?.quantity?.toString().toLowerCase?.().startsWith(value.toLowerCase()) ||
                    new Date(item.production.startDate)
                        .toLocaleDateString()
                        .startsWith(value.toLowerCase())

                const includes =
                    item.production?.orderNo?.toLowerCase?.().startsWith(value.toLowerCase()) ||
                    item.production?.quantity?.toString().toLowerCase?.().startsWith(value.toLowerCase()) ||
                    new Date(item.production.startDate)
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
    };







    const history = useHistory();

    const openDetail = (id) => {
        setSelectionModal(false);
        let path = "/qualityConfirmation/" + id;
        history.push(path);
    };
    return (
        <div>
            <div className="content-header row">
                <div className="content-header-left col-md-9 col-12 mb-2">
                    <div className="row breadcrumbs-top">
                        <div className="col-12">
                            <h2 className="content-header-title float-start mb-0">
                                {"Kalite Onay Listesi"}
                            </h2>
                            <div className="breadcrumb-wrapper vs-breadcrumbs d-sm-block d-none col-12">
                                <Breadcrumb className="ms-1">
                                    <BreadcrumbItem>
                                        <Link to="/"> Dashboard </Link>
                                    </BreadcrumbItem>
                                    <BreadcrumbItem>
                                        <span> Kalite Onay Listesi</span>
                                    </BreadcrumbItem>
                                </Breadcrumb>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='content-header-right text-md-end col-md-3 col-12 d-md-block d-none'>
                    {/* <div className='breadcrumb-right'>
                        <Button.Ripple className='btn-icon' color='primary' id='newProductionOrder'
                            onClick={() => setSelectionModal(!selectionModal)}>
                            <PlusSquare size={20} />
                        </Button.Ripple>
                        <UncontrolledTooltip placement='left' target='newProductionOrder'>
                            Yeni Kalite Emri
                        </UncontrolledTooltip>
                    </div> */}
                </div>

            </div>

            <Card>
                <Row className="justify-content-end mx-0">
                    <Col
                        className="d-flex align-items-center justify-content-end mt-1"
                        md="6"
                        sm="12"
                    >
                        <Label className="me-1" for="search-input-1">
                            {" "}
                            {"Ara"}{" "}
                        </Label>
                        <Input
                            className="dataTable-filter mb-50"
                            type="text"
                            bsSize="sm"
                            id="search-input-1"
                            value={searchValue}
                            onChange={handleFilter}
                        />
                    </Col>
                </Row>

                <div className="react-dataTable">
                    <DataTable
                        noHeader
                        pagination
                        columns={columns}
 
                        className="react-dataTable"
                        sortIcon={<ChevronDown size={10} />}
                        paginationPerPage={rowCount}
                        paginationComponent={ ()=>CustomPagination(searchValue.length ? filteredData : data,currentPage,(value)=>setCurrentPage(value))}
      
                        paginationDefaultPage={currentPage + 1}
                        data={searchValue.length ? filteredData : data}
                        noDataComponent={NoDataConst}
                    />
                </div>

            </Card>
        </div>
    );
};

export default QualityConfirmationList;
