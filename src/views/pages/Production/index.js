import "@styles/base/core/menu/menu-types/vertical-menu.scss";
import "@styles/base/core/menu/menu-types/vertical-overlay-menu.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { Save } from "react-feather";
import { useTranslation } from "react-i18next";
import ApexChart from "../ProductionProcess/ApexChart";
import PerfectScrollbar from 'react-perfect-scrollbar'
import ApexChartSecond from "../ProductionProcess/ApexChartSecond";
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
  TabPane,
} from "reactstrap";
import ActiveProject from "../../../@core/components/ActiveProject";
import BrowserState from "../../../@core/components/BrowserStates/BrowserStates";
import toastData from "../../../@core/components/toastData";
import DynamicComponent from "./DynamicComponent";
import ProductionLogs from "./ProductionLogs";

import "./ProductionDetail.css";
import Test from "./Test";
import Material from "./Material";
const statesArr = [
  {
    avatar: require("@src/assets/images/icons/google-chrome.png").default,
    title: "Ürün Giriş",
    value: "50%",
    chart: {
      type: "radialBar",
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
            bottom: -15,
          },
        },
        plotOptions: {
          radialBar: {
            hollow: {
              size: "22%",
            },
            dataLabels: {
              showOn: "always",
              name: {
                show: false,
              },
              value: {
                show: false,
              },
            },
          },
        },
        stroke: {
          lineCap: "round",
        },
      },
    },
  },
  {
    avatar: require("@src/assets/images/icons/mozila-firefox.png").default,
    title: "PCB Karta Yazılım Yükleme",
    value: "46.1%",
    chart: {
      type: "radialBar",
      series: [46.1],
      height: 30,
      width: 30,
      options: {
        grid: {
          show: false,
          padding: {
            left: -15,
            right: -15,
            top: -12,
            bottom: -15,
          },
        },
        plotOptions: {
          radialBar: {
            hollow: {
              color: "success",
              size: "22%",
            },
            dataLabels: {
              showOn: "always",
              name: {
                show: false,
              },
              value: {
                show: false,
              },
            },
          },
        },
        stroke: {
          lineCap: "round",
        },
      },
    },
  },
  {
    avatar: require("@src/assets/images/icons/apple-safari.png").default,
    title: "Switch Lehimleme ve Takma (Alt Kapak)",
    value: "44.6%",
    chart: {
      type: "radialBar",
      series: [44.6],
      height: 30,
      width: 30,
      options: {
        grid: {
          show: false,
          padding: {
            left: -15,
            right: -15,
            top: -12,
            bottom: -15,
          },
        },
        plotOptions: {
          radialBar: {
            hollow: {
              size: "22%",
            },
            dataLabels: {
              showOn: "always",
              name: {
                show: false,
              },
              value: {
                show: false,
              },
            },
          },
        },
        stroke: {
          lineCap: "round",
        },
      },
    },
  },
  {
    avatar: require("@src/assets/images/icons/internet-explorer.png").default,
    title: "Pano Aparatı Takma",
    value: "4.2%",
    chart: {
      type: "radialBar",
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
            bottom: -15,
          },
        },
        plotOptions: {
          radialBar: {
            hollow: {
              size: "22%",
            },
            dataLabels: {
              showOn: "always",
              name: {
                show: false,
              },
              value: {
                show: false,
              },
            },
          },
        },
        stroke: {
          lineCap: "round",
        },
      },
    },
  },
  {
    avatar: require("@src/assets/images/icons/opera.png").default,
    title: "Akım Trafosu ve Kesici",
    value: "8.4%",
    chart: {
      type: "radialBar",
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
            bottom: -15,
          },
        },
        plotOptions: {
          radialBar: {
            hollow: {
              size: "22%",
            },
            dataLabels: {
              style: {
                colors: ["#F44336", "#E91E63", "#9C27B0"],
              },
              showOn: "always",
              name: {
                show: false,
              },
              value: {
                show: false,
              },
            },
          },
        },
        stroke: {
          lineCap: "round",
        },
      },
    },
  },
];

const ProductionDetail = (props) => {
  const [id, setId] = useState(props.match.params.id);
  const [projectsArr, setProjectsArr] = useState([]);
  const [materialData, setMaterialData] = useState([]);
  const [infoBlock, setInfoBlock] = useState(false);
  const [routeData, setRouteData] = useState([]);
  const [materialBlock, setMaterialBlock] = useState(false);
  const [active, setActive] = useState("1");
  const [setupVerificationImport, setSetupVerificationImport] = useState(true);
  const [productionData, setProductionData] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [panelCardCount, setpanelCardCount] = useState(0);
  const [navItemData, setNavItemData] = useState([]);
  const [workProcessTemplate, setWorkProcessTemplate] = useState([]);
  const [tab, setTab] = useState(null);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const toggle = (tab) => {
    setActive(tab);
  };

  useEffect(() => {
    loadInfoData();
    loadNavItem();
    loadMaterialData();
    loadProductionHistoryData();
  }, []);

  useEffect(() => {
    if (
      loading &&
      JSON.parse(localStorage.getItem("lastTab")) &&
      JSON.parse(localStorage.getItem("lastTab"))?.productionId == id
    ) {
      setTab(JSON.parse(localStorage.getItem("lastTab")));
      toggle(JSON.parse(localStorage.getItem("lastTab"))?.id);
    }
  }, [loading]);
  const handleTab = (_tab) => {
    _tab.productionId = id;
    window.localStorage.setItem("lastTab", JSON.stringify(_tab));
    setTab(_tab);
  };
  const loadNavItem = () => {
    axios
      .get(
        process.env.REACT_APP_API_ENDPOINT +
          "api/WorkProcessTemplate/GetNavListProductionId?productionId=" +
          id
      )
      .then((response) => {
        setNavItemData(response.data.data);
      })
      .catch((err) => toastData(err.message, false));
  };
  const loadInfoData = () => {
    setInfoBlock(true);
    axios
      .get(
        process.env.REACT_APP_API_ENDPOINT + "api/Production/GetById?id=" + id
      )
      .then((response) => {
        window.localStorage.setItem(
          "productionData",
          JSON.stringify(response.data)
        );

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
  const loadMaterialData = () => {
    setMaterialBlock(true);
    axios
      .get(
        process.env.REACT_APP_API_ENDPOINT +
          "api/Material/GetAllMaterialId?productionId=" +
          id
      )
      .then((response) => {
        setMaterialData(response.data.data);

        window.localStorage.setItem(
          "materialDataCount",
          JSON.stringify(response.data.data.length)
        );

        setMaterialBlock(false);
      })
      .finally(() => {
        setMaterialBlock(false);
        setLoading(true);
      });
  };

  const loadProductionHistoryData = () => {
    axios
      .get(
        process.env.REACT_APP_API_ENDPOINT +
          "api/WorkProcessRoute/GetAllProductIdDashboard?Id=" +
          id
      )
      .then((response) => {
        if (response.data.length > 0) {
          setProjectsArr(response.data);
        }
      })
      .finally(() => {});
  };

  return (
    <Fragment>
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
                        handleTab({ id: "1" });
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
                        handleTab({ id: "4" });
                      }}
                    >
                      {t("Rota Bilgisi")}
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink
                      active={active === "3"}
                      onClick={() => {
                        toggle("3");
                        handleTab({ id: "3" });
                      }}
                    >
                      {t("Bom Kit Bilgisi")}
                    </NavLink>
                  </NavItem>
                  {navItemData.map((nav) => (
                    <NavItem>
                      <NavLink
                        active={active === nav.id}
                        key={nav.id}
                        onClick={() => {
                          toggle(nav.id);
                          setTab(nav);
                          handleTab(nav);
                        }}
                      >
                        {nav.name}
                      </NavLink>
                    </NavItem>
                  ))}
                </Nav>
                <TabContent className="py-50" activeTab={active}>
                  <TabPane tabId="1">
                    <Row style={{ paddingTop: 10 }}>
                      <Col sm={3} style={{ paddingTop: 5 }}>
                        <Row>
                          <Card style={{ height: "40vh" }}>
                            <br></br>
                            <br></br>
                            <br></br>{" "}
                            <dl>
                              <Row>
                                <Col sm="6" className="text-end text-uppercase">
                                  <dt>
                                    {t("Üretim Emri").toLocaleUpperCase()}
                                  </dt>
                                </Col>
                                <Col sm="6">
                                  <dd>{productionData?.orderNo}</dd>
                                </Col>
                              </Row>
                            </dl>
                            <dl>
                              <Row>
                                <Col sm="6" className="text-end text-uppercase">
                                  <dt>{t("Üretim Adı").toLocaleUpperCase()}</dt>
                                </Col>
                                <Col sm="6">
                                  <dd>{productionData?.uretimAdi}</dd>
                                </Col>
                              </Row>
                            </dl>
                            <dl>
                              <Row>
                                <Col sm="6" className="text-end text-uppercase">
                                  <dt>{t("Açıklama").toLocaleUpperCase()}</dt>
                                </Col>
                                <Col sm="6">
                                  <dd>{productionData?.aciklama}</dd>
                                </Col>
                              </Row>
                            </dl>
                            <dl>
                              <Row>
                                <Col sm="6" className="text-end text-uppercase">
                                  <dt>
                                    {t("Üretim Adedi").toLocaleUpperCase()}
                                  </dt>
                                </Col>
                                <Col sm="6">
                                  <dd>{productionData?.quantity}</dd>
                                </Col>
                              </Row>
                            </dl>
                            <dl>
                              <Row>
                                <Col sm="6" className="text-end text-uppercase">
                                  <dt>
                                    {t("Açılış Tarihi").toLocaleUpperCase()}
                                  </dt>
                                </Col>
                                <Col sm="6">
                                  <dd>
                                    {productionData != null &&
                                    productionData != ""
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
                                  <dt>
                                    {t("Ürün Geçiş Süresi").toLocaleUpperCase()}
                                  </dt>
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
                                    <Save size={12} /> {t("kaydet")}
                                  </Button>
                                </Col>
                              </Row>
                            </dl>
                            <br></br>
                            <br></br>
                          </Card>
                        </Row>
                        <Row>
                          <Card style={{ height: "40vh"  }}>
                      
                          <h4 style={{ marginLeft: "20px" ,paddingTop: 5 }}>Aktiviteler</h4>
                     
                  <PerfectScrollbar
                    options={{ wheelPropagation: false, suppressScrollX: true }}

                    className="ScrollHeightAll"
                  >
                    <Col sm="12">
                      <ProductionLogs
                        style={{ all: "unset" }}
                        productionId={id != null ? Number(id) : null}
                      />
                    </Col>
                  </PerfectScrollbar>

                          </Card>
                        </Row>
                      </Col>

                      <Col sm={5} style={{ paddingTop: 5 }}>
                        <ActiveProject projectsArr={projectsArr} />
                      </Col>
                      <Col sm={4} style={{ paddingTop: 5 }}>
                        <Row>
                          <Card style={{ height: "40vh" }}>
                            Product
                            <ApexChart
                              colorDones="#7BC9FF"
                              colorRemains="#A3FFD6"
                              data1={65}
                              data2={35}
                              width={350}
                            />
                          </Card>
                        </Row>
                        <Row>
                          <Card style={{ height: "40vh" }}>
                            Material
                            <ApexChartSecond
                              colorDones="#864AF9"
                              colorRemains="#F8E559"
                              type="pie"
                              width={350}
                            />
                          </Card>
                        </Row>

                        {/* <BrowserState statesArr={statesArr} /> */}
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="3">
                    <Material materialData={materialData} />
                  </TabPane>
                  <TabPane tabId="4">
                    <Test productionId={id} />
                  </TabPane>
                  {tab === null ? (
                    <></>
                  ) : (
                    <TabPane tabId={tab.id} key={tab?.id}>
                      {
                        <DynamicComponent
                          key={tab?.id}
                          component={tab?.whichPage}
                          id={id}
                          match={{ params: { id: id, routeId: tab?.id } }}
                        />
                      }
                    </TabPane>
                  )}
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
