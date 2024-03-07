import React, { useState, useEffect, useContext } from "react";
import {
  Row,
  Col,
  Button,
  UncontrolledTooltip,
  Breadcrumb,
  BreadcrumbItem,
  Label,
} from "reactstrap";
import GeneralInformation from "./GeneralInformation";
import Select from "react-select";
import WorkOrderInformation from "./workOrderInformation";
import LineInformation from "./lineInformation";

import ProductionHourCount from "./productionHourCounts";
import WorkOrderInformation3 from "./workOrderInformation3";
// ** Context
import { ThemeColors } from "@src/utility/context/ThemeColors";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { Maximize2, PlusSquare } from "react-feather";
import "./Dashboard.css";
import { selectThemeColors } from "@utils";
import { useSkin } from "@hooks/useSkin";
import axios from "axios";

function Dashboard(props) {
  const [charHeight, SetCharHeight] = React.useState(window.innerHeight / 3.2);




  const { skin, setSkin } = useSkin();
  const context = useContext(ThemeColors);
  const handle = useFullScreenHandle();


  const [datas, setData] = React.useState([]);
  const [name, setName] = React.useState([]);
  const [elapsadTime, setElapsadTime] = React.useState([]);
  const [hour, setHour] = React.useState([]);
  const [hourCount, setHourCount] = React.useState([]);
  const [lineData, setLineData] = useState([{ id: 0, name: "Hat Yok" }]);
  const [lineDetail, setLineDetail] = useState({ value: 0, label: "Hat Yok" });
  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_ENDPOINT + "api/Line/GetAllFilter")
      .then((response) => {
        if (response.data.data.length > 0) {
          setLineData(response.data.data);
          setLineDetail({
            value: response.data.data[0].id,
            label: response.data.data[0].name,
          });
        }
        changeDashboard(response.data.data[0].id);
      });
  }, []);

  let changeDashboard = (e) => {
    axios
      .get(
        process.env.REACT_APP_API_ENDPOINT +
        "api/Dashboard/GetProduction_1?LineId=" +
        e
      )
      .then((response) => {
        
        
        if (response.data.data!== null){
      
        setData(response.data.data);
         

        let names = [];
        let elapsedTimes = [];
        if(response.data.data["restCauseElapsed"]){
          response.data.data["restCauseElapsed"].forEach(element => {
          debugger
            names.push(element["name"]);
            elapsedTimes.push(
              element["sumElapsedTime"]
            );
         });
        }


        setName(names);
        setElapsadTime(elapsedTimes);


        let hours = [];
        let hourCounts = [];

        if( response.data.data["getProductionHoursCount"]){
          response.data.data["getProductionHoursCount"].forEach(element => {
          
            hours.push(element["hour"]);
            hourCounts.push(
              element["productionCount"]
            );
         });
  
        }      



        setHour(hours);
        setHourCount(hourCounts);
      }
     
    }
      ).catch(res=>{
        setData([]);
        setName([]);
        setElapsadTime([]);
        setHour([]);
        setHourCount([]);
      });
  };

  return (
    <FullScreen
      handle={handle}
      className={skin == "dark" ? "dark-theme" : "light-theme"}
      onChange={()=>handle.active ? SetCharHeight(window.innerHeight / 2.5):SetCharHeight(window.innerHeight / 3.2)}
    >
      <div className="content-header row" style={{ margin: 10 }}>
        <div className="content-header-left col-md-9 col-12 mb-2">
          <div className="row breadcrumbs-top">
            <div className="col-12">
              <h2 className="content-header-title float-start mb-0">
                {"Dashboard"}
              </h2>
              <div className="breadcrumb-wrapper vs-breadcrumbs d-sm-block d-none col-12">
                <Breadcrumb className="ms-1">
                  <BreadcrumbItem>
                    <span>Dashboard </span>
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

        <div className="col-md-3 col-6 d-md-block d-none">
          <div className="mb-1">
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
                changeDashboard(event.value);
              }}
            />
          </div>
        </div>
      </div>
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
      </Row>
      {/* <Row style={{ margin: 10 }}>
        <Col xxl={4}>
        <ProductionHourCount dataHour={hour} dataHourCount={hourCount} />
        </Col>

        <Col xxl={4} className="match-height">
          <LineInformation dataName={name} dataElapsadTime={elapsadTime} />
        </Col>
        <Col xxl={4} className="match-height">
          <WorkOrderInformation
            primary={context.colors.primary.main}
            danger={context.colors.danger.main}
            data={datas}
          />
        </Col>
      </Row> */}
    </FullScreen>
  );
}

export default Dashboard;
