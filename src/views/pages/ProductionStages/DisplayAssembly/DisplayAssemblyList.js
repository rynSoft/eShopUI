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

} from "reactstrap";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { Link } from "react-router-dom";
import { useState } from "react";

import ExpandableTable from "../../../../@core/components/gridTable/ExpandableTable";
const DisplayAssemblyList = () => {
    const [searchValue, setSearchValue] = useState("");
    return (
        <div>
            <div className="content-header row">
                <div className="content-header-left col-md-9 col-12 mb-2">
                    <div className="row breadcrumbs-top">
                        <div className="col-12">
                            <h2 className="content-header-title float-start mb-0">
                                {"Display Montaj  Listesi"}
                            </h2>
                            <div className="breadcrumb-wrapper vs-breadcrumbs d-sm-block d-none col-12">
                                <Breadcrumb className="ms-1">
                                    <BreadcrumbItem>
                                        <Link to="/"> Dashboard </Link>
                                    </BreadcrumbItem>
                                    <BreadcrumbItem>
                                        <span> Display Montaj Listesi</span>
                                    </BreadcrumbItem>
                                </Breadcrumb>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='content-header-right text-md-end col-md-3 col-12 d-md-block d-none'>
                    <div className='breadcrumb-right'>
                        {/* <Button.Ripple className='btn-icon' color='primary' id='newProductionOrder'
                            onClick={() => setSelectionModal(!selectionModal)}>
                            <PlusSquare size={20} />
                        </Button.Ripple>
                        <UncontrolledTooltip placement='left' target='newProductionOrder'>
                            Yeni Kalite Emri
                        </UncontrolledTooltip> */}
                    </div>
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
                            onChange={(e)=>setSearchValue(e.target.value)}
                          
                        />
                    </Col>
                </Row>

                <div className="react-dataTable">
                <ExpandableTable noDataText="Display Montajı İş Emri Mevcut Değil" productionProcess={8}  searchValue={searchValue}/>
                </div>

            </Card>
        </div>
    );
};

export default DisplayAssemblyList;
