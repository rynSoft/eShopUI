// App.js

import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom'
import { Badge, Button, Card, CardBody, CardHeader, Col, Input, Row } from 'reactstrap';
import PerfectScrollbar from "react-perfect-scrollbar";
// ** Custom Components
import AvatarGroup from '@components/avatar-group'
import { ArrowRightCircle, Copy, PlayCircle, UserPlus } from 'react-feather';
import { selectThemeColors } from "@utils";
import Select from "react-select";


import DataTable from "react-data-table-component";
import "@styles/base/core/menu/menu-types/vertical-menu.scss";

import { UseSelector, useDispatch } from "react-redux";
import "@styles/base/core/menu/menu-types/vertical-overlay-menu.scss";
import { workingActive, workingPassive } from "../../../redux/refreshData";


import axios from "axios";
import "@styles/react/libs/tables/react-dataTable-component.scss";



import Avatar from "@components/avatar";




import toastData from "../../../@core/components/toastData";

const initialData = {
  list1: [
    { id: 'list1-78cae93d-5ef8-4374-bdf0-17c39955f981', content: 'Standart Manual İşlemler', active: true, userList: [] },
    { id: 'list1-bc46f0d9-b123-41e8-bff2-cd111aaf891c', content: 'Standart Kalite İşlemleri', active: true, userList: [] },
    { id: 'list1-b839df6b-32a7-4df6-98ab-b7e082fff597', content: 'Standart Üretim İşlemleri', active: true, userList: [] },
    { id: 'list1-b839df6b-32a7-4df6-98ab-b7e082fff598', content: 'Kamera', active: false, userList: [] },
    { id: 'list1-b839df6b-32a7-4df6-98ab-b7e082fff596', content: 'Makina', active: false, userList: [] }
  ],
  list2: [

  ],
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  background: isDragging ? "#6610f2" : "none",
  color: "white",
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "#5856d6" : "none",
  padding: grid,
  width: isDraggingOver ? "100%" : "100%",
});


const Test = () => {
  const [data, setData] = useState(initialData);
  const data2 = [
    {
      totalUsers: 4,
      title: 'Administrator',
      users: [
        {
          size: 'sm',
          title: 'Vinnie Mostowy',
          img: require('@src/assets/images/avatars/2.png').default
        },
        {
          size: 'sm',
          title: 'Allen Rieske',
          img: require('@src/assets/images/avatars/12.png').default
        },
        {
          size: 'sm',
          title: 'Julee Rossignol',
          img: require('@src/assets/images/avatars/6.png').default
        },
        {
          size: 'sm',
          title: 'Kaith Dsouza',
          img: require('@src/assets/images/avatars/11.png').default
        }
      ]
    },
    {
      totalUsers: 7,
      title: 'Manager',
      users: [
        {
          size: 'sm',
          title: 'Jimmy Ressula',
          img: require('@src/assets/images/avatars/4.png').default
        },
        {
          size: 'sm',
          title: 'John Doe',
          img: require('@src/assets/images/avatars/1.png').default
        },
        {
          size: 'sm',
          title: 'Kristi Lawker',
          img: require('@src/assets/images/avatars/2.png').default
        },
        {
          size: 'sm',
          title: 'Kaith D',
          img: require('@src/assets/images/avatars/5.png').default
        },
        {
          size: 'sm',
          title: 'Danny Paul',
          img: require('@src/assets/images/avatars/7.png').default
        }
      ]
    },
    {
      totalUsers: 5,
      title: 'Users',
      users: [
        {
          size: 'sm',
          title: 'Andrew Tye',
          img: require('@src/assets/images/avatars/6.png').default
        },
        {
          size: 'sm',
          title: 'Rishi Swaat',
          img: require('@src/assets/images/avatars/9.png').default
        },
        {
          size: 'sm',
          title: 'Rossie Kim',
          img: require('@src/assets/images/avatars/2.png').default
        },
        {
          size: 'sm',
          title: 'Kim Merchent',
          img: require('@src/assets/images/avatars/10.png').default
        },
        {
          size: 'sm',
          title: 'Sam Dsouza',
          img: require('@src/assets/images/avatars/8.png').default
        }
      ]
    },
    {
      totalUsers: 3,
      title: 'Support',
      users: [
        {
          size: 'sm',
          title: 'Kim Karlos',
          img: require('@src/assets/images/avatars/3.png').default
        },
        {
          size: 'sm',
          title: 'Katy Turner',
          img: require('@src/assets/images/avatars/9.png').default
        },
        {
          size: 'sm',
          title: 'Peter Adward',
          img: require('@src/assets/images/avatars/12.png').default
        },
        {
          size: 'sm',
          title: 'Kaith Dsouza',
          img: require('@src/assets/images/avatars/10.png').default
        },
        {
          size: 'sm',
          title: 'John Parker',
          img: require('@src/assets/images/avatars/11.png').default
        }
      ]
    },
    {
      totalUsers: 2,
      title: 'Restricted User',
      users: [
        {
          size: 'sm',
          title: 'Kim Merchent',
          img: require('@src/assets/images/avatars/10.png').default
        },
        {
          size: 'sm',
          title: 'Sam Dsouza',
          img: require('@src/assets/images/avatars/6.png').default
        },
        {
          size: 'sm',
          title: 'Nurvi Karlos',
          img: require('@src/assets/images/avatars/3.png').default
        },
        {
          size: 'sm',
          title: 'Andrew Tye',
          img: require('@src/assets/images/avatars/8.png').default
        },
        {
          size: 'sm',
          title: 'Rossie Kim',
          img: require('@src/assets/images/avatars/9.png').default
        }
      ]
    }
  ]
  const onDragEnd = (result) => {
    const { source, destination } = result;

    // If the item is dropped outside a valid droppable
    if (!destination) {
      return;
    }

    // If the item is dropped in the same list and position
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
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
        tempItem.id = "list2-" + uuidv4();
      }

      const newData = { ...data };

      newData[destination.droppableId].splice(destination.index, 0, { ...tempItem });
      console.log(destination.droppableId)
      console.log("draggedItem:" + draggedItem.id.substring(draggedItem.id.indexOf("-") + 1))
      setData(newData);
    }
  };

  return (


    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex' }}>
        <Button
          outline
          color="primary"
        >
          <h3 style={{ textAlign: "left" }}> Şablon</h3>
          <PerfectScrollbar
            options={{ wheelPropagation: false, suppressScrollX: true }}
            className="ScrollHeightDynamic"

          >

            <CardBody>

              <Droppable droppableId="list1" isDropDisabled={true}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {data.list1.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
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
                            <Card style={{ height: 120 }}>
                              <Badge color={item.content == "Standart Manual İşlemler" ? "light-info" : item.content == "Standart Kalite İşlemleri" ? "light-warning" : "light-success"}  >----------------------------------</Badge>
                              <CardBody style={{ marginTop: 10 }}>
                                <span > {item.content}</span>
                              </CardBody>
                              <Badge color={item.content == "Standart Manual İşlemler" ? "light-info" : item.content == "Standart Kalite İşlemleri" ? "light-warning" : "light-success"}  >----------------------------------</Badge>

                            </Card>

                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardBody>
          </PerfectScrollbar>
        </Button>

        <Button
          outline
          color="primary"
          style={{ marginLeft: 10, width: "100%" }}
        >    <h3 style={{ textAlign: "left" }}> Rota Bilgisi</h3>
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
                  <div >
                    <Card>
                      <Row style={{ margin: 10, color: "white" }}>
                        <Col style={{ textAlign: "left" }}>AŞAMA</Col>
                        <Col style={{ textAlign: "left" }}>KULLANICI</Col>
                        <Col style={{ textAlign: "right" }}>DURUM</Col>
                        <Col style={{ textAlign: "right" }}>ROTA</Col>
                      </Row>
                    </Card>
                  </div>
                  {data.list2.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          {data.list2.length > 0 && (

                            <Card style={{ marginTop: -26 }}>
                              <CardBody>


                                <div className='role-heading'>
                                  {item.content == "Makina" ? <>
                                    <Row>
                                      <Col>
                                      <Col sm={12} >
                                        <Input
                  
          
                                          placeholder='Makina Adı '


                                        /> </Col><Col sm={12} style={{ marginTop: 10 }}>
                                        <Select 
                                          isClearable={false}
                                          className='react-select'
                                          classNamePrefix='select'

                                          placeholder='Makina seç'

                                          onChange={(event) => setLineDetail({ value: event.value, label: event.label })}
                                        /> </Col>
                                        
{/* 
                                        <Col sm={12} style={{ marginTop: 10 }}>                   <Select
                                          isClearable={false}
                                          className='react-select'
                                          classNamePrefix='select'


                                          placeholder=' kamera seç'
                                          onChange={(event) => setLineDetail({ value: event.value, label: event.label })}
                                        /> </Col>
                                        <Col sm={12} style={{ marginTop: 10 }}>          <Select
                                          isClearable={false}
                                          className='react-select'
                                          classNamePrefix='select'


                                          placeholder='kamera seç'

                                          onChange={(event) => setLineDetail({ value: event.value, label: event.label })}
                                        /></Col> */}
                                        </Col>
                                      <Col style={{ color: 'white' }}>
                                        <div className="d-flex">

                                          {item.userList.map((user, key) => <div key={key}> <UserMinus

                                            onClick={() => showUserModal("delete", { id: user.userRouteInfoId, explanation: item.explanation })}
                                            style={{ cursor: "pointer", marginLeft: 10 }}
                                            size={16}
                                          ></UserMinus>{user.name} {user.surName}      </div>)}
                                          <UserPlus

                                            onClick={() => showUserModal("insert", row)}
                                            style={{ cursor: "pointer", marginLeft: 10 }}
                                            size={16}
                                          ></UserPlus>
                                        </div>
                                      </Col>
                                      <Col style={{ textAlign: 'right' }}>
                                        <>
                                          {item.explanation === "KIT_HAZIRLAMA" ? (
                                            item.kitHazirlamaState == 1 ? (
                                              <Avatar color="light-success" icon={<PlayCircle size={14} />} />
                                            ) : item.kitHazirlamaState == 2 ? (
                                              <Avatar color="light-danger" icon={<Pause size={14} />} />
                                            ) : item.kitHazirlamaState == 3 ? (
                                              <Avatar color="light-warning" icon={<PlayCircle size={14} />} />
                                            ) : item.kitHazirlamaState == 4 ? (
                                              <Avatar color="light-info" icon={<StopCircle size={14} />} />
                                            ) : (
                                              <Avatar color="light-success" icon={<PlayCircle size={14} />} />
                                            )
                                          ) : item.explanation === "DOKUMAN_KONTROLU" ? (
                                            item.kitDogrulamaState == 1 ? (
                                              <Avatar color="light-success" icon={<PlayCircle size={14} />} />
                                            ) : item.kitDogrulamaState == 2 ? (
                                              <Avatar color="light-danger" icon={<Pause size={14} />} />
                                            ) : item.kitDogrulamaState == 3 ? (
                                              <Avatar color="light-warning" icon={<PlayCircle size={14} />} />
                                            ) : item.kitDogrulamaState == 4 ? (
                                              <Avatar color="light-info" icon={<StopCircle size={14} />} />
                                            ) : (
                                              <Avatar color="light-success" icon={<PlayCircle size={14} />} />
                                            )
                                          ) : (
                                            <Avatar color="light-success" icon={<PlayCircle size={14} />} />
                                          )}
                                        </>
                                      </Col>

                                      <Col style={{ textAlign: 'right' }}>
                                        <Col>   <Badge color={item.active ? "light-success" : "light-danger"} style={{ cursor: "pointer" }} >{item.active ? "Aktif" : "Pasif"}</Badge>
                                        </Col>
                                        <Col style={{ marginTop: 10 }}>     <Badge color={item.content == "Standart Manual İşlemler" ? "light-info" : item.content == "Standart Kalite İşlemleri" ? "light-warning" : "light-success"} style={{ cursor: "pointer" }} >{item.content}</Badge>
                                        </Col>
                                      </Col>

                                    </Row>

                                  </> : <Row>
                                    <Col>
                                      <Input
                                        placeholder='İş Adını Giriniz'
                                      > </Input>
                                    </Col>

                                    <Col style={{ color: 'white' }}>
                                      <div className="d-flex">

                                        {item.userList.map((user, key) => <div key={key}> <UserMinus

                                          onClick={() => showUserModal("delete", { id: user.userRouteInfoId, explanation: item.explanation })}
                                          style={{ cursor: "pointer", marginLeft: 10 }}
                                          size={16}
                                        ></UserMinus>{user.name} {user.surName}      </div>)}
                                        <UserPlus

                                          onClick={() => showUserModal("insert", row)}
                                          style={{ cursor: "pointer", marginLeft: 10 }}
                                          size={16}
                                        ></UserPlus>
                                      </div>
                                    </Col>
                                    <Col style={{ textAlign: 'right' }}>
                                      <>
                                        {item.explanation === "KIT_HAZIRLAMA" ? (
                                          item.kitHazirlamaState == 1 ? (
                                            <Avatar color="light-success" icon={<PlayCircle size={14} />} />
                                          ) : item.kitHazirlamaState == 2 ? (
                                            <Avatar color="light-danger" icon={<Pause size={14} />} />
                                          ) : item.kitHazirlamaState == 3 ? (
                                            <Avatar color="light-warning" icon={<PlayCircle size={14} />} />
                                          ) : item.kitHazirlamaState == 4 ? (
                                            <Avatar color="light-info" icon={<StopCircle size={14} />} />
                                          ) : (
                                            <Avatar color="light-success" icon={<PlayCircle size={14} />} />
                                          )
                                        ) : item.explanation === "DOKUMAN_KONTROLU" ? (
                                          item.kitDogrulamaState == 1 ? (
                                            <Avatar color="light-success" icon={<PlayCircle size={14} />} />
                                          ) : item.kitDogrulamaState == 2 ? (
                                            <Avatar color="light-danger" icon={<Pause size={14} />} />
                                          ) : item.kitDogrulamaState == 3 ? (
                                            <Avatar color="light-warning" icon={<PlayCircle size={14} />} />
                                          ) : item.kitDogrulamaState == 4 ? (
                                            <Avatar color="light-info" icon={<StopCircle size={14} />} />
                                          ) : (
                                            <Avatar color="light-success" icon={<PlayCircle size={14} />} />
                                          )
                                        ) : (
                                          <Avatar color="light-success" icon={<PlayCircle size={14} />} />
                                        )}
                                      </>
                                    </Col>

                                    <Col style={{ textAlign: 'right' }}>
                                      <Col>   <Badge color={item.active ? "light-success" : "light-danger"} style={{ cursor: "pointer" }} >{item.active ? "Aktif" : "Pasif"}</Badge>
                                      </Col>
                                      <Col style={{ marginTop: 10 }}>     <Badge color={item.content == "Standart Manual İşlemler" ? "light-info" : item.content == "Standart Kalite İşlemleri" ? "light-warning" : "light-success"} style={{ cursor: "pointer" }} >{item.content}</Badge>
                                      </Col>
                                    </Col>
                                  </Row>}
                                </div>

                              </CardBody>
                            </Card>)}


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

  );
};

export default Test;
