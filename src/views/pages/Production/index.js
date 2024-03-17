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
  TabContent,
  TabPane,
  NavItem,
  Nav,
  NavLink,
} from "reactstrap";
import DynamicComponent from './DynamicComponent';
import DataTable from "react-data-table-component";
import "@styles/base/core/menu/menu-types/vertical-menu.scss";
import PerfectScrollbar from "react-perfect-scrollbar";
import { UseSelector, useDispatch } from "react-redux";
import "@styles/base/core/menu/menu-types/vertical-overlay-menu.scss";
import { Fragment, useEffect, useState } from "react";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { Link, useHistory } from "react-router-dom";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import "./ProductionDetail.css";
import BomkitInformation from "./BomkitInformation";
import axios from "axios";
import RouteInformation from "./RouteInformation";
import Activities from "./Activities";
import { Save } from "react-feather";
import Test from "./Test";
import RouteInformationNew from "./RouteInformationNew";
import toastData from "../../../@core/components/toastData";
import Verification from "../KitVerification/Verification";
import { useTranslation } from "react-i18next";
const ProductionDetail = (props) => {
  const [id, setId] = useState(props.match.params.id);
  const [bomData, setBomData] = useState([]);
  const [infoBlock, setInfoBlock] = useState(false);
  const [routeData, setRouteData] = useState([]);
  const [bomInfoBlock, setBomInfoBlock] = useState(false);
  const [active, setActive] = useState("1");
  const [setupVerificationImport, setSetupVerificationImport] = useState(true);
  const [routeInfoBlock, setRouteInfoBlock] = useState(false);
  const [productionData, setProductionData] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [panelCardCount, setpanelCardCount] = useState(0);
  const [navItemData, setNavItemData] = useState([]);
  const [workProcessTemplate, setWorkProcessTemplate] = useState([])
  const { t } = useTranslation();
  const toggle = (tab) => {
    setActive(tab);
  };
  useEffect(() => {
    loadBomInfoData();
    loadRouteInfoData();
    loadInfoData();
    loadNavItem();
  }, []);
  let x = { "params": { "id": id } };


  const loadNavItem = () => {
    axios
      .get(process.env.REACT_APP_API_ENDPOINT + "api/WorkProcessTemplate/GetNavListProductionId?productionId=" + id)
      .then((response) => {
        setNavItemData(response.data.data);
      })
      .catch(err => toastData(err.message, false));
  }
  const loadInfoData = () => {
    setInfoBlock(true);
    axios
      .get(
        process.env.REACT_APP_API_ENDPOINT + "api/Production/GetById?id=" + id
      )
      .then((response) => {
        setProductionData(response.data);
        setEstimatedTime(
          response.data?.estimatedTime == null
            ? 0
            : response.data?.estimatedTime
        );
        setpanelCardCount(
          response.data?.panelCardCount == null
            ? 0
            : response.data?.panelCardCount
        );
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
      {/*       
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


      </div> */}

      <div>
        <Row>
          <Col sm={20}>
            {" "}
            <Row className={"mt-2"}>
              <Col>
                <Nav className="justify-content-left" tabs>
                  <NavItem>
                    <NavLink
                      active={active === "1"}
                      onClick={() => {
                        toggle("1");
                      }}
                    >
                      {t("uretimBilgisi")}
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink
                      active={active === "4"}
                      onClick={() => {
                        toggle("4");
                      }}
                    >
                      {t('Rota Bilgisi')}
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink
                      active={active === "3"}
                      onClick={() => {
                        toggle("3");
                      }}
                    >
                      {t('Bom Kit Bilgisi')}
                    </NavLink>
                  </NavItem>
                  {navItemData.map(nav => <NavItem>
                    <NavLink active={active === nav.id}
                      key={nav.id}
                      onClick={() => { toggle(nav.id) }}
                    >
                      {nav.name}
                    </NavLink>
                  </NavItem>)}
                </Nav>
                <TabContent className="py-50" activeTab={active}>
                  <TabPane tabId="1">
                    <Row style={{ paddingTop: 10 }}>
                      <Col sm={3}>
                        <Card>
                          <br></br>
                          <br></br>
                          <br></br>
                          {" "}
                          <dl>
                            <Row >
                              <Col sm="6" className="text-end text-uppercase">
                                <dt>{t('Üretim Emri').toLocaleUpperCase()}</dt>
                              </Col>
                              <Col sm="6">
                                <dd>{productionData?.orderNo}</dd>
                              </Col>
                            </Row>
                          </dl>
                          <dl>
                            <Row>
                              <Col sm="6" className="text-end text-uppercase">
                                <dt>{t('Üretim Adı').toLocaleUpperCase()}</dt>
                              </Col>
                              <Col sm="6">
                                <dd>{productionData?.uretimAdi}</dd>
                              </Col>
                            </Row>
                          </dl>
                          <dl>
                            <Row>
                              <Col sm="6" className="text-end text-uppercase">
                                <dt>{t('Açıklama').toLocaleUpperCase()}</dt>
                              </Col>
                              <Col sm="6">
                                <dd>{productionData?.aciklama}</dd>
                              </Col>
                            </Row>
                          </dl>
                          <dl>
                            <Row>
                              <Col sm="6" className="text-end text-uppercase">
                                <dt>{t('Üretim Adedi').toLocaleUpperCase()}</dt>
                              </Col>
                              <Col sm="6">
                                <dd>{productionData?.quantity}</dd>
                              </Col>
                            </Row>
                          </dl>
                          <dl>
                            <Row>
                              <Col sm="6" className="text-end text-uppercase">
                                <dt>{t('Açılış Tarihi').toLocaleUpperCase()}</dt>
                              </Col>
                              <Col sm="6">
                                <dd>
                                  {productionData != null && productionData != ""
                                    ? new Date(
                                      productionData?.startDate
                                    ).toLocaleDateString()
                                    : null}
                                </dd>
                              </Col>
                            </Row>
                          </dl>
                          <dl>
                            <Row>
                              <Col sm="6" className="text-end text-uppercase">
                                <dt>{t('Ürün Geçiş Süresi').toLocaleUpperCase()}</dt>
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
                            </Row>
                          </dl>
                          <dl>
                            <Row>
                              <Col sm="6" className="text-end text-uppercase">
                                <dt>{t('Panel Kart Adeti').toLocaleUpperCase()}</dt>
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
                              <br></br>
                              <br></br>
                              <Col
                                sm="12"
                                style={{ textAlign: "center", marginTop: 20 }}
                              >
                                <Button
                                  size="sm"
                                  onClick={() => estimatedTimeController()}
                                >
                                  <Save size={12} /> {t('kaydet')}
                                </Button>
                              </Col>
                            </Row>
                          </dl>
                          <br></br>
                          <br></br>
                        </Card>
                      </Col>

                      <Col sm={9} style={{ paddingTop: 5 }}>
                        <Activities
                          id={id}
                          productionData={productionData}
                          infoBlock={infoBlock}
                          setpanelCardCount={(value) => setpanelCardCount(value)}
                          setEstimatedTime={(value) => setEstimatedTime(value)}
                          panelCardCount={panelCardCount}
                          estimatedTime={estimatedTime}
                        />
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="3">
                    <BomkitInformation
                      bomData={bomData}
                      bomInfoBlock={bomInfoBlock}
                    />
                  </TabPane>
                  <TabPane tabId="4">
                    <Test productionId={id} />
                  </TabPane>
                  {navItemData.map(nav => (
                    <TabPane tabId={nav.id} key={nav.id}>
                      {<DynamicComponent key={nav.id} component={nav.whichPage} id={id} match={x} />}
                    </TabPane>
                  ))}

                  {/* <TabPane tabId="6">
                    <RouteInformationNew
                      id={id}
                      setupVerificationImport={setupVerificationImport}
                      routeData={routeData}
                      routeInfoBlock={routeInfoBlock}
                      disabledButton={disabledButton}
                      setDisabledButton={(value) => setDisabledButton(value)}
                    />
                  </TabPane> */}
                </TabContent>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </Fragment>
  );
};

export default ProductionDetail;
