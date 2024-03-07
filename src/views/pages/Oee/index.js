import React, { useState, useEffect, useContext } from "react";
import {
  Row,
  Col,
  Button,
  UncontrolledTooltip,
  Breadcrumb,
  BreadcrumbItem,
  Label,
  Badge,
} from "reactstrap";

import Select from "react-select";
// ** Context
import { ThemeColors } from "@src/utility/context/ThemeColors";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { Maximize2, PlusSquare, Search, Trash2 } from "react-feather";
import "./Oee.css";
import { selectThemeColors } from "@utils";
import OeeInformation from "./oeeInformation";
import { useSkin } from "@hooks/useSkin";
import axios from "axios";

import Flatpickr from "react-flatpickr";
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { Turkish } from "flatpickr/dist/l10n/tr.js"
import OeeTable from "./OeeTable";
import moment from "moment";

function Oee(props) {
  const [charHeight, SetCharHeight] = React.useState(window.innerHeight / 3.2);
  const { skin, setSkin } = useSkin();
  const context = useContext(ThemeColors);
  const handle = useFullScreenHandle();
  const [searchValue, setSearchValue] = useState("");
  const [startPicker, setStartPicker] = useState([new Date(), new Date()])
  const [data, setData] = React.useState([]);
  const [lineData, setLineData] = useState([{ id: null, name: "Hat Yok" }]);
  const [lineDetail, setLineDetail] = useState({ value: null, label: "Tüm Hat" });
  const [personnelData, setPersonnelData] = useState([{ id: null, name: " Personel Yok" }]);
  const [personnelDetail, setPersonnelDetail] = useState({ value: null, label: "Tüm Personel" });
  const [shiftData, setShiftData] = useState([{ id: null, name: "Vardiya Yok" }]);
  const [shiftDetail, setShiftDetail] = useState({ value: null, label: " Tüm Vardiya" });
  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_ENDPOINT + "api/ShiftDefinition/GetAll")
      .then((response) => {
        response.data.data.unshift({ value: null, name: "Tüm Vardiyalar" })
        setShiftData(response.data.data);

      });
    axios
      .get(process.env.REACT_APP_API_ENDPOINT + "api/Account/GetAllAsync")
      .then((res) => {
        if (res.data.data.length > 0) {
          res.data.data.unshift({ value: null, name: "Tüm Personeller", surName: "" })
          setPersonnelData(res.data.data);
        }
      });
    axios
      .get(process.env.REACT_APP_API_ENDPOINT + "api/Line/GetAllFilter")
      .then((response) => {
        if (response.data.data.length > 0) {
          response.data.data.unshift({ value: null, name: "Tüm Hat" })
          setLineData(response.data.data);

        }
      });
    allData();

  }, []);

  const allData = () => {
    axios
      .get(process.env.REACT_APP_API_ENDPOINT + "api/Oee/GetOeeListORM")
      .then((response) => {
        if (response.data.data) {
          setData(response.data.data);
        }
      });
  };

  const clearFilter = () => {

    setLineDetail({ value: null, label: "Tüm Hat" });
    setPersonnelDetail({ value: null, label: "Tüm Personel" });
    setShiftDetail({ value: null, label: " Tüm Vardiya" });
    setStartPicker([new Date(), new Date()]);
    allData();
  }
  const filterData = () => {


    let filter = {
      lineId: lineDetail.value,
      userId: personnelDetail.value,
      shiftDefinitionId: shiftDetail.value,
      createDate: startPicker[0].toDateString(),
      editDate: startPicker[1].toDateString()
    }

    axios
      .post(process.env.REACT_APP_API_ENDPOINT + "api/Oee/GetOeeListORMFilter", filter)
      .then((response) => {
        if (response.data.data) {
          setData(response.data.data);
        }
      });
  };
  return (
    <FullScreen
      handle={handle}
      className={skin == "dark" ? "dark-theme" : "light-theme"}
      onChange={() => handle.active ? SetCharHeight(window.innerHeight / 2.5) : SetCharHeight(window.innerHeight / 3.2)}
    >
      <div className="content-header row" style={{ margin: 10 }}>
        <div className="content-header-left col-md-9 col-12 mb-2">
          <div className="row breadcrumbs-top">
            <div className="col-12">
              <h2 className="content-header-title float-start mb-0">
                {"OEE Hesaplama"}
              </h2>
              <div className="breadcrumb-wrapper vs-breadcrumbs d-sm-block d-none col-12">
                <Breadcrumb className="ms-1">
                  <BreadcrumbItem>
                    <span>OEE Hesaplama </span>
                  </BreadcrumbItem>
                </Breadcrumb>
              </div>
            </div>
          </div>
        </div>

        {handle.active ? null : (
          <div className="content-header-right text-md-end col-md-3 col-6 d-md-block d-none">
            <div className="breadcrumb-right">
              <Button.Ripple
                className="btn-icon"
                color="primary"
                id="newProductionOrder"
                onClick={handle.enter}
              >
                <Maximize2 size={20} />
              </Button.Ripple>
              <UncontrolledTooltip placement="left" target="newProductionOrder">
                Tam Ekran
              </UncontrolledTooltip>
            </div>
          </div>
        )}


        <Row>
          <Col>          <div className="mb-1">
            <Label className="form-label" >
              Hat
            </Label>
            <Select
              isClearable={false}
              className="react-select"
              classNamePrefix="select"
              options={lineData.map((option) => ({
                value: option.id,
                label: option.name,
              }))}
              theme={selectThemeColors}
              defaultValue={lineDetail}
              value={lineDetail}
              onChange={(event) => {
                setLineDetail({ value: event.value, label: event.label });
                // changeDashboard(event.value);
              }}
            />
          </div></Col>
          <Col>   <div className="mb-1">
            <Label className="form-label" >
              Vardiya
            </Label>
            <Select
              isClearable={false}
              className="react-select"
              classNamePrefix="select"
              options={shiftData.map((option) => ({
                value: option.id,
                label: option.name,
              }))}
              theme={selectThemeColors}
              defaultValue={shiftDetail}
              value={shiftDetail}
              onChange={(event) => {
                setShiftDetail({ value: event.value, label: event.label });
                // changeDashboard(event.value);
              }}
            />
          </div></Col>


        </Row>

        <Row>
          <Col sm={3}></Col>
          <Col sm={3}>   <div className="mb-1">
            <Label className="form-label" >
              Tarih
            </Label>
            <Flatpickr
              style={{ textAlign: "center" }}
              value={startPicker}

              className='form-control'
              onChange={date => {
                setStartPicker(date)
              }}
              options={{


                mode: "range",
                dateFormat: "d-m-Y",

                formatDate: function (dateObj, formatString) {


                  return moment(dateObj).format("DD.MM.YYYY");
                },
                locale: "tr",
                position: "auto center",

              }}
            />
          </div></Col>
          <Col sm={3}>   <div className="mb-1">
            <Label className="form-label" >
              Personel
            </Label>
            <Select
              isClearable={false}
              className="react-select"
              classNamePrefix="select"
              options={personnelData.map((option) => ({
                value: option.id,
                label: option.name + " " + option.surName,
              }))}
              theme={selectThemeColors}
              defaultValue={personnelDetail}
              value={personnelDetail}
              onChange={(event) => {
                setPersonnelDetail({ value: event.value, label: event.label });
                // changeDashboard(event.value);
              }}
            />
          </div></Col>
          <Col sm={1}>
            <div className="mb-1" style={{ marginTop: 15 }}>

              <Button.Ripple
                className="btn-icon"
                color="primary"
                id="searchFilter"
                onClick={() => filterData()}
              >
                <Search size={18} />
              </Button.Ripple>
              <UncontrolledTooltip placement="left" target="searchFilter">
                Filtrele
              </UncontrolledTooltip>

              <Button.Ripple
                className="btn-icon"
                color="danger"
                id="filterClear"
                style={{ margin: 10 }}
                onClick={() => clearFilter()}
              >
                <Trash2 size={18} />
              </Button.Ripple>
              <UncontrolledTooltip placement="left" target="filterClear">
                Temizle
              </UncontrolledTooltip>
            </div>
          </Col>
          <Col sm={2}></Col>
        </Row>


      </div>

      <div className="react-dataTable" style={{ zoom: "85%" }}>
        <OeeTable data={data} />
      </div>
      {/* <Row style={{ padding: -10 }}>
        <Col xxl={12}>
          <OeeInformation
            data={datas}
          />
        </Col>
      </Row> */}

      {/* 
      
      <Row style={{ margin: 10 }}>
        <Col xxl={4}>
          <GeneralInformation
            primary={context.colors.primary.main}
            danger={context.colors.danger.main}
            data={datas}
            height={charHeight}
          />
        </Col>

        <Col xxl={4} className="match-height">
          <LineInformation dataName={name} dataElapsadTime={elapsadTime} height={charHeight} />
        </Col>
        <Col xxl={4} className="match-height">
          <WorkOrderInformation
            primary={context.colors.primary.main}
            danger={context.colors.danger.main}
            data={datas}
            height={charHeight}
          />
        </Col>
      </Row>
      <Row style={{ margin: 10 }}>

        <Col xxl={6}>
          <ProductionHourCount
            primary={context.colors.primary.main}
            danger={context.colors.danger.main}
            data={datas}
            height={charHeight}
          />
        </Col>

        <Col xxl={6} className="match-height">
          <WorkOrderInformation3

            primary={context.colors.primary.main}
            danger={context.colors.danger.main}
            data={datas}
            height={charHeight}
          />
        </Col>
      </Row> */}

    </FullScreen>
  );
}

export default Oee;
