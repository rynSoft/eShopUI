import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Breadcrumb,
  BreadcrumbItem,
  UncontrolledTooltip,
  Button,
  Input,
  Badge,
  Spinner,
} from "reactstrap";
import DataTable from "react-data-table-component";
import "@styles/base/core/menu/menu-types/vertical-menu.scss";
import PerfectScrollbar from "react-perfect-scrollbar";
import { UseSelector, useDispatch } from "react-redux";
import "@styles/base/core/menu/menu-types/vertical-overlay-menu.scss";
import { workingActive, workingPassive } from "../../../redux/refreshData";
import {
  Check,
  Clock,
  MoreHorizontal,
  Pause,
  PlayCircle,
  Plus,
  Save,
  Settings,
  StopCircle,
  User,
  UserMinus,
  UserPlus,
  XOctagon,
} from "react-feather";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { Link, useHistory } from "react-router-dom";
import "@styles/react/libs/tables/react-dataTable-component.scss";



import "./ProductionDetail.css";
import UILoader from "../../../@core/components/ui-loader";


import ProductionLogs from "./ProductionLogs";

const Activities = (props) => {

  const { id, productionData, infoBlock, setpanelCardCount, panelCardCount, estimatedTime, setEstimatedTime } = props
  return (
    <Fragment>
      <UILoader blocking={infoBlock} >
                           
 
                    <ProductionLogs
                      style={{ all: "unset" }}
                      productionId={id != null ? Number(id) : null}
                    />
       
      
      </UILoader>


    </Fragment>
  );
};

export default Activities;
