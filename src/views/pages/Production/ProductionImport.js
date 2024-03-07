// ** React Imports
import { Fragment, useState, useEffect } from "react";

// ** Third Party Components
import XLSX from "xlsx";
import Select from "react-select";
import { useDropzone } from "react-dropzone";
import {
  X,
  DownloadCloud,
  Save,
} from "react-feather";
import axios from "axios";
import { Check } from "react-feather";
import { toast } from "react-toastify";
// ** Custom Components
import Avatar from "@components/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Input,
  Label,
  UncontrolledTooltip,
} from "reactstrap";
import { Link, useHistory } from "react-router-dom";
// ** Styles
import "@styles/react/libs/file-uploader/file-uploader.scss";
import { workingActive, workingPassive } from "../../../redux/refreshData";
import { UseSelector, useDispatch } from "react-redux";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  CardBody,
  Table,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";

// ** Styles
import "@styles/react/libs/file-uploader/file-uploader.scss";


const ToastSuccess = () => (
  <Fragment>
    <div color="success" className="toastify-header pb-0">
      <div className="title-wrapper">
        <Avatar size="sm" color="success" icon={<Check />} />
        <h6 className="toast-title">Üretim İş Emri Oluşturuldu !</h6>
      </div>
    </div>
  </Fragment>
);

const ErrorToast = () => (
  <Fragment>
    <div className="toastify-header">
      <div className="title-wrapper">
        <Avatar size="sm" color="danger" icon={<X size={12} />} />
        <h6 className="toast-title">Hata!</h6>
      </div>
    </div>
    <div className="toastify-body">
      <span role="img" aria-label="toast-text">
        Seçilen Dosya Formatı Geçersiz
      </span>
    </div>
  </Fragment>
);
const ProductionImport = () => {
  const newWorking = useDispatch();
  // ** States
  const [value, setValue] = useState("");
  const [dataProductionInfo, setdataProductionInfo] = useState([]);
  const [dataBomKitInfo, setdataBomKitInfo] = useState([]);
  const [dataRouteInfo, setdataRouteInfo] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showDate, setShowDate] = useState([]);

  const [userId, setUserId] = useState({
    value: -1,
    label: "Kullanıcı Mevcut Değil",
  });
  const [userList, setUserList] = useState([
    { id: -1, name: "Kullanıcı Mevcut Değil" },
  ]);
  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_ENDPOINT + "api/Account/GetAllAsync")
      .then((res) => {

        if (res.data.data.length > 0) {
          setUserList(res.data.data);
          setUserId({
            value: res.data.data[0].id,
            label: res.data.data[0].name + ' ' + res.data.data[0].surName,
          });
        }
      });
  }, []);

  // ** State
  const [active, setActive] = useState("1");
  const [showSaveBtn, setSaveBtn] = useState(false);

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (result) => {
      const reader = new FileReader();
      reader.onload = function () {
        const fileData = reader.result;
        const wb = XLSX.read(fileData, { type: "binary" });
        let i = 0;
        wb.SheetNames.forEach(function (sheetName) {
          if (i == 0) {
            const rowObj = XLSX.utils.sheet_to_row_object_array(
              wb.Sheets[sheetName],
              { defval: "" }
            );
            rowObj[0]["ACILIS_TARIHI"] = wb.Sheets["ÜRETİM BİLGİSİ"]?.D3?.w;
            setShowDate(
              new Date(wb?.Sheets["ÜRETİM BİLGİSİ"]?.D3.w)?.toLocaleDateString()
            );
            setdataProductionInfo(rowObj);
          } else if (i == 1) {
            const rowObj = XLSX.utils.sheet_to_row_object_array(
              wb.Sheets[sheetName],
              { defval: "" }
            );

            setdataBomKitInfo(rowObj);
          } else if (i == 2) {
            const rowObj = XLSX.utils.sheet_to_row_object_array(
              wb.Sheets[sheetName],
              { defval: "" }
            );
            setdataRouteInfo(rowObj);
          }
          i++;
        });
      };
      if (result.length && result[0].name.endsWith("xlsx")) {
        reader.readAsBinaryString(result[0]);
      } else {
        toast.error(<ErrorToast />, { icon: false, hideProgressBar: true });
      }
    },
  });

  const handleFilter = (e) => {
    const data = tableData;
    let filteredData = [];
    const value = e.target.value;
    setValue(value);

    if (value.length) {
      filteredData = data.filter((col) => {
        const keys = Object.keys(col);
        const startsWithCondition = keys.filter((key) => {
          return col[key]
            .toString()
            .toLowerCase()
            .startsWith(value.toLowerCase());
        });
        const includesCondition = keys.filter((key) =>
          col[key].toString().toLowerCase().includes(value.toLowerCase())
        );

        if (startsWithCondition.length) return col[startsWithCondition];
        else if (!startsWithCondition && includesCondition.length)
          return col[includesCondition];
        else return null;
      });
      setFilteredData(filteredData);
      setValue(value);
    } else {
      return null;
    }
  };
  /*eslint-disable */
  const headArrPI = dataProductionInfo.length
    ? dataProductionInfo.map((col, index) => {
      if (index === 0) return [...Object.keys(col)];
      else return null;
    })
    : [];
  /*eslint-enable */
  const dataArrPI = value.length
    ? filteredData
    : dataProductionInfo.length && !value.length
      ? dataProductionInfo
      : null;

  const renderTableBodyPI = () => {
    if (dataArrPI !== null && dataArrPI.length) {
      return dataArrPI.map((col, index) => {
        const keys = Object.keys(col);
        const renderTd = keys.map((key, index) => (
          <td key={index}>{col[key]}</td>
        ));
        return <tr key={index}>{renderTd}</tr>;
      });
    } else {
      return null;
    }
  };

  const renderTableHeadPI = () => {
    if (headArrPI.length) {
      return headArrPI[0].map((head, index) => {
        return <th key={index}>{head}</th>;
      });
    } else {
      return null;
    }
  };

  /*bom ve kit*/

  /*eslint-disable */
  const headArrBK = dataBomKitInfo.length
    ? dataBomKitInfo.map((col, index) => {
      if (index === 0) return [...Object.keys(col)];
      else return null;
    })
    : [];
  /*eslint-enable */
  const dataArrBK = value.length
    ? filteredData
    : dataBomKitInfo.length && !value.length
      ? dataBomKitInfo
      : null;

  const renderTableBodyBK = () => {
    if (dataArrBK !== null && dataArrBK.length) {
      return dataArrBK.map((col, index) => {
        const keys = Object.keys(col);
        const renderTd = keys.map((key, index) => (
          <td key={index}>{col[key]}</td>
        ));
        return <tr key={index}>{renderTd}</tr>;
      });
    } else {
      return null;
    }
  };

  const renderTableHeadBK = () => {
    if (headArrBK.length) {
      return headArrBK[0].map((head, index) => {
        return <th key={index}>{head}</th>;
      });
    } else {
      return null;
    }
  };

  /* bom ve kit sonu  */

  /*bom ve kit*/

  /*eslint-disable */
  const headArrRI = dataRouteInfo.length
    ? dataRouteInfo.map((col, index) => {
      if (index === 0) return [...Object.keys(col)];
      else return null;
    })
    : [];
  /*eslint-enable */
  const dataArrRI = value.length
    ? filteredData
    : dataRouteInfo.length && !value.length
      ? dataRouteInfo
      : null;

  const renderTableBodyRI = () => {
    if (dataArrRI !== null && dataArrRI.length) {
      return dataArrRI.map((col, index) => {
        const keys = Object.keys(col);
        const renderTd = keys.map((key, index) => (
          <td key={index}>{col[key]}</td>
        ));
        return <tr key={index}>{renderTd}</tr>;
      });
    } else {
      return null;
    }
  };
  const history = useHistory();

  const openDetail = (id) => {
    setSelectionModal(false);
    let path = "/production/" + id;
    history.push(path);
  };

  const renderTableHeadRI = () => {
    if (headArrRI.length) {
      return headArrRI[0].map((head, index) => {
        return <th key={index}>{head}</th>;
      });
    } else {
      return null;
    }
  };

  const productionSendToOurOrder = () => {
    let data = {
      production: {
        userId: userId.value,
        orderNo: dataProductionInfo[0]["URETIM_EMRI_NO"],
        quantity: dataProductionInfo[0]["URETIM_ADEDI"],
        startDate: dataProductionInfo[0]["ACILIS_TARIHI"],
        aciklama: dataProductionInfo[0]["ACIKLAMA"],
        uretimAdi: dataProductionInfo[0]["URETIM_ADI"],
      },
      bomkit: dataArrBK,
      route: dataArrRI,
    };

    axios
      .post(
        process.env.REACT_APP_API_ENDPOINT +
        "api/ProductionImport/ImportProduction",
        data
      )
      .then(function (response) {
        newWorking(workingActive())
        if (response.data.success) {
          toast.success(<ToastSuccess />, {
            icon: false,
            autoClose: 3000,
            hideProgressBar: true,
            closeButton: false,
          });

          history.push("/production/" + response.data.data)
        }

      })
      .catch(function (error) {
        console.log(error);
      });
    setSaveBtn(true);
  };

  /* bom ve kit sonu  */
  return (
    <div>
      <div className="content-header row">
        <div className="content-header-left col-md-9 col-12 mb-2">
          <div className="row breadcrumbs-top">
            <div className="col-12">
              <h2 className="content-header-title float-start mb-0">
                {"Excel Aktar"}
              </h2>
              <div className="breadcrumb-wrapper vs-breadcrumbs d-sm-block d-none col-12">
                <Breadcrumb className="ms-1">
                  <BreadcrumbItem>
                    <Link to="/"> Dashboard </Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <Link to="/Production"> Üretim Listesi </Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <span> Excel Aktar </span>
                  </BreadcrumbItem>
                </Breadcrumb>
              </div>
            </div>
          </div>
        </div>

        <div className="content-header-right text-md-end col-md-3 col-12 d-md-block d-none">
          {dataProductionInfo[0]?.URETIM_ADEDI ? (<div className="breadcrumb-right">
            <Button.Ripple
              disabled={showSaveBtn}
              className="btn-icon"
              color="primary"
              id="newProductionOrder"
              onClick={productionSendToOurOrder}
            >
              <Save />
            </Button.Ripple>
            <UncontrolledTooltip placement="left" target="newProductionOrder">
              İş Emrini Kaydet
            </UncontrolledTooltip>
          </div>
          ) : null}
        </div>
      </div>

      <Card>
        <CardBody>
          <div {...getRootProps({ className: "dropzone mt-1 mb-2" })}>
            <input {...getInputProps()} />
            <div className="d-flex align-items-center justify-content-center flex-column">
              <DownloadCloud size={64} />
              <h5>Dosya sürükle ya da seçmek için tıkla</h5>
            </div>
          </div>

          {dataProductionInfo != null && dataProductionInfo.length > 0 ? (
            <Fragment>
              <Row>

                <Col
                  sm={{
                    offset: 4,
                    order: 2,
                    size: 4,
                  }}
                >

                  <Row>
                    <Col
                      span={6}


                    >
                      <Table responsive bordered >
                        <thead>
                          <tr>
                            <th width="100%" style={{ textAlign: "right" }}>
                              KULLANICI
                            </th>
                          </tr>
                          <tr>
                            <th width="100%" style={{ textAlign: "right" }}>
                              Üretim Emri
                            </th>
                          </tr>
                          <tr>
                            <th width="100%" style={{ textAlign: "right" }}>
                              Üretim Adedi
                            </th>
                          </tr>
                          <tr>
                            <th width="100%" style={{ textAlign: "right" }}>
                              AÇILIŞ Tarihi
                            </th>
                          </tr>
                        </thead>
                      </Table>
                    </Col>
                    <Col
                      span={6}
                      style={{marginLeft:-25}}
                    > <Select
                        isClearable={false}
                        className="react-select"
                        classNamePrefix="select"
                        options={userList.map((option) => ({
                          value: option.id,
                          label: option.name + ' ' + option.surName,
                        }))}
                        value={userId}
                        onChange={(event) =>
                          setUserId({
                            value: event.value,
                            label: event.label,
                          })
                        }
                        styles={{ width: "100%" }}
                      />
                      <Input disabled={true} placeholder={dataProductionInfo[0].URETIM_EMRI_NO} style={{ marginTop: 3 }} />
                      <Input disabled={true} placeholder={dataProductionInfo[0].URETIM_ADEDI} style={{ marginTop: 3 }} />
                      <Input disabled={true} placeholder={showDate} style={{ marginTop: 3 }} />

                    </Col>
                  </Row>
                </Col>
              </Row>
            </Fragment>
          ) : null}
          {dataProductionInfo != null && dataProductionInfo.length > 0 ? (
            <Row className={"mt-2"}>
              <Col>
                <Nav className="justify-content-center" tabs>
                  <NavItem>
                    <NavLink
                      active={active === "1"}
                      onClick={() => {
                        toggle("1");
                      }}
                    >
                      Bom ve Kit Bilgisi
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      active={active === "2"}
                      onClick={() => {
                        toggle("2");
                      }}
                    >
                      Rota Bilgisi
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent className="py-50" activeTab={active} style={{zoom:"85%"}}>
                  <TabPane tabId="1">
                    <Table className="table-hover-animation" responsive>
                      <thead>
                        <tr>{renderTableHeadBK()}</tr>
                      </thead>
                      <tbody>{renderTableBodyBK()}</tbody>
                    </Table>
                  </TabPane>
                  <TabPane tabId="2">
                    <Table className="table-hover-animation" responsive>
                      <thead>
                        <tr>{renderTableHeadRI()}</tr>
                      </thead>
                      <tbody>{renderTableBodyRI()}</tbody>
                    </Table>
                  </TabPane>
                </TabContent>
              </Col>
            </Row>
          ) : null}
        </CardBody>
      </Card>
    </div>
  );
};

export default ProductionImport;
