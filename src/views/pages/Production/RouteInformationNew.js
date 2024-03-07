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
  Eye,
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

import axios from "axios";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { Link, useHistory } from "react-router-dom";
import "@styles/react/libs/tables/react-dataTable-component.scss";

import Avatar from "@components/avatar";

import "./ProductionDetail.css";
import UILoader from "../../../@core/components/ui-loader";


import toastData from "../../../@core/components/toastData";

const RouteInformationNew = (props) => {
  const { id,setupVerificationImport,routeData,routeInfoBlock,disabledButton,setDisabledButton} = props
  const newWorking = useDispatch();

  const routeDataUpdate = (newState, rowId) => {
    setDisabledButton(true);
    axios
      .put(
        process.env.REACT_APP_API_ENDPOINT +
        "api/RouteInfo/UpdateState", { id: rowId, state: newState }

      )
      .then((res) => {
        if (res.data.success) {
          loadRouteInfoData();
          toastData("Rota Durumu Güncellendi", true);
        }
        else {
          toastData("Rota Durumu Güncellenemedi", false);
        }
        setDisabledButton(false);
      });

  };



  const columnsRoute = [
    {
      name: "Rota ADI",
 
      cell: (row) => {
        return (
          <div>{row.explanation}</div>
        );
      },
    },

 


    {
      name: "DURUM",
      maxWidth: "50px",
      selector: (row) => row.state,
      cell: (row) => {
        return (
          disabledButton ? <Badge color={row.state ? "light-info" : "light-info"} style={{ cursor: "pointer" }}><Spinner size="sm" /></Badge>
            : <Badge color={row.state ? "light-success" : "light-danger"} style={{ cursor: "pointer" }} onClick={() => routeDataUpdate(!row.state, row.id)}>{row.state ? "Aktif" : "Pasif"}</Badge>



        );
      },
    },


    {
      name: "DETAY",
      maxWidth: "50px",
      selector: (row) => row.kitDogrulamaState,
      cell: (row) => {
        return (
          <>
            {row.explanation === "KIT_HAZIRLAMA" ? (
              row.kitHazirlamaState == 1 ? (
                <Avatar color="light-success" icon={<Eye size={14} />} />
              ) : row.kitHazirlamaState == 2 ? (
                <Avatar color="light-danger" icon={<Eye size={14} />} />
              ) : row.kitHazirlamaState == 3 ? (
                <Avatar color="light-warning" icon={<Eye size={14} />} />
              ) : row.kitHazirlamaState == 4 ? (
                <Avatar color="light-info" icon={<Eye size={14} />} />
              ) : (
                <Avatar color="light-success" icon={<Eye size={14} />} />
              )
            ) : row.explanation === "DOKUMAN_KONTROLU" ? (
              row.kitDogrulamaState == 1 ? (
                <Avatar color="light-success" icon={<Eye size={14} />} />
              ) : row.kitDogrulamaState == 2 ? (
                <Avatar color="light-danger" icon={<Eye size={14} />} />
              ) : row.kitDogrulamaState == 3 ? (
                <Avatar color="light-warning" icon={<Eye size={14} />} />
              ) : row.kitDogrulamaState == 4 ? (
                <Avatar color="light-info" icon={<Eye size={14} />} />
              ) : (
                <Avatar color="light-success" icon={<Eye size={14} />} />
              )
            ) : (
              <Avatar color="light-success" icon={<Eye size={14} />} />
            )}
          </>
        );
      },
    },
  ];

  const sendToSV = () => {
    const parameters = {
      productionId: id,
      productionProcess: 3,
      productionTimeStatus: 4,
      message: +"Kit Doğrulama Süreci Tamamlandı",
    };
    axios
      .post(
        process.env.REACT_APP_API_ENDPOINT +
        "api/ProductionTimeProcecss/StopVirtual",
        parameters
      )
      .then((res) => {
        newWorking(workingActive());
        toastData("Setup Doğrulamaya Aktarıldı", true);
      });
  };



  return (
    <UILoader blocking={routeInfoBlock} >
    <Card className="CardDetail">
      <CardHeader>
        <CardTitle tag="h4"></CardTitle>

        <Button.Ripple
          size="sm"
          disabled={setupVerificationImport}
          style={{ marginTop: -10 }}
          color="info"
          id="sendToSV"
          onClick={sendToSV}
        >
          <Check size={16} />
        </Button.Ripple>
        <UncontrolledTooltip placement="right" target="sendToSV">
          Setup Doğrulamaya Aktar
        </UncontrolledTooltip>
      </CardHeader>


<Row style={{paddingLeft:10}}>


  <Col sm={12}>  
  
  <h3>Rota Bilgisi</h3>
  <div className="react-dataTable">
        <PerfectScrollbar
          options={{ wheelPropagation: false, suppressScrollX: true }}
          className="ScrollHeightAll"

        >
          <DataTable
            selectableRowsNoSelectAll
            columns={columnsRoute}
            className="react-dataTable"
            data={routeData}
          />
        </PerfectScrollbar>
      </div></Col>
</Row>


    

    </Card>
  </UILoader>
  );
};

export default RouteInformationNew;
