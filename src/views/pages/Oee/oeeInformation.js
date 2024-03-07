// ** React Imports
import { useEffect, useState } from 'react'
import Avatar from '@components/avatar'
// ** Third Party Components
import axios from 'axios'
import Chart from 'react-apexcharts'
import * as Icon from 'react-feather'
// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  CardBody,
  CardText,
  CardTitle,
  CardHeader,
  Label,
  Table
} from 'reactstrap'
import '@styles/react/libs/charts/apex-charts.scss'

const OeeInformation = props => {

  // const data =
  // {
  //   newTicket: 29,
  //   openTicket: 63,
  //   responseTime: 1,
  //   title: "Support Tracker",

  //   totalTicket: 163
  // }

  // const options = {
  //   plotOptions: {
  //     radialBar: {
  //       size: 150,
  //       offsetY: 20,
  //       startAngle: -150,
  //       endAngle: 150,
  //       hollow: {
  //         size: '65%'
  //       },
  //       track: {
  //         background: '#fff',
  //         strokeWidth: '100%'
  //       },
  //       dataLabels: {
  //         name: {
  //           offsetY: -5,
  //           fontFamily: 'Montserrat',
  //           fontSize: '1rem'
  //         },
  //         value: {
  //           offsetY: 15,
  //           fontFamily: 'Montserrat',
  //           fontSize: '1.714rem'
  //         }
  //       }
  //     }
  //   },
  //   colors: [props.danger],
  //   fill: {
  //     type: 'gradient',
  //     gradient: {
  //       shade: 'dark',
  //       type: 'horizontal',
  //       shadeIntensity: 0.5,
  //       gradientToColors: [props.primary],
  //       inverseColors: true,
  //       opacityFrom: 1,
  //       opacityTo: 1,
  //       stops: [0, 100]
  //     }
  //   },
  //   stroke: {
  //     dashArray: 8
  //   },
  //   labels: ['Toplam Vardiya Üretim']
  // },
  //   series = [value]

  // return data !== null ? (
  //   <Card style={{height:props.height}}>
  //     <CardHeader className='pb-0'>
  //       <CardTitle tag='h3'>{props.data.vardiyaUser}</CardTitle>
  //     </CardHeader>
  //        <Label style={{ marginLeft: 20 }}>{new Date( props.data.dates ).toLocaleDateString()} - {props.data.vardiyaRange}</Label>
    
  //       <Row style={{marginLeft:10}}>
  //         <Col sm='4' className='d-flex flex-column flex-wrap text-left'>
  //           <h1 className='font-large-2 fw-bolder mt-2 mb-0'>{props.data.uretimNo}</h1>
  //           <CardText>İş Emri Numarası</CardText>

  //           <div className='transaction-item' >
  //             <Row style={{marginTop:props.height>400 ? 50:0}}>
  //               <Col sm={2}><Avatar className='rounded' color={"light-primary"} icon={<Icon.Book size={18} />} /></Col>
  //               <Col sm={10}>      
  //                 <h6 >Vardiya Hedefi</h6>
  //                 <div style={{ marginTop: -10 }}>{props.data.vardiyaHedefi}</div>
  //               </Col>
  //             </Row>
      
  //             <Row style={{marginTop:props.height>400 ? 50:10}}>
  //               <Col sm={2}><Avatar className='rounded' color={"light-info"} icon={<Icon.Calendar size={18} />} /></Col>
  //               <Col sm={10}>      
  //                 <h6 >Üretilen Kart</h6>
  //                 <div style={{ marginTop: -10 }}>{props.data.uretilenKart}</div>
  //               </Col>
  //             </Row>
           
  //             <Row style={{marginTop:props.height>400 ? 50:10}}>
  //               <Col sm={2}><Avatar className='rounded' color={"light-warning"} icon={<Icon.Clock size={18} />} /></Col>
  //               <Col sm={10}>      
  //                 <h6 >Tahmini Üretilecek</h6>
  //                 <div style={{ marginTop: -10 }}>100</div>
  //               </Col>
  //             </Row>
  //           </div>

  //         </Col>
  //         <Col sm='8' className='d-flex justify-content-center'>
  //           <Chart key={props.height} options={options} series={series} type='radialBar' height={props.height-50} id='support-tracker-card' />
  //         </Col>
  //       </Row>

  //   </Card>
  // ) : null

  return(
   <>
     <Table responsive style={{ marginTop: 10 }} size="xl">
                <thead>
                  <tr>
                    <th>Tarih</th>
                    <th>Sipariş Numarası</th>
                    <th>Başlangıç</th>
                    <th>Bitiş</th>
                    <th>Mola/Yemek/temizlik</th>
                    <th>Toplam Çalışma</th>
                    <th>Toplam Duruşlar</th>
                    <th>Kullanılabilir Zaman</th>
                    <th>Kullanılabilir Zaman dk.</th>
                    <th>Yükleme Seviyesi</th>
                    <th>Teorik Hızı</th>
                    <th>Üretilebilecek Panel Adeti</th>
                    <th>Üretilen Ürün Adeti</th>
                    <th>Performans Seviyesi</th>
                    <th>Sağlam Kart Adedi</th>
                    <th>Kalite Seviyesi</th>
                    <th>OEE</th>
                  </tr>
                </thead>
                <tbody>
                  {props.data.length > 0 ? (
                    <>
                      {props.data.map((obj) => (
                        <tr
                          style={{ backgroundColor: "#7091F5", color: "white" }}
                          key={`${obj.dates}`}
                        >
                          <td style={{ color: "white" }}> {obj.dates}</td>
                          <td style={{ color: "white" }}>{obj.orderNo}</td>
                          <td style={{ color: "white" }}> {obj.startDate}</td>
                          <td style={{ color: "white" }}>{obj.endDate}</td>
                          <td style={{ color: "white" }}> {obj.break}</td>
                          <td style={{ color: "white" }}>{obj.sumStartWorkNoCountable}</td>
                          <td style={{ color: "white" }}> {obj.sumStopWork}</td>
                          <td style={{ color: "white" }}>{obj.useAbleTime}</td>
                          <td style={{ color: "white" }}>{obj.useAbleMinute}</td>
                          
   
                          <td style={{ color: "white" }}> {obj.loadingLevel}</td>
                          <td style={{ color: "white" }}>{obj.theoricSpeed}</td>
                          <td style={{ color: "white" }}>{obj.shiftTarget}</td>
                          <td style={{ color: "white" }}>{obj.productionTarget}</td>
                          <td style={{ color: "white" }}> {obj.performanceLevel}</td>
                          <td style={{ color: "white" }}>{obj.solidCardCount}</td>
                          <td style={{ color: "white" }}>{obj.qualityLevel}</td>
                          <td style={{ color: "white" }}>{obj.oee}</td>
                          
                        </tr>
                      ))}
                    </>
                  ) : null}
                </tbody>
              </Table>
  </>
  )
}
export default OeeInformation
