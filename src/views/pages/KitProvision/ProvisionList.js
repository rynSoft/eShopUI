import {
  Card,
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
import moment from "moment";
import { dateFormat, serverDateFormat } from "../../../utility/Constants";

import "@styles/react/libs/tables/react-dataTable-component.scss";
import { Link, useHistory } from "react-router-dom";
import ExpandableTable from "../../../@core/components/gridTable/ExpandableTable";
const ProvisionList = () => {
  const [searchValue, setSearchValue] = useState("");
  return (
    <div>
      <div className="content-header row">
        <div className="content-header-left col-md-9 col-12 mb-2">
          <div className="row breadcrumbs-top">
            <div className="col-12">
              <h2 className="content-header-title float-start mb-0">
                {"Kit Hazırlama Listesi"}
              </h2>
              <div className="breadcrumb-wrapper vs-breadcrumbs d-sm-block d-none col-12">
                <Breadcrumb className="ms-1">
                  <BreadcrumbItem>
                    <Link to="/"> Dashboard </Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <span> Kit Hazırlama Listesi</span>
                  </BreadcrumbItem>
                </Breadcrumb>
              </div>
            </div>
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

        <div className="react-dataTable" style={{ zoom: "85%" }}>
          <ExpandableTable noDataText="İş Emri Mevcut Değil" productionProcess={2} searchValue={searchValue}/>
        </div>

      </Card>
    </div>
  );
};

export default ProvisionList;
