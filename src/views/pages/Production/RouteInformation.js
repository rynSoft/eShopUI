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

import axios from "axios";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { Link, useHistory } from "react-router-dom";
import "@styles/react/libs/tables/react-dataTable-component.scss";

import Avatar from "@components/avatar";

import "./ProductionDetail.css";
import UILoader from "../../../@core/components/ui-loader";


import toastData from "../../../@core/components/toastData";

const RouteInformation = (props) => {
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


  const columns2 = [
    {
      name: "Aşama",
      maxWidth: "200px",
      cell: (row) => {
        return (
          <div>{row.explanation}</div>
        );
      },
    }
  ];

  const columnsRoute = [
    {
      name: "Aşama",
      maxWidth: "200px",
      cell: (row) => {
        return (
          <div>{row.explanation}</div>
        );
      },
    },

    {
      name: "Kullanıcı",


      cell: (row) => {


        return (

          <div className="d-flex">

            {row.userList.map((user,key) => <div key={key}> <UserMinus

              onClick={() => showUserModal("delete", { id: user.userRouteInfoId, explanation: row.explanation })}
              style={{ cursor: "pointer", marginLeft: 10 }}
              size={16}
            ></UserMinus>{user.name} {user.surName}      </div>)}
            <UserPlus

              onClick={() => showUserModal("insert", row)}
              style={{ cursor: "pointer", marginLeft: 10 }}
              size={16}
            ></UserPlus>
          </div>



        );
      },
    },
    {
      name: "Durum",
      maxWidth: "50px",
      selector: (row) => row.kitDogrulamaState,
      cell: (row) => {
        return (
          <>
            {row.explanation === "KIT_HAZIRLAMA" ? (
              row.kitHazirlamaState == 1 ? (
                <Avatar color="light-success" icon={<PlayCircle size={14} />} />
              ) : row.kitHazirlamaState == 2 ? (
                <Avatar color="light-danger" icon={<Pause size={14} />} />
              ) : row.kitHazirlamaState == 3 ? (
                <Avatar color="light-warning" icon={<PlayCircle size={14} />} />
              ) : row.kitHazirlamaState == 4 ? (
                <Avatar color="light-info" icon={<StopCircle size={14} />} />
              ) : (
                <Avatar color="light-success" icon={<PlayCircle size={14} />} />
              )
            ) : row.explanation === "DOKUMAN_KONTROLU" ? (
              row.kitDogrulamaState == 1 ? (
                <Avatar color="light-success" icon={<PlayCircle size={14} />} />
              ) : row.kitDogrulamaState == 2 ? (
                <Avatar color="light-danger" icon={<Pause size={14} />} />
              ) : row.kitDogrulamaState == 3 ? (
                <Avatar color="light-warning" icon={<PlayCircle size={14} />} />
              ) : row.kitDogrulamaState == 4 ? (
                <Avatar color="light-info" icon={<StopCircle size={14} />} />
              ) : (
                <Avatar color="light-success" icon={<PlayCircle size={14} />} />
              )
            ) : (
              <Avatar color="light-success" icon={<PlayCircle size={14} />} />
            )}
          </>
        );
      },
    },

    {
      name: "ROTA",
      maxWidth: "50px",
      selector: (row) => row.state,
      cell: (row) => {
        return (
          disabledButton ? <Badge color={row.state ? "light-info" : "light-info"} style={{ cursor: "pointer" }}><Spinner size="sm" /></Badge>
            : <Badge color={row.state ? "light-success" : "light-danger"} style={{ cursor: "pointer" }} onClick={() => routeDataUpdate(!row.state, row.id)}>{row.state ? "Aktif" : "Pasif"}</Badge>



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


    

        <span placement="left" target="sendToSV">
        buraya rota adı gelecek
      </span>
      </CardHeader>


<Row style={{paddingLeft:10}}>

  <Col sm={3} >
  <h3>Şablon</h3>
  <div className="react-dataTable">
        <PerfectScrollbar
          options={{ wheelPropagation: false, suppressScrollX: true }}
          className="ScrollHeightDynamic"

        >
          <DataTable
            selectableRowsNoSelectAll
            columns={columns2}
            className="react-dataTable"
            data={routeData}
          />
        </PerfectScrollbar>
      </div>
  </Col>
  <Col sm={9}>  
  
  <h3>Rota Bilgisi</h3>
  <div className="react-dataTable">
        <PerfectScrollbar
          options={{ wheelPropagation: false, suppressScrollX: true }}
          className="ScrollHeightDynamic"

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

export default RouteInformation;
