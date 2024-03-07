// ** React Imports

import Chart from 'react-apexcharts'
import Avatar from '@components/avatar'
import * as Icon from 'react-feather'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  CardBody,
  CardText,
  Label,
  CardTitle,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap'


// ** Styles
import '@styles/react/libs/charts/apex-charts.scss'
const workOrderInformation = props => {
  // ** State

  
  const value = props.data.length==0 ?0:
              Math.round((props.data.toplamUretilenKart / props.data.toplamUretilecekKart ) * 100 ) ;
   
  const data = 
  {

      last_days: ['Last 28 Days', 'Last Month', 'Last Year'],
  newTicket: 29,
  openTicket: 63,
  responseTime: 1,
  title: "Support Tracker",
  totalTicket: 163
    }

  const options = {
      plotOptions: {
        radialBar: {
          size: 150,
          offsetY: 20,
          startAngle: -150,
          endAngle: 150,
          
          hollow: {
            size: '65%'
          },
          track: {
            background: '#fff',
            strokeWidth: '100%'
          },
          dataLabels: {
            name: {
              offsetY: -5,
              fontFamily: 'Montserrat',
              fontSize: '1rem'
            },
            value: {
              offsetY: 15,
              fontFamily: 'Montserrat',
              fontSize: '1.714rem'
            }
          }
        }
      },

      colors: ["#ffffff"],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.5,
       
          gradientToColors: [ "#FF0000"],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      stroke: {
        dashArray: 8
      },
      labels: ['Tamamlanan Üretim Adedi']
    },
  
    series = [value]

  return data !== null ? (
    <Card style={{height:props.height}}>
      <CardHeader className='pb-0'>
        <CardTitle tag='h3'>{props.data.uretimAdis}</CardTitle>
      </CardHeader>
      <Label style={{ marginLeft: 30 }}>Üretim Adı</Label>
      <Row style={{marginLeft:10}}>
      <Col sm='4' className='d-flex flex-column flex-wrap text-left'>
      <h1 className='font-large-2 fw-bolder mt-2 mb-0'>{props.data.toplamUretilecekKart}</h1>
            <CardText>İş Emri Adedi</CardText>
            <div className='transaction-item'>
              <Row style={{marginTop:props.height>400 ? 50:0}}>
                <Col sm={2}><Avatar className='rounded' color={"light-primary"} icon={<Icon.Book size={18} />} /></Col>
                <Col sm={10}>      
                  <h6 >Üretilen Kart</h6>
                  <div style={{ marginTop: -10 }}>{props.data.toplamUretilenKart}</div>
                </Col>
              </Row>
      
              <Row style={{marginTop:props.height>400 ? 50:10}}>
                <Col sm={2}><Avatar className='rounded' color={"light-info"} icon={<Icon.Calendar size={18} />} /></Col>
                <Col sm={10}>      
                  <h6 >Kalan Kart</h6>
                  <div style={{ marginTop: -10 }}>{props.data.kalanKart}</div>
                </Col>
              </Row>
           
              {/* <Row style={{marginTop:props.height>400 ? 50:10}}>
                <Col sm={2}><Avatar className='rounded' color={"light-warning"} icon={<Icon.Clock size={18} />} /></Col>
                <Col sm={10}>      
                  <h6 >Tahmini Üretilecek</h6>
                  <div style={{ marginTop: -10 }}>{props.data.toplamUretilecekKart}</div>
                </Col>
              </Row> */}
            </div>
          </Col>
          <Col sm='8' className='d-flex justify-content-center'>
            <Chart key={props.height} options={options} series={series} type='radialBar' height={props.height-50} id='support-tracker-card' />
          </Col>
      </Row>
      
        
      
    
      

    </Card>
  ) : null
}
export default workOrderInformation
