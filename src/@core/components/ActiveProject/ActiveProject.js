// ** Third Party Components
import Chart from 'react-apexcharts'
import { MoreVertical } from 'react-feather'
import React from "react";
// ** Reactstrap Imports
import {
    Card,
    CardBody,
    CardText,
    CardTitle,
    CardHeader,
    DropdownMenu,
    DropdownItem,
    DropdownToggle,
    UncontrolledDropdown,
    Progress,
    Col,
    Row
} from 'reactstrap'

const ActiveProject = ({projectsArr}) => {
    const renderStates = () => {
        return projectsArr.map(state => {
            return (
                <Row className='align-items-center mb-2'>
                    <Col sm={6} key={state.title}>
                        <div className='d-flex'>
                            <img className='rounded me-1' src={state.img} height='30'/>
                            <div className='d-flex flex-column'>
                                <span className='text-truncate fw-bolder'>{state.title}</span>
                                <small className='text-muted'>{state.subtitle}</small>
                            </div>
                        </div>
                    </Col>
                    <Col >
                        <Row className='align-items-center'>
                            <Col sm={8}>
                                <div className='d-flex align-items-center'>
                                    <div className='d-flex flex-column w-100'>

                                        <Progress
                                            value={state.progress}
                                            style={{ height: '6px' }}
                                            className={`w-100 progress-bar-${state.progressColor}`}
                                        />
                                    </div>
                                </div>
                            </Col>
                            <Col sm={4} >
                                <div className='fw-bold text-body-heading me-1'>{`${state.progress}%`}</div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            )
        })
    }

    return (
        <Card className='card-browser-states' style={{ height: "82vh" }}>
            <CardHeader>
                <div>
                    <CardTitle tag='h4'>Rota Süreç Özet Bilgileri</CardTitle>
                    {/* <CardText className='font-small-2'>Mart 28 2024</CardText> */}
                </div>
                <UncontrolledDropdown className='chart-dropdown'>
                    <DropdownToggle color='' className='bg-transparent btn-sm border-0 p-50'>
                        <MoreVertical size={18} className='cursor-pointer' />
                    </DropdownToggle>
                    <DropdownMenu end>
                        <DropdownItem className='w-100'>Last 28 Days</DropdownItem>
                        <DropdownItem className='w-100'>Last Month</DropdownItem>
                        <DropdownItem className='w-100'>Last Year</DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </CardHeader>
            <CardBody>{renderStates()}</CardBody>
        </Card>
    )
}

export default ActiveProject

