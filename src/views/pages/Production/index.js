import "@styles/base/core/menu/menu-types/vertical-menu.scss";
import "@styles/base/core/menu/menu-types/vertical-overlay-menu.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { Save } from "react-feather";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  Col,
  Input,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane
} from "reactstrap";
import ActiveProject from "../../../@core/components/ActiveProject";
import BrowserState from "../../../@core/components/BrowserStates/BrowserStates";
import toastData from "../../../@core/components/toastData";
import BomkitInformation from "./BomkitInformation";
import DynamicComponent from './DynamicComponent';
import "./ProductionDetail.css";
import Test from "./Test";
const statesArr = [
  {
    avatar: require('@src/assets/images/icons/google-chrome.png').default,
    title: 'Google Chrome',
    value: '0%',
    chart: {
      type: 'radialBar',
      series: [54.4],
      height: 30,
      width: 30,
      options: {
        grid: {
          show: false,
          padding: {
            left: -15,
            right: -15,
            top: -12,
            bottom: -15
          }
        },
        plotOptions: {
          radialBar: {
            hollow: {
              size: '22%'
            },
            dataLabels: {
              showOn: 'always',
              name: {
                show: false
              },
              value: {
                show: false
              }
            }
          }
        },
        stroke: {
          lineCap: 'round'
        }
      }
    }
  },
  {
    avatar: require('@src/assets/images/icons/mozila-firefox.png').default,
    title: 'Mozila Firefox',
    value: '6.1%',
    chart: {
      type: 'radialBar',
      series: [6.1],
      height: 30,
      width: 30,
      options: {
        grid: {
          show: false,
          padding: {
            left: -15,
            right: -15,
            top: -12,
            bottom: -15
          }
        },
        plotOptions: {
          radialBar: {
            hollow: {
              size: '22%'
            },
            dataLabels: {
              showOn: 'always',
              name: {
                show: false
              },
              value: {
                show: false
              }
            }
          }
        },
        stroke: {
          lineCap: 'round'
        }
      }
    }
  },
  {
    avatar: require('@src/assets/images/icons/apple-safari.png').default,
    title: 'Apple Safari',
    value: '14.6%',
    chart: {
      type: 'radialBar',
      series: [14.6],
      height: 30,
      width: 30,
      options: {
        grid: {
          show: false,
          padding: {
            left: -15,
            right: -15,
            top: -12,
            bottom: -15
          }
        },
        plotOptions: {
          radialBar: {
            hollow: {
              size: '22%'
            },
            dataLabels: {
              showOn: 'always',
              name: {
                show: false
              },
              value: {
                show: false
              }
            }
          }
        },
        stroke: {
          lineCap: 'round'
        }
      }
    }
  },
  {
    avatar: require('@src/assets/images/icons/internet-explorer.png').default,
    title: 'Internet Explorer',
    value: '4.2%',
    chart: {
      type: 'radialBar',
      series: [4.2],
      height: 30,
      width: 30,
      options: {
        grid: {
          show: false,
          padding: {
            left: -15,
            right: -15,
            top: -12,
            bottom: -15
          }
        },
        plotOptions: {
          radialBar: {
            hollow: {
              size: '22%'
            },
            dataLabels: {
              showOn: 'always',
              name: {
                show: false
              },
              value: {
                show: false
              }
            }
          }
        },
        stroke: {
          lineCap: 'round'
        }
      }
    }
  },
  {
    avatar: require('@src/assets/images/icons/opera.png').default,
    title: 'Opera Mini',
    value: '8.4%',
    chart: {
      type: 'radialBar',
      series: [8.4],
      height: 30,
      width: 30,
      options: {
        grid: {
          show: false,
          padding: {
            left: -15,
            right: -15,
            top: -12,
            bottom: -15
          }
        },
        plotOptions: {
          radialBar: {
            hollow: {
              size: '22%'
            },
            dataLabels: {
              showOn: 'always',
              name: {
                show: false
              },
              value: {
                show: false
              }
            }
          }
        },
        stroke: {
          lineCap: 'round'
        }
      }
    }
  }
]
const projectsArr = [
  {
    progress: 60,
    progressColor: 'info',
    subtitle: 'React Project',
    title: 'BGC eCommerce App',
    img: require('@src/assets/images/icons/brands/react-label.png').default
  },
  {
    progress: 15,
    progressColor: 'danger',
    subtitle: 'UI/UX Project',
    title: 'Falcon Logo Design',
    img: require('@src/assets/images/icons/brands/xd-label.png').default
  },
  {
    progress: 90,
    progressColor: 'success',
    subtitle: 'Vuejs Project',
    title: 'Dashboard Design',
    img: require('@src/assets/images/icons/brands/vue-label.png').default
  },
  {
    progress: 49,
    progressColor: 'warning',
    subtitle: 'iPhone Project',
    title: 'Foodista mobile app',
    img: require('@src/assets/images/icons/brands/sketch-label.png').default
  },

  {
    progress: 73,
    progressColor: 'info',
    subtitle: 'React Project',
    title: 'Dojo React Project',
    img: require('@src/assets/images/icons/brands/react-label.png').default
  },
  {
    progress: 81,
    title: 'HTML Project',
    progressColor: 'success',
    subtitle: 'Crypto Website',
    img: require('@src/assets/images/icons/brands/html-label.png').default
  },
  {
    progress: 78,
    progressColor: 'success',
    subtitle: 'Vuejs Project',
    title: 'Vue Admin template',
    img: require('@src/assets/images/icons/brands/vue-label.png').default
  }
]
const ProductionDetail = (props) => {
  const [id, setId] = useState(props.match.params.id);
  const [bomData, setBomData] = useState([]);
  const [infoBlock, setInfoBlock] = useState(false);
  const [routeData, setRouteData] = useState([]);
  const [bomInfoBlock, setBomInfoBlock] = useState(false);
  const [active, setActive] = useState("1");
  const [setupVerificationImport, setSetupVerificationImport] = useState(true);
  const [productionData, setProductionData] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [panelCardCount, setpanelCardCount] = useState(0);
  const [navItemData, setNavItemData] = useState([]);
  const [workProcessTemplate, setWorkProcessTemplate] = useState([])
  const [tab, setTab] = useState(null);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const toggle = (tab) => {
    setActive(tab);
  };
  useEffect(() => {
    loadInfoData();
    loadNavItem();
    loadBomInfoData();
  }, []);
  useEffect(() => {
    if (
      loading &&
      JSON.parse(localStorage.getItem("lastTab")) &&
      JSON.parse(localStorage.getItem("lastTab"))?.productionId == id) {
      setTab(JSON.parse(localStorage.getItem("lastTab")));
      toggle(JSON.parse(localStorage.getItem("lastTab"))?.id);
    }
  }, [loading])
  const handleTab = (_tab) => {
    _tab.productionId = id;
    window.localStorage.setItem('lastTab', JSON.stringify(_tab))
    setTab(_tab)
    // setTab(...tab,tab.productionId=id)
  }
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
        setLoading(true)
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
                        handleTab({ "id": "1" })
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
                        handleTab({ "id": "4" })
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
                        handleTab({ "id": "3" })
                      }}
                    >
                      {t('Bom Kit Bilgisi')}
                    </NavLink>
                  </NavItem>
                  {navItemData.map(nav => <NavItem>
                    <NavLink active={active === nav.id}
                      key={nav.id}
                      onClick={() => { toggle(nav.id); setTab(nav); handleTab(nav) }}>
                      {nav.name}
                    </NavLink>
                  </NavItem>)}
                </Nav>
                <TabContent className="py-50" activeTab={active}>
                  <TabPane tabId="1">
                    <Row style={{ paddingTop: 10 }}>
                      <Col sm={4} style={{ paddingTop: 5 }}>
                        <Card style={{ height: "69vh" }}>
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

                      <Col sm={4} style={{ paddingTop: 5 }}>
                        <BrowserState statesArr={statesArr} />
                      </Col>
                      <Col sm={4} style={{ paddingTop: 5 }}>
                        <ActiveProject projectsArr={projectsArr} />
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
                  {tab === null ? <></> :
                    <TabPane tabId={tab.id} key={tab?.id}>
                      {<DynamicComponent key={tab?.id} component={tab?.whichPage} id={id} match={{ "params": { "id": id, "routeId": tab?.id } }} />}
                    </TabPane>
                  }


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
