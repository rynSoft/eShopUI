import BarcodeReader from "react-barcode-reader";
import React, { useState, useEffect, Fragment } from "react";
import {
  Table,
  Row,
  Col,Button, Card
} from "reactstrap";
import axios from "axios";
import TimerCalculate from "../TimerCalculate/TimerCalculate.js";
import toastData from "../../../@core/components/toastData/index.js";
import ApexChart from "../ProductionProcess/ApexChart.js";

function MaterialVerification(props) {
  const [readerState, setReaderState] = React.useState(false);
  const [finishStateButton, setFinishStateButton] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [finishData, setFinishData] = React.useState(false);
  const [tableState, setTableState] = React.useState(false);
  const [id, setId] = useState(props.match.params.id);
  const [modalState, modalStateChange] = React.useState(false);
  const [materailDoneCount, setMaterailDoneCount] = useState(0);
  const [materailRemainCount, setMaterailRemainCount] = useState(0);
  const [materailQuantity, setMaterialQuantity] = useState(JSON.parse(localStorage.getItem("materialDataCount")));
  const [routeId, setRouteId] = useState(Number(props.match.params.routeId));
  const [tabInfo, setTabInfo] = useState(
    JSON.parse(localStorage.getItem("lastTab"))
  );
  const [nextRouteId, setNextRouteId] = useState(0);
  const [userName, setuserName] = useState(
    JSON.parse(localStorage.getItem("userData")).userNameSurname
  );

  const handleError = (error) => {
  };

  const readerStateFunction = (stateValue) => {
    setReaderState(stateValue);
  };

  useEffect(() => {
    getProductState();
  }, []);

  const getProductState = () => {
    axios
      .get(
        process.env.REACT_APP_API_ENDPOINT +
          "api/WorkProcessRoute/GetOrderNextId?productionId=" +
          id +
          "&workProcessRouteId=" +
          routeId +
          "&order=" +
          tabInfo.order
      )
      .then((response) => {
        setNextRouteId(response.data.data.id);
        loadData();
      });
  };

  const loadData = () => {
    axios
      .get(               
        process.env.REACT_APP_API_ENDPOINT + "api/MaterialHistories/GetAllMaterialHistories?productionId=" + id + "&workProcessRouteId=" + routeId )
      .then((response) => {
        
        let datass = response.data.data.filter(
          (obj) => obj.materailReadState != 0
        ); 
        setMaterailDoneCount(datass.length);
        setMaterailRemainCount(materailQuantity -  datass.length);

        setData(response.data.data);
      });
  };

  const tableStateChange = () => {
    setTableState(true);
  };


  const addData = (arg) => {
    axios
      .post(
        process.env.REACT_APP_API_ENDPOINT + "api/MaterialHistories/Add",
        arg
      )
      .then((res) => {
        if (res.data.success) {
          setData([...data]);

          let done = materailDoneCount + 1;
          setMaterailDoneCount(done);
          let rm = materailQuantity -  done;
          setMaterailRemainCount(rm);

          toastData("Kayıt Yapıldı !", true);
        } else {
          toastData("Kayıt Yapılamadı !", false);
        }
      })
      .catch((err) => toastData("Kayıt Yapılamadı !", false));
  };

  //#region rowUpdate 

  

  const updateState = (e) => {
    if (readerState) {
      let datas = data.find((obj) => obj.code === e && obj.materialUsableState === 0);
  
      if (datas != undefined){
       datas.materailReadState = 1;
  
      let addDatas = {
        materialId: datas.id,
        workProcessRouteId: routeId,
        nextProcessRouteId: nextRouteId,
        materailReadState : 1,
        productionId : id
      };
  
      addData(addDatas);
      setData([...data]);
      modalStateChange(false);
    }else
    {
      toastData("Hammadde Bulunamadı", false);
        }
      
    } else {
      toastData("Barkod Okutmadan İş Akışını Başlatınız!", false);
    }
  }


  return (
    <Fragment>
      <Row>
        <Col xl="12" md="12" xs="12" style={{ minHeight: 100 }}>
          <TimerCalculate
            finishController={finishData}
            tableController={tableStateChange}
            cols={{ xl: "12", sm: "12", xs: "12" }}
            workProcessRouteId={routeId}
            screenName={tabInfo.name}
            readerStateFunction={readerStateFunction}
          />
        </Col>
        <BarcodeReader
          onError={handleError}
          onScan={(err, result) => {
            updateState(err.replaceAll("*", "-"));
          }}
        />
      </Row>
      <Row>
        <div>
          <div className="content-header row">
            <div className="content-header-right text-md-end col-md-12 col-12 d-md-block d-none">
            </div>
          </div>
        </div>
        <Row>
          <Col xl="3" md="3" xs="32">
          <Card style={{ height: '100%', width: '100%' }}>
            {tableState ? (
              <Table responsive style={{ marginTop: 10 }} size="sm">
                <thead>
                  <tr>
                    <th>Grafik Gösterim</th>
                  </tr>
                </thead>
                <tbody style={{ marginTop: 10, color: "yellow", font: 30 }}>
                <div id="chart"  style={{ marginTop: 100 }}>
                <ApexChart colorDones="#F96167" colorRemains="#F9E795" data1={materailDoneCount} data2={materailRemainCount} width={380} />
              </div>
                </tbody>
              </Table>
            ) : null}
            </Card>
          </Col>
          <Col xl="9" md="9" xs="32">
          <Card style={{ height: '100%', width: '100%' }}>
            {tableState ? (
              <Table responsive style={{ marginTop: 10 }} size="md">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Hammadde Adı</th>
                    <th>Birim</th>
                    <th>Miktar</th>
                    <th>Düşüm Miktarı</th>
                    <th>Kullanıcı</th>
    
                    <th style={{ textAlign: "right" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {data?.length > 0 ? (
                 
                    <>
                      {data.map((obj) => (
                        obj.materailReadState == 0 ? (
                        <tr
                          style={{  backgroundColor: "transparent", color: "white" }}
                          key={`${obj.id}`}
                        >
                          <td style={{ color: "white" }}>{obj.code}</td>
                          <td style={{ color: "white" }}>{obj.name}</td>
                          <td style={{ color: "white" }}>{obj.unit}</td>
                          <td style={{ color: "white" }}>{obj.quantity}</td>
                          <td style={{ color: "white" }}>{obj.decreaseQuantity}</td>
                          <td style={{ color: "white" }}>{userName}</td>
                          <td style={{ textAlign: "right" }}>
                    </td>
                        </tr>
                        ) :
                        obj.materailReadState == 1 ? (
                          <tr
                          style={{  backgroundColor: "green", color: "white" }}
                          key={`${obj.id}`}
                        >
                          <td style={{ color: "white" }}>{obj.code}</td>
                          <td style={{ color: "white" }}>{obj.name}</td>
                          <td style={{ color: "white" }}>{obj.unit}</td>
                          <td style={{ color: "white" }}>{obj.quantity}</td>
                          <td style={{ color: "white" }}>{obj.decreaseQuantity}</td>
                          <td style={{ color: "white" }}>{userName}</td>
                          <td></td>
                          
                        </tr>
                          ) :
                          obj.materailReadState == 2 ? (
                            <tr
                            style={{  backgroundColor: "#FFEA00", color: "black" }}
                            key={`${obj.id}`}
                          >
                            <td style={{ color: "black" }}>{obj.code}</td>
                            <td style={{ color: "black" }}>{obj.name}</td>
                            <td style={{ color: "black" }}>{obj.unit}</td>
                            <td style={{ color: "black" }}>{obj.quantity}</td>
                            <td style={{ color: "black" }}>{obj.decreaseQuantity}</td>
                            <td style={{ color: "black" }}>{userName}</td>
                            <td></td>
                            
                          </tr>
                            ) :
                        
                          obj.materailReadState == 3 ? (
                            <tr
                            style={{  backgroundColor: "#11599d", color: "white" }}
                            key={`${obj.id}`}
                          >
                            <td style={{ color: "white" }}>{obj.code}</td>
                            <td style={{ color: "white" }}>{obj.name}</td>
                            <td style={{ color: "white" }}>{obj.unit}</td>
                            <td style={{ color: "white" }}>{obj.quantity}</td>
                            <td style={{ color: "white" }}>{obj.decreaseQuantity}</td>
                            <td style={{ color: "white" }}>{userName}</td>
                            <td></td>
                            
                          </tr>
                            ) : null
                      ))}
                    </>
                  ) : null}
                </tbody>
              </Table>
            ) : null}
              </Card>
          </Col>
        </Row>
      </Row>
    </Fragment>
  );
}

export default MaterialVerification;
