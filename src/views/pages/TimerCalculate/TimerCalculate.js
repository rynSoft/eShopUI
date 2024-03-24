import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  Fragment,
} from "react";
import "./timer.scss";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardText,
  Row,
  Col,
  Button,
  ModalHeader,
  ModalBody,
  Modal,
} from "reactstrap";
import {
  Play,
  StopCircle,
  User,
  Box,
  DollarSign,
  CheckCircle,
  PauseCircle,
  XOctagon,
  Check,
} from "react-feather";
import Avatar from "@components/avatar";
import classnames from "classnames";
import TimerCauseModal from "./TimerRestCause";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { useParams, Redirect } from "react-router-dom";
import toastData from "../../../@core/components/toastData";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { workingActive, workingPassive } from "../../../redux/refreshData";
let pauseButton = false;

const TimerCalculate = ({
  finishController,
  tableController,
  cols,
  workProcessRouteId,
  screenName,
  readerStateFunction,
}) => {
  const newWorkingData = useDispatch();
  const [isStartBtnDisabled, setStartnBtnDisabled] = useState(false);
  const [isResumeBtnDisabled, setIsResumeBtnDisabled] = useState(true);
  const [isStopBtnDisabled, setIsStopBtnDisabled] = useState(true);
  const [isPauseBtnDisabled, setIsPauseBtnDisabled] = useState(true);
  const [elapsedDay, setElapsedDay] = useState(0);
  const [downTime, setDownTime] = useState(0);
  const [shiftTargetParametersId, setShiftTargetParametersId] = useState(null);

  const provisionId = useParams();

  const userData = JSON.parse(localStorage.getItem("userData"));
  const [restCauseModal, setRestCauseModal] = useState(false);
  const [stopModal, setStopModal] = useState(false);

  useEffect( async ()  => {
    await axios
      .get(
        process.env.REACT_APP_API_ENDPOINT +
          "api/Production/GetOperationState?id=" +
          provisionId.id +
          "&routeId=" +
          workProcessRouteId
      )
      .then((response) => {
        if (finishController && !response.data.stopState) {
          setStartnBtnDisabled(true);
          setIsPauseBtnDisabled(true);
          setIsResumeBtnDisabled(true);
          setIsStopBtnDisabled(false);
          setIsStopTimer(true);
          setIsStartTimer(false);
        } else {
          if (response.data.stopState) {
            tableController();
            setStartnBtnDisabled(true);
            setIsResumeBtnDisabled(true);
            setIsPauseBtnDisabled(true);
            setIsStopBtnDisabled(true);
          } else {
            if (response.data.beginState) {
              setStartnBtnDisabled(true);
              tableController();
              setIsResumeBtnDisabled(false);
            } else {
              setStartnBtnDisabled(false);
              setIsResumeBtnDisabled(true);
              setIsPauseBtnDisabled(true);
              setIsStopBtnDisabled(true);
            }
          }
          pauseButton = false;

          var elapsetTime = response.data.elapsedTime.split(":");
          var elapsetHour = parseInt(elapsetTime[0]) * 3600;
          var elapsetMinute = parseInt(elapsetTime[1]) * 60;
          streamDuration.current =
            elapsetHour + elapsetMinute + parseInt(elapsetTime[2]);
          setRenderedStreamDuration(response.data.elapsedTime);
          setElapsedDay(response.data.elapsedDay);
          setDownTime(response.data.downTime);
        }
      });
  }, []);


  
  // useEffect(() => {
  //   axios
  //     .get(
  //       process.env.REACT_APP_API_ENDPOINT +
  //         "api/Production/GetOperationState?id=" +
  //         provisionId.id +
  //         "&routeId=" +
  //         workProcessRouteId
  //     )
  //     .then((response) => {
  //       var elapsetTime = response.data.elapsedTime.split(":");
  //       var elapsetHour = parseInt(elapsetTime[0]) * 3600;
  //       var elapsetMinute = parseInt(elapsetTime[1]) * 60;
  //       streamDuration.current =
  //         elapsetHour + elapsetMinute + parseInt(elapsetTime[2]);
  //       setDownTime(response.data.downTime);
  //       setRenderedStreamDuration(response.data.elapsedTime);
  //     });
  // }, []);

  const handleTabClosing = () => {
    if (pauseButton) {
      const addParameters = {
        productionId: parseInt(provisionId.id),
        restCauseId: 1,
        productionTimeStatus: 2,
        message: "Otomatik Durdur",
        userId: userData.id,
        workProcessRouteId:workProcessRouteId,  
        shiftTargetParametersId: shiftTargetParametersId,
      };

      axios
        .post(
          process.env.REACT_APP_API_ENDPOINT +
            "api/WorkProcessRouteTimeHistories/Pause",
          addParameters
        )
        .then((res) => {});
    }
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleTabClosing);
    return () => {
      window.removeEventListener("beforeunload", handleTabClosing);
    };
  });

  // useEffect(() => {
  //   if (PproductionProcess == 5) {
  //     axios
  //       .get(
  //         process.env.REACT_APP_API_ENDPOINT +
  //           "api/ShiftTargetParameters/GetToday?userId=" +
  //           userData.id
  //       )
  //       .then((res) => {
  //         if (res.data.data) {
  //           setShiftTargetParametersId(res.data.data.id);
  //         }
  //       });
  //   } //5 üretim ise   o anki kullanıcının parametre vardiyalarını kontrol eder
  // }, [PproductionProcess]);
  const modalClose = (successController) => {
    if (successController) {
      setIsStartTimer(false);
      pauseButton = false;
      setIsPauseBtnDisabled(true);
      setIsResumeBtnDisabled(false);
      readerStateFunction(false);
      cancelAnimationFrame(requestAnimationFrameId.current);
    }
    setRestCauseModal(false);
  };

  const pauseHandler = () => {
    setRestCauseModal(true);
  };
  const resumeProcess = () => {
    // if (PproductionProcess == 5 && shiftTargetParametersId == null) {
    //   toastData("Vardiya Parametrelerini Giriniz !", false);
    //   return;
    // }
    const parameters = {
      productionId: provisionId.id,
      productionTimeStatus: 3,
      shiftTargetParametersId: shiftTargetParametersId,
      workProcessRouteId:workProcessRouteId,  
    };
    axios
      .post(
        process.env.REACT_APP_API_ENDPOINT +
          "api/WorkProcessRouteTimeHistories/Resume",
        parameters
      )
      .then((res) => {
        if (res.data.success) {
          toastData("Mola Sonlandırıldı", true, "#5ab865");
          readerStateFunction(true);
          tableController();
          pauseButton = true;
          setIsPauseBtnDisabled(false);
          setIsResumeBtnDisabled(true);
          startTimer();
        } else {
          toastData("Mola Sonlandırılamadı !", false, "#5ab865");
        }
      });
  };

  const stopProcess = () => {
    const parameters = {
      productionId: provisionId.id,
      productionTimeStatus: 4,
      message: screenName + " Süreci Tamamlandı",
      workProcessRouteId:workProcessRouteId,  
      shiftTargetParametersId: shiftTargetParametersId,
    };
    axios
      .post(
        process.env.REACT_APP_API_ENDPOINT +
          "api/WorkProcessRouteTimeHistories/Stop",
        parameters
      )
      .then((res) => {
        if (res.data.success) {
          newWorkingData(workingActive());
          toastData("İşlem Sonlandırıldı", true, "#5ab865");
          setIsStopBtnDisabled(true);
          readerStateFunction(false);
          setIsStopTimer(true);
          pauseButton = false;
          setIsStartTimer(false);
        } else {
          toastData("Kullanıcı Atamaları Eksik!", false, "#5ab865");
        }
        setStopModal(false);
      });
  };

  const startProcess = () => {
    // if (PproductionProcess == 5 && shiftTargetParametersId == null) {
    //   toastData("Vardiya Parametrelerini Giriniz !", false);
    //   return;
    // }
    const parameters = {
      productionId: provisionId.id,
      productionTimeStatus: 1,
      userId: userData.id,
      message: screenName + " Süreci Başlandı",
      workProcessRouteId:workProcessRouteId,  
      shiftTargetParametersId: shiftTargetParametersId,
    };
    axios
      .post(
        process.env.REACT_APP_API_ENDPOINT +
          "api/WorkProcessRouteTimeHistories/Start",
        parameters
      )
      .then((res) => {
        if (res.data.success) {
          tableController();
          toastData("İşlem Başlatıldı", true, "#5ab865");
          readerStateFunction(true);
          setIsStartTimer(true);
          setIsStopTimer(false);
          pauseButton = true;
          setIsPauseBtnDisabled(false);
          setStartnBtnDisabled(true);
        } else {
          toastData("İşlem Başlatılamadı !", false, "#5ab865");
        }
      });
  };

  const [renderedStreamDuration, setRenderedStreamDuration] =
      useState("00:00:00"),
    streamDuration = useRef(0),
    previousTime = useRef(0),
    requestAnimationFrameId = useRef(null),
    [isStartTimer, setIsStartTimer] = useState(false),
    [isStopTimer, setIsStopTimer] = useState(false);

  const updateTimer = useCallback(() => {
    let now = performance.now();

    let dt = now - previousTime.current;

    if (dt >= 1000) {
      streamDuration.current = streamDuration.current + Math.round(dt / 1000);
      const formattedStreamDuration = new Date(streamDuration.current * 1000)
        .toISOString()
        .substr(11, 8);

      setRenderedStreamDuration(formattedStreamDuration);
      previousTime.current = now;
    }
    requestAnimationFrameId.current = requestAnimationFrame(updateTimer);
  }, []);

  const startTimer = useCallback(() => {
    previousTime.current = performance.now();

    requestAnimationFrameId.current = requestAnimationFrame(updateTimer);
  }, [updateTimer]);

  useEffect(() => {
    if (isStartTimer && !isStopTimer) {
      startTimer();
    }
    if (isStopTimer && !isStartTimer) {
      cancelAnimationFrame(requestAnimationFrameId.current);
    }
  }, [isStartTimer, isStopTimer, startTimer]);

 

  const [restCauseData, setRestCauseData] = useState([]);
  useEffect(() => {
    // axios
    //   .get(process.env.REACT_APP_API_ENDPOINT + "api/RestCause/GetAll")
    //   .then((res) => {
    //     if (res.data.data.length > 0) {
    //       setRestCauseData(res.data.data);
    //     }
    //   });
    return () => {
      handleTabClosing();
    };
  }, []);


  const dataStart = [
    {
      title: "Başla",
      color: "light-success",
      icon: <Play size={20} />,
    },
  ];
  const dataResume = [
    {
      title: "Devam Et",
      color: "light-warning",
      icon: <Play size={20} />,
    },
  ];
  const dataPause = [
    {
      title: "Durdur",
      color: "light-danger",
      icon: <PauseCircle size={20} />,
    },
  ];
  const dataStop = [
    {
      title: "Bitir",
      color: "light-info",
      icon: <CheckCircle size={20} />,
    },
  ];

  const renderDataStart = () => {
    return dataStart.map((item, index) => {
      const colMargin = Object.keys(cols);
      const margin = index === 2 ? "sm" : colMargin[0];
      return (
        <Col
          key={index}
          {...cols}
          className={classnames({
            [`mb-2 mb-${margin}-0`]: index !== dataStart.length - 1,
          })}
        >
          <div className="d-flex align-items-center">
            <Avatar color={item.color} icon={item.icon} className="me-2" />
            <div className="my-auto">
              <h5 className="fw-bolder mb-0 buttonTimer">{item.title}</h5>
            </div>
          </div>
        </Col>
      );
    });
  };

  const renderDataResume = () => {
    return dataResume.map((item, index) => {
      const colMargin = Object.keys(cols);
      const margin = index === 2 ? "sm" : colMargin[0];
      return (
        <Col
          key={index}
          {...cols}
          className={classnames({
            [`mb-2 mb-${margin}-0`]: index !== dataResume.length - 1,
          })}
        >
          <div className="d-flex align-items-center">
            <Avatar color={item.color} icon={item.icon} className="me-2" />
            <div className="my-auto">
              <h5 className="fw-bolder mb-0 buttonTimer">{item.title}</h5>
            </div>
          </div>
        </Col>
      );
    });
  };

  const renderDataPause = () => {
    return dataPause.map((item, index) => {
      const colMargin = Object.keys(cols);
      const margin = index === 2 ? "sm" : colMargin[0];
      return (
        <Col
          key={index}
          {...cols}
          className={classnames({
            [`mb-2 mb-${margin}-0`]: index !== dataPause.length - 1,
          })}
        >
          <div className="d-flex align-items-center">
            <Avatar color={item.color} icon={item.icon} className="me-2" />
            <div className="my-auto">
              <h5 className="fw-bolder mb-0 buttonTimer">{item.title}</h5>
            </div>
          </div>
        </Col>
      );
    });
  };

  const renderDataStop = () => {
    return dataStop.map((item, index) => {
      const colMargin = Object.keys(cols);
      const margin = index === 2 ? "sm" : colMargin[0];
      return (
        <Col
          key={index}
          {...cols}
          className={classnames({
            [`mb-2 mb-${margin}-0`]: index !== dataStop.length - 1,
          })}
        >
          <div className="d-flex align-items-center">
            <Avatar color={item.color} icon={item.icon} className="me-2" />
            <div className="my-auto">
              <h5 className="fw-bolder mb-0 buttonTimer">{item.title}</h5>
            </div>
          </div>
        </Col>
      );
    });
  };

  return (
    <Fragment>
      <Modal
        className={`modal-dialog-centered modal-sm`}
        isOpen={stopModal}
        toggle={() => setStopModal(!stopModal)}
      >
        <ModalHeader className="mb-1" toggle={() => setStopModal(!stopModal)}>
          ! Dikkat
        </ModalHeader>

        <ModalBody>
          <div style={{ textAlign: "center" }}>
            {screenName} Süreci Sonlandırılacak.
          </div>
          <div style={{ textAlign: "center" }}>
            Süreç Bitirildiğinde Tekrar Çalışma Yapamazsınız.
          </div>
          <div style={{ textAlign: "center" }}>
            {" "}
            <span>Bitirmek İstediğinize Emin misiniz ?</span>
          </div>

          <div className="text-center">
            <Button className="me-1" color="primary" onClick={stopProcess}>
              Evet
            </Button>
            <Button
              color="secondary"
              onClick={() => setStopModal(false)}
              outline
            >
              İptal
            </Button>
          </div>
        </ModalBody>
      </Modal>
      <div className="timer-controller-wrapper">
        {restCauseModal ? (
          <TimerCauseModal
            provisionId={provisionId.id}
            workProcessRouteId={workProcessRouteId}
            modalFunction={modalClose}
            shiftTargetParametersId={shiftTargetParametersId}
            userId={userData.id}
          />
        ) : null}

        <Row>
          <Col sm="2">
            <Button
              outline
              color="primary"
              style={{ width: "100%", height: 73 }}
              disabled
            >
              <h4 className="jobNameTimer">{screenName}</h4>
            </Button>
          </Col>
          <Col sm="2">
            <Button
              outline
              color="primary"
              style={{ width: "100%", height: 73, color: "#00005c" }}
              onClick={startProcess}
              disabled={isStartBtnDisabled}
            >
              {renderDataStart()}
            </Button>
          </Col>
          <Col sm="2">
            <Button
              outline
              color="primary"
              style={{ width: "100%", height: 73, color: "#00005c" }}
              onClick={pauseHandler}
              disabled={isPauseBtnDisabled}
            >
              <Row>{renderDataPause()}</Row>
            </Button>
          </Col>
          <Col sm="2">
            <Button
              outline
              color="primary"
              style={{ width: "100%", height: 73, color: "#00005c" }}
              onClick={resumeProcess}
              disabled={isResumeBtnDisabled}
            >
              <Row>{renderDataResume()}</Row>
            </Button>
          </Col>

          <Col sm="2">
            <Button
              outline
              color="primary"
              style={{ width: "100%", height: 73, color: "#00005c" }}
              onClick={() => setStopModal(true)}
              disabled={isStopBtnDisabled}
            >
              <Row>{renderDataStop()} </Row>
            </Button>
          </Col>

          {elapsedDay > 0 ? (
            <>
              <Col sm="1">
                <Button
                  color="primary"
                  style={{ width: "100%", height: 73, color: "#00005c" }}

                  // disabled={true}
                >
                  <h2 className="totalTimer">{elapsedDay} Gün </h2>
                </Button>
              </Col>
              <Col sm="1">
                <Button
                  color="primary"
                  style={{ width: "100%", height: 73, color: "#00005c" }}

                  // disabled={true}
                >
                  <h2 className="totalTimer">{renderedStreamDuration}</h2>
                </Button>
              </Col>
            </>
          ) : (
            <Col sm="2">
              <Button
                color="primary"
                style={{ width: "100%", height: 73, color: "#00005c" }}

                // disabled={true}
              >
                <h2 className="totalTimer">{renderedStreamDuration}</h2>
              </Button>
            </Col>
          )}
        </Row>
      </div>
    </Fragment>
  );
};

export default TimerCalculate;
