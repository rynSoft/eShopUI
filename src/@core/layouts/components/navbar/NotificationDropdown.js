// ** React Imports
import { Fragment } from "react";

// ** Custom Components
import Avatar from "@components/avatar";
// ** React Imports
import { Link, useHistory } from "react-router-dom";
// ** Third Party Components
import classnames from "classnames";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Bell, X, Check, AlertTriangle, CheckCircle, TrendingUp, AlertCircle } from "react-feather";
import axios from "axios";
// ** Reactstrap Imports
import {
  Button,
  Badge,
  Input,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  Col,
  Row,
} from "reactstrap";
import { useState, useEffect } from "react";
import { useSkin } from '@hooks/useSkin'
import { useSelector, useDispatch } from "react-redux";
import { isUserLoggedIn } from "@utils";
import { workingListUpdate,qualityListUpdate } from "../../../../redux/refreshData";
import ShiftDefinitionController from "./ShiftDefinitionController";

const NotificationDropdown = () => {
  const { skin, setSkin } = useSkin()
  const newWorkingData = useDispatch();
  const newQualityData = useDispatch();
  const newWorkingController = useSelector((state) => state.refreshData.newWorking);
  const newQualityController = useSelector((state) => state.refreshData.newQuality);
  const [userData, setUserData] = useState(null);
  const [taskList, setTaskList] = useState([]);
  const [qualityList, setQualityList] = useState([]);
  const history = useHistory();
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem("userData")));
    }
  }, []);
  useEffect(() => {
    getAllTask()
  }, [newWorkingController]);
  useEffect(() => {
    
    getAllQualityTask()
  }, [newQualityController]);
  useEffect(() => {
    getAllQualityTask();
    getAllTask()
  }, [userData]);
  const getAllTask = () => {
    if (userData?.id) {

      axios
        .get(
          process.env.REACT_APP_API_ENDPOINT +
          "api/Account/GetAllTaskAsync?Id=" +
          userData?.id
        )
        .then((response) => {
          newWorkingData(workingListUpdate(response.data.data))
          setTaskList(response.data.data);

        });
    }
  }

  const getAllQualityTask = () => {
    if (userData?.id) {

      axios
        .get(
          process.env.REACT_APP_API_ENDPOINT +
          "api/Account/GetAllTaskQualityAsync?Id=" +
          userData?.id
        )
        .then((response) => {
     
            newQualityData(qualityListUpdate(response.data.data))
            setQualityList(response.data.data);
       
        });
    }
  }






  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpenQuality, setDropdownOpenQuality] = useState(false);
  // ** Function to render Notifications
  /*eslint-disable */
  const renderNotificationItems = () => {
    return (
      <PerfectScrollbar
        component="li"
        className="media-list scrollable-container"
        options={{
          wheelPropagation: false,
        }}
      >
        {taskList.map((item, index) => {
          var dateZone = new Date(item.dates);

          return (
            <div className={classnames("list-item d-flex align-items-start")} key={index}>
              {
                <Fragment>
                  <div className="me-1">
                    <Avatar
                      {...{
                        icon: <AlertTriangle />,
                        color: "light-danger",
                      }}
                    />
                  </div>
                  <small style={{ color: skin === "dark" ? "white" : "gray" }}>{item.message} <span style={{ color: "red",marginLeft:10 }}>{item.productionProcess === 2 ? "Kit Hazırlama" : item.productionProcess === 3 ? "Kit Doğrulama" : item.productionProcess === 4 ? "Setup Doğrulama" : "Üretim Bandı"}</span></small>

                  <small className="notification-text">
                    {dateZone.toLocaleDateString()}{" "}
                    {dateZone.toLocaleTimeString()}
                  </small>

                  <small className="notification-text" style={{ marginLeft: 5 }}>
                    <Button
                      onClick={() => {
                        setDropdownOpen(false);

                        axios
                          .get(
                            process.env.REACT_APP_API_ENDPOINT +
                            "api/Account/UpdateTaskAsync?Id=" +
                            item.id
                          )
                          .then((response) => {
                            getAllTask();
                          });
                        history.push(
                          item.productionProcess === 3
                            ? "/kitVerificationList/" + item.productionId
                            : item.productionProcess === 2
                              ? "/kitProvisionList/" + item.productionId
                              : item.productionProcess === 4
                                ? "/setupVerificationList/" + item.productionId
                                : "/productionProcessList/" + item.productionId
                        );
                      }}
                    >
                      Git
                    </Button>
                  </small>
                </Fragment>
              }
            </div>
          );
        })}
      </PerfectScrollbar>
    );
  };

  const renderNotificationItemsQuality = () => {
    return (
      <PerfectScrollbar
        component="li"
        className="media-list scrollable-container"
        options={{
          wheelPropagation: false,
        }}
      >
        {qualityList.map((item, index) => {
          var dateZone = new Date(item.dates);

          return (
            <div className={classnames("list-item d-flex align-items-start")} key={index}>
              {
                <Fragment>
                  <div className="me-1">
                    <Avatar
                      {...{
                        icon: <AlertCircle />,
                        color: "light-info",
                      }}
                    />
                  </div>
                  <small style={{ color: skin === "dark" ? "white" : "gray" }}>{item.message} <span style={{ color: "red",marginLeft:10 }}>{item.qualityProcess === 1 ? "Onay " : item.qualityProcess === 2 ?"Operasyon": "Tamamlanan"}</span></small>

                  <small className="notification-text">
                    {dateZone.toLocaleDateString()}{" "}
                    {dateZone.toLocaleTimeString()}
                  </small>

                  <small className="notification-text" style={{ marginLeft: 5 }}>
                    <Button
                      onClick={() => {
                        setDropdownOpenQuality(false);

                        axios
                          .get(
                            process.env.REACT_APP_API_ENDPOINT +
                            "api/Account/UpdateTaskQualityAsync?Id=" +
                            item.id
                          )
                          .then((response) => {
                            getAllQualityTask();
                          });
                        history.push(
                          item.qualityProcess === 1
                            ? "/qualityConfirmation/" + item.qualityId
                            :item.qualityProcess==2 ?  "/qualityOperation/" + item.qualityId: "/qualityCompleted/" + item.qualityId
                           
                        );
                      }}
                    >
                      Git
                    </Button>
                  </small>
                </Fragment>
              }
            </div>
          );
        })}
      </PerfectScrollbar>
    );
  };
  /*eslint-enable */

  return (<Fragment>
{/* <ShiftDefinitionController userData={userData} /> */}
    <UncontrolledDropdown
      tag="li"
      className="dropdown-notification nav-item me-25"
      isOpen={dropdownOpenQuality}
      toggle={() => setDropdownOpenQuality(!dropdownOpenQuality)}
    >
      <DropdownToggle
        tag="a"
        className="nav-link"
        href="/"
        onClick={(e) => e.preventDefault()}
      >
        <TrendingUp size={21} />
        <Badge pill color="danger" className="badge-up">
          {qualityList.length}
        </Badge>
      </DropdownToggle>
      <DropdownMenu end tag="ul" className="dropdown-menu-media mt-0">
        <li className="dropdown-menu-header">
          <DropdownItem className="d-flex" tag="div" header>
            <h4 className="notification-title mb-0 me-auto">Kalite Görevlerim</h4>
            <Badge tag="div" color="light-primary" pill>
              {qualityList.length} Yeni
            </Badge>
          </DropdownItem>
        </li>
        {renderNotificationItemsQuality()}
      </DropdownMenu>
    </UncontrolledDropdown>
    <UncontrolledDropdown
      tag="li"
      className="dropdown-notification nav-item me-25"
      isOpen={dropdownOpen}
      toggle={() => setDropdownOpen(!dropdownOpen)}
    >
      <DropdownToggle
        tag="a"
        className="nav-link"
        href="/"
        onClick={(e) => e.preventDefault()}
      >
        <Bell size={21} />
        <Badge pill color="danger" className="badge-up">
          {taskList.length}
        </Badge>
      </DropdownToggle>
      <DropdownMenu end tag="ul" className="dropdown-menu-media mt-0">
        <li className="dropdown-menu-header">
          <DropdownItem className="d-flex" tag="div" header>
            <h4 className="notification-title mb-0 me-auto">Görevlerim</h4>
            <Badge tag="div" color="light-primary" pill>
              {taskList.length} Yeni
            </Badge>
          </DropdownItem>
        </li>
        {renderNotificationItems()}
      </DropdownMenu>
    </UncontrolledDropdown></Fragment>
  );
};

export default NotificationDropdown;
