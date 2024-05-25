// App.js

import React, { useEffect, useState, Fragment } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  Label,
  Row,
  Toast,
} from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
// ** Custom Components
import AvatarGroup from "@components/avatar-group";
import {
  Trash,
  UserMinus,
  UserPlus,
} from "react-feather";
import Select from "react-select";
import "@styles/base/core/menu/menu-types/vertical-menu.scss";
import "@styles/base/core/menu/menu-types/vertical-overlay-menu.scss";
import axios from "axios";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import UserModal from "./UserModal";
import toastData from "../../../@core/components/toastData";
import { Translation, useTranslation } from "react-i18next";
import { DynamicIcon, Icon } from "../../../@core/components/DynamicIcon/DynamicIcon";
import { useSkin } from '@hooks/useSkin'
const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  background: isDragging ? "#6610f2" : "none",
  color: "white",
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "#5856d6" : "none",
  padding: grid,
  width: isDraggingOver ? "100%" : "100%",
});
const convertName = (name) => {
  if (name === null || name === undefined || name === "") return null;
  else
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
      .replace(/\s+/g, "_");
};

const Test = (props) => {
  const [data, setData] = useState({ list1: [], list2: [] });
  const [userModalState, setUserModalState] = useState(false);
  const [userModalData, setUserModalData] = useState({});
  const [modalType, setModalType] = useState("");
  const [colorList, setcolorList] = useState([
    "light-success",
    "warning",
    "light-info",
    "error",
    "light-warning",
    "danger",
    "success",
    "danger",
    "light-error",
    "info",
  ]);
  const [colorListT, setcolorListT] = useState([
    "#70d6ff",
    "#758bfd",
    "#ff9770",
    "#80ed99",
    "#ffd670",
    "#ffa0ac",
    "#9ef01a",
    "#7fc8f8",
    "#e9ff70",
    "#ffafcc",
    "#80ed99",
    "#f9f9f9",
    "#c77dff",
    "#aceca1",
    "#efb1ff",
    "#00f5d4",
    "#fe6d73",
    "#ff8484",

  ]);
  const { skin} = useSkin()
  const { t } = useTranslation();
  const loadData = () => {
    axios
      .get(
        process.env.REACT_APP_API_ENDPOINT +
        "api/WorkProcessTemplate/GetAllListProductionId?productionId=" +
        props.productionId
      )
      .then((response) => {
        setData(response.data.data);
      });
  };

  useEffect(() => {
    loadData();
  }, []);
  useEffect(()=>{console.log(data)},[data])

  const handleSave = (postData) => {
    axios
      .post(
        process.env.REACT_APP_API_ENDPOINT +
        "api/WorkProcessRoute/AddorUpdateAll",
        postData
      )
      .then((res) => {
        if (res.data.success) {
          toastData("Rota Bilgisi Kaydedildi", true);
          loadData();
          window.location.reload();
        } else {
          toastData("Rota Bilgisi Kaydedilemedi!", false);
          loadData();
        }
      })
      .catch((error) => {
        toastData("Rota Bilgisi Kaydedilemedi!" + error.message, false);
      });
  };
  const onDragEnd = (result) => {
    const { source, destination } = result;
    debugger;
    // If the item is dropped outside a valid droppable
    if (!destination) {
      return;
    }

    // If the item is dropped in the same list and position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    // If the item is dropped in the same list
    if (source.droppableId === destination.droppableId) {
      // Reorder the list within the same list
      const listToReorder = [...data[source.droppableId]];
      const [draggedItem] = listToReorder.splice(source.index, 1);
      listToReorder.splice(destination.index, 0, draggedItem);

      const newData = { ...data, [source.droppableId]: listToReorder };
      setData(newData);
    } else {
      // Copy the dragged component to the second list
      const draggedItem = data[source.droppableId][source.index];
      const tempItem = JSON.parse(JSON.stringify(draggedItem));
      if (source.droppableId === destination.droppableId) {
      } else {
        tempItem.id = uuidv4();
        tempItem.workProcessTemplateId = result.draggableId;
        tempItem.progressColor = colorListT[source.index];
      }
      const newData = { ...data };

      newData[destination.droppableId].splice(destination.index, 0, {
        ...tempItem,
      });
      setData(newData);
    }
  };
  const removeItem = (index) => {
    debugger;
    let updatedList = [...data.list2];
    let id = data.list2[index]?.id;
    updatedList.splice(index, 1);
    setData((prevData) => ({
      ...prevData,
      list2: updatedList,
    }));
    deleteData(id);
  };

  const deleteData = (index) => {
    axios
      .delete(process.env.REACT_APP_API_ENDPOINT + "api/WorkProcessRoute/Delete?Id=" + index)
      .then((res) => {
        if (res.data.success) {
          toastData("Seçili Rota Silindi", true);
        } else {
          toastData("Seçili Rota Silinemedi !", false);
        }
      })
      .catch((err) => toastData("Seçili Rota Silinemedi  !", false));
  };


  const handleProcessName = (value, id) => {
    setData((prevData) => {
      const updatedList = prevData.list2.map((item) => {
        if (item.id === id) {
          return { ...item, name: value };
        }
        return item;
      });
      return { ...prevData, list2: updatedList };
    });
  };
  const checkData = () => {
    const postData = data.list2.map((item, index) => ({
      id: item.routeId ? item.id : 0,
      routeId: item.routeId ? item.routeId : item.id,
      name: item.name,
      virtualName: convertName(item.name),
      productionId: props.productionId,
      workProcessTemplateId: item.workProcessTemplateId,
      state: item.active,
      order: index + 1,
      progressColor: item.progressColor,
      active: true,
    }));

    let check = false;
    postData.forEach((d) => {
      if (d.name == null) {
        check = true;
        return;
      }
    });
    if (check) {
      toastData("İş Adı Boş Olamaz!", false);
    } else {
      handleSave(postData);
    }
  
  };

  const showUserModal = (type, row) => {
    setModalType(type);
    setUserModalState(!userModalState);
    setUserModalData(row);
    loadData();
  };
  return (
    <Fragment>
      {userModalState && (
        <UserModal
          modalType={modalType}
          closeModal={showUserModal}
          userModalData={userModalData}
          productionId={props.productionId}
        />
      )}

      <Col>
        <Row>
          <DragDropContext onDragEnd={onDragEnd}>
            <div style={{ display: "flex", height: "76vh" }}>

              <Button outline color="primary">
                <h3 style={{ textAlign: "left" }}> {t("sablon")}</h3>
                <PerfectScrollbar
                  options={{ wheelPropagation: false, suppressScrollX: true }}
                  className="ScrollHeightDynamic"
                >
                  <CardBody>
                    <Row>
                      <Droppable droppableId="list1" isDropDisabled={true}>
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                          >
                            {data.list1.map((item, index) => (

                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    ref={provided.innerRef}
                                    style={getItemStyle(
                                      snapshot.isDragging,
                                      provided.draggableProps.style
                                    )}
                                  >
                                    <Card >
                                      <Badge
                                        color={
                                          item.color === null
                                            ? "light-success"
                                            : item.color
                                        }
                                      >
                                        ----------------------------------
                                      </Badge>
                                      <CardBody style={{ marginTop: 10 }}>
                                        <Row style={{ height: "100%" }}>
                                          <Col sm={10}>
                                            <span style={{ display: "inline-block" }}>
                                              <Label style={{fontWeight:"bold",fontSize:14 ,color:colorListT[index]}}> {item.content}</Label></span>
                                          </Col>
                                          <Col sm={1} style={{ position: "absolute", right: 20,top:25 }}>
                                            {item.icon ?
                                              <DynamicIcon name={item.icon} />
                                              : <></>
                                            }
                                          </Col>
                                        </Row>
                                      </CardBody>
                                      <Badge
                                        color={
                                          item.color === null
                                            ? "light-success"
                                            : item.color
                                        }
                                      >
                                        ----------------------------------
                                      </Badge>
                                    </Card>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </Row>
                  </CardBody>
                </PerfectScrollbar>
              </Button>
              <Button
                outline
                color="primary"
                style={{ marginLeft: 10, width: "100%" }}
              >
                {" "}
                {/* <h3 style={{ textAlign: "left" }}> Rota Bilgisi</h3> */}
                <PerfectScrollbar
                  options={{ wheelPropagation: false, suppressScrollX: true }}
                  className="ScrollHeightDynamic"
                >
                  <Droppable droppableId="list2">
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                      >
                        <div>
                          <Card>
                            <Row style={{ margin: 10, color: "white" }}>
                              <Col sm="3" style={{ textAlign: "left" }}><Label style={{fontWeight:"bolder"}}>{(t('asama').toUpperCase())}</Label></Col>
                              <Col sm="1" style={{ textAlign: "left",width:"3%" }}></Col>
                              <Col sm="5" style={{ textAlign: "center" }}><Label style={{fontWeight:"bolder"}}>{t('kullanici').toUpperCase()}</Label></Col>
                              <Col sm="2" style={{ textAlign: "right" }}><Label style={{fontWeight:"bolder"}}>{t('durum').toUpperCase()}</Label></Col>
                              <Col sm="1" style={{ textAlign: "center" }}><Label style={{fontWeight:"bolder"}}>{t('sil').toUpperCase()}</Label></Col>
                            </Row>
                          </Card>
                        </div>
                        {data.list2.map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                              >
                                {data.list2.length > 0 && (
                                  <Card style={{ marginTop: -25 }}>
                                    <CardBody>
                                      <div className="role-heading">
                                        {item.content == "Makina" ? (
                                          <>
                                            <Row>
                                              <Col>
                                                <Col sm={12}>
                                                  <Input placeholder="Makina Adı " />
                                                </Col>
                                                <Col
                                                  sm={12}
                                                  style={{ marginTop: 10 }}
                                                >
                                                  <Select
                                                    isClearable={false}
                                                    className="react-select"
                                                    classNamePrefix="select"
                                                    placeholder="Makina seç"
                                                    onChange={(event) =>
                                                      setLineDetail({
                                                        value: event.value,
                                                        label: event.label,
                                                      })
                                                    }
                                                  />{" "}
                                                </Col>
                                              </Col>

                                              <Col
                                                style={{ textAlign: "right" }}
                                              >
                                                <Col>
                                                  {" "}
                                                  <Badge
                                                    color={
                                                      item.active
                                                        ? "light-success"
                                                        : "light-danger"
                                                    }
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                  >
                                                    {item.active
                                                      ? "Aktif"
                                                      : "Pasif"}
                                                  </Badge>
                                                </Col>
                                                <Col style={{ marginTop: 10 }}>
                                                  {" "}
                                                  <Badge
                                                    color={
                                                      item.color === null
                                                        ? "light-success"
                                                        : item.color
                                                    }
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                  >
                                                    {console.log(item)}
                                                    {item.content}
                                                  </Badge>
                                                </Col>
                                              </Col>
                                              <Col sm="1" key={index}>
                                              {" "}
                                              {/* Silme Butonu */}
                                              <Trash color="#F98866"
                                                onClick={() =>
                                                  removeItem(index)
                                                }
                                              />
                                            </Col>
                                            </Row>
                                          </>
                                        ) : (
                                          <Row>
                                            <Col sm="3">
                                              {" "}
                                              {/* Input */}
                                              <Input
                                                key={item.id}
                                                placeholder="İş Adını Giriniz"
                                                value={
                                                  data.list2.find(
                                                    (item) =>
                                                      item.id ===
                                                      provided.draggableProps[
                                                      "data-rfd-draggable-id"
                                                      ]
                                                  ).name || ""
                                                }
                                                onChange={(e) =>
                                                  handleProcessName(
                                                    e.target.value,
                                                    provided.draggableProps[
                                                    "data-rfd-draggable-id"
                                                    ]
                                                  )
                                                }
                                              />
                                            </Col>
                                            <Col sm="1" style={{width:"3%" }}>
                                             <DynamicIcon  color={colorListT[index]} name={item.icon}/>
                                            </Col>

                                            <Col sm="5" style={{ color: "white" }}>
                                              <div >
                                                {item?.userList?.map(
                                                  (user, keys) => (
                                                    <span style={{ display: "inline-block" }} key={keys}>
                                                      {" "}
                                                      <UserMinus
                                                      color={skin=="light"?"black":"white"}
                                                        onClick={() =>
                                                          showUserModal(
                                                            "delete",
                                                            {
                                                              id: user.workProcessRouteId,
                                                              explanation:
                                                                item.explanation,
                                                            }
                                                          )
                                                        }
                                                        style={{
                                                          cursor: "pointer",
                                                          marginLeft: 10
                                                        }}
                                                        size={16}
                                                      ></UserMinus>{" "}
                                                      <Badge
                                                        color={colorList[keys]}
                                                        style={{
                                                          cursor: "inherit",
                                                        }}
                                                      >
                                                        {user.name}{" "}
                                                        {user.surName}{" "}
                                                      </Badge>
                                                    </span>
                                                  )
                                                )}
                                                <UserPlus
                                                color={skin=="light"?"black":"white"}
                                                  onClick={() =>
                                                    showUserModal(
                                                      "insert",
                                                      item
                                                    )
                                                  }
                                                  style={{
                                                    cursor: "pointer",
                                                    marginLeft: 10,
                                                  }}
                                                  size={16}
                                                ></UserPlus>
                                              </div>
                                            </Col>

                                            <Col sm="2" style={{ textAlign: "right" }}>
                                              <Col>
                                                {" "}
                                                {/* Aktif Pasif */}{" "}
                                                <Badge
                                                  color={
                                                    item.active
                                                      ? "light-success"
                                                      : "light-danger"
                                                  }
                                                  style={{ cursor: "pointer" }}
                                                >
                                                  {item.active
                                                    ? "Aktif"
                                                    : "Pasif"}
                                                </Badge>
                                              </Col>
                                              <Col style={{ marginTop: 10 }}>
                                                {" "}
                                                {/* Şablon İsmi */}{" "}
                                                <Badge
                                                  color={
                                                    item.color === null
                                                      ? "light-success"
                                                      : item.color
                                                  }
                                                  style={{ cursor: "pointer" }}
                                                >
                                                  {item.content}
                                                </Badge>
                                              </Col>
                                            </Col>
                                            <Col sm="1" key={index}>
                                              {" "}
                                              {/* Silme Butonu */}
                                              <Trash color="#F98866"
                                                onClick={() =>
                                                  removeItem(index)
                                                }
                                              />
                                            </Col>
                                          </Row>
                                        )}
                                      </div>
                                    </CardBody>
                                  </Card>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </PerfectScrollbar>
              </Button>
            </div>
          </DragDropContext>
        </Row>
        <Row style={{ display: "flex", height: "1vh" }}>
          <Button
            style={{
              position: "absolute",
              right: 25,
              bottom: 0,
              maxWidth: "5%",
            }}
            className="btn btn-success"
            onClick={() => checkData()}
          >
            {t("kaydet")}
          </Button>
        </Row>
      </Col>
    </Fragment>
  );
};

export default Test;
