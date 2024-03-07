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

import Avatar from "@components/avatar";

import "./ProductionDetail.css";
import UILoader from "../../../@core/components/ui-loader";
import moment from "moment";

import ProductionLogs from "./ProductionLogs";
import toastData from "../../../@core/components/toastData";
import UserModal from "./UserModal";
const ProductionDetail = (props) => {
  const newWorking = useDispatch();
  const [userModalState, setUserModalState] = useState(false);
  const [userModalData, setUserModalData] = useState({});
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [panelCardCount, setpanelCardCount] = useState(0);
  const [modalType, setModalType] = useState("");
  const [disabledButton, setDisabledButton] = useState(false);


  const showUserModal = (type, row) => {
    setModalType(type)
    setUserModalState(!userModalState);
    loadRouteInfoData();
    setUserModalData(row);
  };
  const [infoBlock, setInfoBlock] = useState(false);
  const [routeInfoBlock, setRouteInfoBlock] = useState(false);
  const [bomInfoBlock, setBomInfoBlock] = useState(false);
  const [id, setId] = useState(props.match.params.id);
  const [productionData, setProductionData] = useState(null);
  const [routeData, setRouteData] = useState([]);
  const [bomData, setBomData] = useState([]);
  const [userList, setUserList] = useState([
    { id: -1, name: "Kullanıcı Mevcut Değil" },
  ]);
  const [userId, setUserId] = useState({
    value: -1,
    label: "Kullanıcı Mevcut Değil",
  });
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

  const estimatedTimeController = () => {
    axios
      .get(
        process.env.REACT_APP_API_ENDPOINT +
        "api/Production/SetEstimatedTime?id=" +
        id +
        "&estimatedTime=" +
        estimatedTime +
       "&panelCardCount=" +
       panelCardCount
      )
      .then((res) => {
        toastData("Geçiş Süresi Güncellendi", true);
      });
  };
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
        // if (res.data.success) {
        //
        // } else {
        //   toastData("Setup Doğrulamaya Aktarılamadı !", false);
        // }
      });
  };

  const columnsBokKit = [
    {
      name: "Malzeme",
      selector: (row) => row.material,
      width: "160px",
    },
    {
      name: "Parti Numarası",
      selector: (row) => row.partyNumber,
      width: "160px",
    },
    {
      name: "Açıklama",

      maxWidth: "400px",
      cell: (row) => {
        return (
          <div>{row.explanation}</div>
        );
      },
    },
  ];

  useEffect(() => {
    loadInfoData();
    loadRouteInfoData();
    loadBomInfoData();
  }, []);
  const [setupVerificationImport, setSetupVerificationImport] = useState(true);
  useEffect(() => {
    let routeUser = routeData.filter((x) => x.explanation === "DIZGI");
    if (routeUser.length > 0 && routeUser[0]?.userList.length != 0) {
      setSetupVerificationImport(false);
    } else {
      setSetupVerificationImport(true);
    }
  }, [routeData]);

  const loadInfoData = () => {
    setInfoBlock(true);
    axios
      .get(
        process.env.REACT_APP_API_ENDPOINT + "api/Production/GetById?id=" + id
      )
      .then((response) => {
       
        setProductionData(response.data);
        setEstimatedTime(response.data?.estimatedTime==null ?0 :response.data?.estimatedTime)
        setpanelCardCount(response.data?.panelCardCount==null ?0 :response.data?.panelCardCount)
        setInfoBlock(false);
      })
      .finally(() => {
        setInfoBlock(false);
      });
  };
  const loadRouteInfoData = () => {
    setRouteInfoBlock(true);
    axios
      .get(
        process.env.REACT_APP_API_ENDPOINT +
        "api/RouteInfo/GetAllAsyncProductId?id=" +
        id
      )
      .then((response) => {

        setRouteData(response.data);
        setRouteInfoBlock(false);
      })
      .finally(() => {
        setRouteInfoBlock(false);
      });
  };
  const loadBomInfoData = () => {
    setBomInfoBlock(true);
    axios
      .get(
        process.env.REACT_APP_API_ENDPOINT +
        "api/BomKitInfo/GetAllAsyncProductId?id=" +
        id
      )
      .then((response) => {
      
        setBomData(
          response.data?.map((i) => {
            i.status = "OK";
            return i;
          })
        );
        setBomInfoBlock(false);
      })
      .finally(() => {
        setBomInfoBlock(false);
      });
  };

  return (
    <Fragment>
      {userModalState && (
        <UserModal
          modalType={modalType}
          closeModal={showUserModal}
          userModalData={userModalData}
          productionId={id}
        />
      )}

      <div>
        <div className="content-header row">
          <div className="content-header-left col-md-9 col-12 mb-2">
            <div className="row breadcrumbs-top">
              <div className="col-12">
                <h2 className="content-header-title float-start mb-0">
                  {"Üretim Plan Listesi"}
                </h2>
                <div className="breadcrumb-wrapper vs-breadcrumbs d-sm-block d-none col-12">
                  <Breadcrumb className="ms-1">
                    <BreadcrumbItem>
                      <Link to="/"> Dashboard </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                      <Link to="/Production"> Üretim Planlama </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                      <span> Üretim </span>
                    </BreadcrumbItem>
                  </Breadcrumb>
                </div>
              </div>
            </div>
          </div>

          <div className="content-header-right text-md-end col-md-3 col-12 d-md-block d-none">
            <div className="breadcrumb-right"></div>
          </div>
        </div>

        <Row>
          <Col
            sm={{
              offset: 0,
              order: 1,
              size: 3,
            }}
          >
            <UILoader blocking={infoBlock} >
              <Card className="CardDetail">
                <CardHeader>
                  {/* <CardTitle tag="h4">Arçelik</CardTitle> */}
                </CardHeader>
                <CardBody className="p-0">
                  <dl>
                    <Row>
                      <Col sm="6" className="text-end text-uppercase">
                        <dt>Üretim Emri</dt>
                      </Col>
                      <Col sm="6">
                        <dd>{productionData?.orderNo}</dd>
                      </Col>
                    </Row>
                  </dl>
                  <dl>
                    <Row>
                      <Col sm="6" className="text-end text-uppercase">
                        <dt>Üretim Adı</dt>
                      </Col>
                      <Col sm="6">
                        <dd>{productionData?.uretimAdi}</dd>
                      </Col>
                    </Row>
                  </dl>
                  <dl>
                    <Row>
                      <Col sm="6" className="text-end text-uppercase">
                        <dt>Açıklama</dt>
                      </Col>
                      <Col sm="6">
                        <dd>{productionData?.aciklama}</dd>
                      </Col>
                    </Row>
                  </dl>
                  <dl>
                    <Row>
                      <Col sm="6" className="text-end text-uppercase">
                        <dt>Üretim Adedi</dt>
                      </Col>
                      <Col sm="6">
                        <dd>{productionData?.quantity}</dd>
                      </Col>
                    </Row>
                  </dl>
                  <dl>
                    <Row>
                      <Col sm="6" className="text-end text-uppercase">
                        <dt>Açılış Tarihi</dt>
                      </Col>
                      <Col sm="6">
                        <dd>
                          {productionData != null && productionData != ""
                            ? 
                              new Date(productionData?.startDate).toLocaleDateString()
                         
                            
                            : null}
                        </dd>
                      </Col>
                    </Row>
                  </dl>
                  <dl>
                    <Row>
                      <Col sm="6" className="text-end text-uppercase">
                        <dt>Ürün Geçii SÜRESİ</dt>
                      </Col>
                      <Col sm="2">
                        <Input
                          id="estimated"
                          bsSize="sm"
                          placeholder="Süre"
                          type="number"
                          onChange={(event) =>
                            setEstimatedTime(event.target.value)
                          }
                          style={{ width: 50 }}
                          value={estimatedTime}
                        />
                      </Col>
                      {/* <Col sm="4">
                        <Button size="sm" onClick={() => estimatedTimeController()}>
                          <Save size={12} /> Kaydet
                        </Button>
                      </Col> */}
                    </Row>
                  </dl>

                  <dl>
                    <Row>
                      <Col sm="6" className="text-end text-uppercase">
                        <dt>Panel Kart Adeti</dt>
                      </Col>
                      <Col sm="2">
                        <Input
                          id="panelCard"
                          bsSize="sm"
                         
                          type="number"
                          onChange={(event) =>
                            setpanelCardCount(event.target.value)
                          }
                          style={{ width: 50 }}
                          value={panelCardCount}
                        />
                      </Col>
                      <Col sm="4">
                        <Button size="sm" onClick={() => estimatedTimeController()}>
                          <Save size={12} /> Kaydet
                        </Button>
                      </Col>
                    </Row>
                  </dl>

                  <h4 style={{ marginLeft: "20px" }}>Aktiviteler</h4>
                  <PerfectScrollbar
                    options={{ wheelPropagation: false, suppressScrollX: true }}
                    className="ScroolDetail"
                  >
                    <Col sm="12">
                      <ProductionLogs
                        style={{ all: "unset" }}
                        productionId={id != null ? Number(id) : null}
                      />
                    </Col>
                  </PerfectScrollbar>
                </CardBody>
              </Card>
            </UILoader>
          </Col>
          <Col
            sm={{
              offset: 0,
              order: 2,
              size: 6,
            }}
          >
            <UILoader blocking={routeInfoBlock}>
              <Card className="CardDetail">
                <CardHeader>
                  <CardTitle tag="h4">Rota Bilgisi</CardTitle>

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
                </div>

              </Card>
            </UILoader>
          </Col>
          <Col
            sm={{
              offset: 0,
              order: 3,
              size: 3,
            }}
          >
            <UILoader blocking={bomInfoBlock}>
              <Card className="CardDetail">
                <CardHeader>
                  <CardTitle tag="h4">BOM KİT Bilgisi</CardTitle>
                </CardHeader>

                <div className="react-dataTable">
                  <PerfectScrollbar
                    options={{ wheelPropagation: false, suppressScrollX: true }}
                    className="ScrollHeightAll"
                  >
                 
                    <div
                      className="react-dataTable"
                      
                      style={{
                        minHeight: window.screen.height * 0.8,
                        maxHeight: window.screen.height * 0.8,
                        zoom: "80%",
                      }}
                    >
                      <DataTable
                        selectableRowsNoSelectAll
                        columns={columnsBokKit}
                        className="react-dataTable custom-height"
                        data={bomData}
           
                      />
                    </div>
                  </PerfectScrollbar>
                </div>
                <Row></Row>
              </Card>
            </UILoader>
          </Col>
        </Row>
      </div>
    </Fragment>
  );
};

export default ProductionDetail;
