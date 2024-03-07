import BarcodeReader from "react-barcode-reader";
import React, { useState, useEffect, Fragment } from "react";
import { Table, Row, Col, ButtonGroup, Button, Nav, UncontrolledTooltip } from "reactstrap";
import axios from "axios";
import TimerCalculate from "../../TimerCalculate/TimerCalculate.js";
import { Check, CheckCircle, Printer, XOctagon, CheckSquare } from "react-feather";
import { Input } from 'antd';
import toastData from "../../../../@core/components/toastData/index.js";

function DisplayAssemblyDetail(props) {


  const [finishStateButton, setFinishStateButton] = React.useState(false);
  const [readerState, setReaderState] = React.useState(false);
  const [time, setTime] = useState(Date.now());
  const readerStateFunction = (stateValue) => {
    setReaderState(stateValue);
  };


  const [data, setData] = React.useState([]);
  const [dataLeft, setDataLeft] = React.useState([]);
  const [dataRight, setDataRight] = React.useState([]);
  const [finishData, setFinishData] = React.useState(false);
  const [lotNo, setLotNo] = React.useState('');
  const [disabledCount, setDisabledCount] = React.useState(false);

  const [barkodReadCount, setBarkodReadCount] = React.useState(0);
  const [displayCount, setDisplayCount] = React.useState(0);
  const [displayAmountCount, setDisplayAmountCount] = React.useState(0);
  const [totalDisplay, setTotalDisplay] = React.useState(0);

  const [tableState, setTableState] = React.useState(false);
  const [id, setId] = useState(props.match.params.id);
  const [previousProcess, setbackRoute] = useState(props.match.params.previousProcess);

  const handleExportPDF = (data) => {
    Date.prototype.today = function () {
      return (
        (this.getDate() < 10 ? "0" : "") +
        this.getDate() +
        "-" +
        (this.getMonth() + 1 < 10 ? "0" : "") +
        (this.getMonth() + 1) +
        "-" +
        this.getFullYear()
      );
    };

    // For the time now
    Date.prototype.timeNow = function () {
      return (
        (this.getHours() < 10 ? "0" : "") +
        this.getHours() +
        "." +
        (this.getMinutes() < 10 ? "0" : "") +
        this.getMinutes() +
        "." +
        (this.getSeconds() < 10 ? "0" : "") +
        this.getSeconds()
      );
    };
    data.map((element) => {
      docDefinition.content[1].table.body.push([
        {
          text: element.material,
          style:
            element.isKitProvided === 1 || element.isKitProvided === 2
              ? "KitSuccess"
              : "KitDanger",
        },
        {
          text: element.explanation,
          style:
            element.isKitProvided === 1 || element.isKitProvided === 2
              ? "KitSuccess"
              : "KitDanger",
        },
        {
          text: element.partyNumber,
          style:
            element.isKitProvided === 1 || element.isKitProvided === 2
              ? "KitSuccess"
              : "KitDanger",
        },
        {
          text: element.quantity,
          style:
            element.isKitProvided === 1 || element.isKitProvided === 2
              ? "KitSuccess"
              : "KitDanger",
        },
        {
          text:
            element.isKitProvided === 1 || element.isKitProvided === 2
              ? "TAMANLANDI"
              : "TAMAMLANMADI",
          style:
            element.isKitProvided === 1 || element.isKitProvided === 2
              ? "KitSuccess"
              : "KitDanger",
        },
      ]);
    });

    //Getting Current Date And Time
    var newDate = new Date();

    var datetime = newDate.today() + " " + newDate.timeNow();
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake
      .createPdf(docDefinition)
      .download(datetime + " - UrunHazırlamaRaporu.pdf");
  };

  const handleError = (error) => {
    console.log("Error " + error);
  };

  const tableStateChange = () => {
    setTableState(true);
  };



  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     loadData();
  //   }, 15000);

  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    loadData();
    var readDisplay = JSON.parse(localStorage.getItem("readDisplay"));
    if (readDisplay != null) {
      setLotNo(readDisplay.lotNo)
      setDisabledCount(true)
      setBarkodReadCount(readDisplay.barkodReadCount)
      setDisplayAmountCount(readDisplay.displayAmountCount)
      setDisplayCount(readDisplay.displayCount)
    }
  }, []);
  useEffect(() => {
    let totalDisplay = displayCount - (barkodReadCount * displayAmountCount)
    setTotalDisplay(totalDisplay)
    if (disabledCount && (totalDisplay == 0 || totalDisplay <= displayAmountCount)) {
      setDisabledCount(false);
      toastData("Lot Miktarını Kontrol Ediniz!!!", true)
    }
  }, [displayAmountCount, displayCount, barkodReadCount]);
 

  const loadData = () => {
    axios
      .get(
        process.env.REACT_APP_API_ENDPOINT +
        "api/ProductionProcessManual/GetAllAsyncProductionProcessManualId?id=" +
        id +
        "&process=" +
        8 +
        "&previousProcess=" + previousProcess
      )
      .then((response) => {
          setDataLeft(response.data.data.notRead.filter((x) => x.displayAssemblyBeginDate == null));
          setDataRight(response.data.data.read);

          response.data.data.read.filter((x) => x.displayAssemblyElapsedTime == null && x.displayAssemblyBeginDate != null).length > 0
            ? setFinishStateButton(true)
            : setFinishStateButton(false);
      });
  };
 
  // const loadData = () => {
  //   axios
  //     .get(
  //       process.env.REACT_APP_API_ENDPOINT +
  //       "api/ProductionProcessManual/GetAllAsyncProductionProcessManualId?id=" +
  //       id + "&process=" + 8 +
  //       "&previousProcess=" + previousProcess
  //     )
  //     .then((response) => {

  //       let resData = response.data.data;

  //       let resDataLeft = resData.filter((x) => x.displayAssemblyBeginDate == null);
  //       setDataLeft(resDataLeft);
  //       let resDataRight = resData.filter((x) => x.displayAssemblyBeginDate != null);
  //       setDataRight(resDataRight);

  //       resDataRight.filter((x) => x.displayAssemblyElapsedTime == null && x.displayAssemblyBeginDate != null).length > 0
  //         ? setFinishStateButton(true)
  //         : setFinishStateButton(false);
  //     });
  // };



  const updateDisplayData = (datas) => {
    axios
      .put(
        process.env.REACT_APP_API_ENDPOINT + "api/ProductionProcessManual/DisplayAssemblyUpdate", datas
      )
      .then((res) => {
        if (res.data.success) {
          localStorage.setItem("readDisplay", JSON.stringify({
            'lotNo': lotNo,
            'barkodReadCount': barkodReadCount + 1,
            'displayCount': displayCount,
            'displayAmountCount': displayAmountCount
          }))
          setBarkodReadCount(barkodReadCount + 1)
          loadData();
        } else {
          toastData("Kayıt Yapılamadı !", false);
        }
      }).catch(err => toastData("Kayıt Yapılamadı !", false));
  };


  const vardiyaTamamla = () => {
    if (!disabledCount) {
      toastData("Lot Bilgisini Kaydediniz!", false);
    }
    else {
      if (readerState) {
        let datas =
        {
          id: dataRight[0].id,
          productionId: props.match.params.id,
          qrCode: "Finish24061994",
          displayAssemblyBeginDate: new Date().toISOString(),
          displayAssemblyLotNo: lotNo.toString()
        };
        updateDisplayData(datas)
        //setFinishData(true);
      }
      else {
        toastData("İş Akışını Başlatınız", false)
      }
    }

  }


  const isTamamla = () => {
    if (!disabledCount) {
      toastData("Lot Bilgisini Kaydediniz!", false);
    }
    else {
      if (readerState) {
        let datas =
        {
          id: dataRight[0].id,
          productionId: props.match.params.id,
          qrCode: "Finish24061994",
          displayAssemblyBeginDate: new Date().toISOString(),
          displayAssemblyLotNo: lotNo.toString()
        };
        updateDisplayData(datas)
        setFinishData(true);
      }
      else {
        toastData("İş Akışını Başlatınız", false)
      }
    }

  }

  const lotKaydet = () => {
    if (lotNo.length != 0) {
      if (displayAmountCount <= displayCount) {
        localStorage.setItem("readDisplay", JSON.stringify({
          'lotNo': lotNo,
          'barkodReadCount': barkodReadCount,
          'displayCount': displayCount,
          'displayAmountCount': displayAmountCount
        }))
        setDisabledCount(true);
        toastData("Lot Bilgileri Kaydedildi", true)
      }
      else {
        toastData("Düşüm Miktarı,Display Miktarından Büyük Olamaz", false)
      }
    }
    else {
      toastData("Lot Numarası Boş", false)
    }
  }

  const updateState = (e) => {
    if (readerState) {
      axios
      .get(
        process.env.REACT_APP_API_ENDPOINT +
            "api/ProductionProcessManual/GetByQrCode?code=" +
            e.replace("ç", ".").replace("ç", ".").replace("ç", ".") +"&productionId="+props.match.params.id
            +"&process=8"+"&previousProcess=" + previousProcess
      )
      .then((response) => {
        if (response.data.data > 0)
         {
          let datas =
          {
            id: response.data.data,
            productionId: props.match.params.id,
            qrCode: e.replace("ç", ".").replace("ç", ".").replace("ç", "."),
            displayAssemblyBeginDate: new Date().toISOString(),
            displayAssemblyLotNo: lotNo.toString()
          };
          updateDisplayData(datas);
          setFinishStateButton(true);
          toastData(e.replace("ç", ".").replace("ç", ".").replace("ç", ".") + " kodlu panel okutulmuştur...!", true);
          loadData();
        } 
        else {
          toastData(e.replace("ç", ".").replace("ç", ".").replace("ç", ".") + " kodlu panel bulunamadı...!", false);
        }
      });

    } else {
      toastData("Barkod Okutmadan İş Akışını Başlatınız!", false);
    }
  };

  // const updateState = (e) => {
  //   if (readerState) {
  //     if (!disabledCount) {
  //       toastData("Lot Bilgisini Kaydediniz!", false);
  //     }
  //     else {
  //       let tempDatas = dataLeft.filter(
  //         (obj) => obj.qrCode === e.replace("ç", ".").replace("ç", ".").replace("ç", ".") && obj.displayAssemblyBeginDate == null
  //       );

  //       if (tempDatas.length > 0) {
  //         let datas =
  //         {
  //           id: tempDatas[0].id,
  //           productionId: props.match.params.id,
  //           qrCode: e.replace("ç", ".").replace("ç", ".").replace("ç", "."),
  //           displayAssemblyBeginDate: new Date().toISOString(),
  //           displayAssemblyLotNo: lotNo.toString()
  //         };
  //         updateDisplayData(datas);
  //         setFinishStateButton(true);
  //       } else {
  //         toastData("Barkod Bulunamadı!", false);
  //       }
  //     }
  //   } else {
  //     toastData("Barkod Okutmadan İş Akışını Başlatınız!", false);
  //   }
  // };

  return (
    <Fragment><Row>

      <Col xl="12" md="12" xs="12" style={{ minHeight: 100 }}>
        <TimerCalculate
          finishController={finishData}
          tableController={tableStateChange}
          cols={{ xl: "12", sm: "12", xs: "12" }}
          PproductionProcess={8}
          screenName="Display Montajı"
          readerStateFunction={readerStateFunction}
        />
      </Col>
      <BarcodeReader
        onError={handleError}
        onScan={(err, result) => {
          updateState(err.replace("*", "-").replace("*", "-"));
        }}
      />
    </Row>
      <Row style={{ color: "white", border: '2px solid 8464be' }}>
        <Col xl="2">Lot No <Input onChange={data => {
          setLotNo(data.target.value);
          setDisabledCount(false);
          setDisplayAmountCount(0);
          setDisplayCount(0);
          setBarkodReadCount(0);
        }} placeholder="lot no" value={lotNo} /></Col>

        <Col xl="1" >Display Miktarı<Input placeholder="display" disabled={disabledCount} type="number" onChange={data => { setDisplayCount(data.target.value) }} value={displayCount} /></Col>
        <Col xl="1" >Düşüm Miktarı <Input placeholder="düşüm" type="number" disabled={disabledCount} onChange={data => { setDisplayAmountCount(data.target.value) }} value={displayAmountCount} /></Col>
        <Col xl="1"> Kalan Miktar <Input placeholder="kalan" type="number" disabled={disabledCount} value={totalDisplay} /></Col>

        <Col xl="1">

          <Button.Ripple className='btn-icon' color='success' id='newProductionOrder' onClick={() => lotKaydet()}>
            <Check size={20} /> Lot Kaydet
          </Button.Ripple>
          <UncontrolledTooltip placement='left' target='newProductionOrder'>
            Lot Bilgisi Kaydet
          </UncontrolledTooltip>
        </Col>
        <Col xl="6">
          <div className='content-header-right text-md-end col-md-12 col-12 d-md-block d-none'>
            <div className="row">
              <div className="col-8 text-right"></div>
              {finishStateButton ? (
                <div className="col-2 text-right">
                  <Button.Ripple
                    className="btn-icon"
                    color="primary"
                    id="newProductionOrders"
                    onClick={() => vardiyaTamamla()}
                  >
                    <CheckCircle size={20} /> Vardiya Bitir
                  </Button.Ripple>
                  <UncontrolledTooltip
                    placement="left"
                    target="newProductionOrders"
                  >
                    Vardiya Bitir
                  </UncontrolledTooltip>
                </div>
              ) : null}
              <div className="col-2 text-right">
                <Button.Ripple
                  className="btn-icon"
                  color="warning"
                  id="newProductionOrder"
                  onClick={() => isTamamla()}
                >
                  <CheckSquare size={20} /> İş Emrini Bitir
                </Button.Ripple>
                <UncontrolledTooltip
                  placement="left"
                  target="newProductionOrder"
                >
                  Bitir
                </UncontrolledTooltip>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
      <Row>
      <Col xl="2" md="2" xs="32">
            {tableState ? (
              <Table responsive style={{ marginTop: 10 }} size="sm">
                <thead>
                  <tr>
                    <th>QrCode</th>
                  </tr>
                </thead>
                <tbody>
                  {dataLeft.length > 0 ? (
                    <>
                      {dataLeft.map((obj) => (
                        <tr
                          style={{ backgroundColor: "#3e92cc", color: "white" }}
                          key={`${obj.id}`}
                        >
                          <td style={{ color: "white" }}>{obj.qrCode}</td>
                        </tr>
                      ))}
                    </>
                  ) : null}
                </tbody>
              </Table>
            ) : null}
          </Col>
          <Col xl="10" md="10" xs="10">
        {tableState ? (
          <Table responsive style={{ marginTop: 10 }} size="sm">
            <thead>
              <tr>
                <th>QrCode</th>
                <th>Display Takım Baslangıç Tarihi</th>
                <th>Display Takım Bitiş Tarihi</th>
                <th>Geçen Süre</th>
                <th>Display Lot No</th>
                <th>Kullanıcı</th>
                <th style={{ textAlign: "right" }}>
                </th>
              </tr>
            </thead>
            <tbody >
              {dataRight.length > 0 ? (
                <>
                  {dataRight.map((obj) =>
                    <tr
                      style={{ backgroundColor: "#3e92cc", color: "white" }}
                      key={`${obj.id}`}
                    >
                      <td style={{ color: "white" }}>{obj.qrCode}</td>
                      <td style={{ color: "white" }}>{obj.displayAssemblyBeginDate ? new Date(obj.displayAssemblyBeginDate).toLocaleDateString() : null} {obj.displayAssemblyBeginDate ? new Date(obj.displayAssemblyBeginDate).toLocaleTimeString() : null}</td>
                      <td style={{ color: "white" }}>{obj.displayAssemblyEndDate ? new Date(obj.displayAssemblyEndDate).toLocaleDateString() : null} {obj.displayAssemblyEndDate ? new Date(obj.displayAssemblyEndDate).toLocaleTimeString() : null}</td>
                      <td style={{ color: "white" }}>{obj.displayAssemblyElapsedTime}</td>
                      <td style={{ color: "white" }}>{obj.displayAssemblyLotNo}</td>
                      <td style={{ color: "white" }}>{obj.fullName}</td>
                      <td></td>
                    </tr>
                  )}
                </>
              ) : null}
            </tbody>
          </Table>
        ) : null}
         </Col>
        </Row>
      </Row>
    </Fragment>
  );
}

export default DisplayAssemblyDetail;
