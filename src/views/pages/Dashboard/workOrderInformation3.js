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
import ReactApexChart from 'react-apexcharts'
import { useEffect } from 'react'
import { useState } from 'react'
const workOrderInformation3 = props => {
  // ** State
  const [name, setName] = useState([]);

  useEffect(()=>{
    if(props.data["getProductionDatesCount"]){
      let datas = [];
      props.data["getProductionDatesCount"].forEach(element => {
  
   
    datas.push([element["dates"], element["productionCount"]]);
     });
    
     setName(datas);
 
    }
  },[props.data])


  

  const series = [{
    name: props.data.uretimAdis,
    data: name
  }]

  const options = {
    chart: {
      defaultLocale: 'tr',
      locales: [{
        name: 'tr',
        options: {
          months: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
          shortMonths: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
          days: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
          shortDays:["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
          toolbar: {
            download: 'İndir',
            selection: 'Seç',
            selectionZoom: 'Seçimi Yaklaştır',
            zoomIn: 'Yaklaştır',
            zoomOut: 'Uzaklaştır',
            pan: 'Kaydır',
            reset: 'Sıfırla',
          }
        }
      }],
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom',
        tools: {
          download: false,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true | '<img src="/static/icons/reset.png" width="20">',
          customIcons: []
        },
      }
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0,
    },
    colors: ['#f1c40f'],

    markers: {
      colors: ['#f1c40f']
   },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toFixed(0);
        },
      },
      title: {
        text: ''
      },
    },
    xaxis: {
      type: 'datetime',
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return val.toFixed(0); 
        }
      }
    }

  }

  return props.data !== null ? (
    <Card style={{ height: props.height }}>
      <CardHeader className='pb-0'>
        <CardTitle tag='h3'>Gün Bazlı Üretim Verisi</CardTitle>
        {/* <UncontrolledDropdown className='chart-dropdown'>
          <DropdownToggle color='' className='bg-transparent btn-sm border-0 p-50'>
            Last 7 days
          </DropdownToggle>
          <DropdownMenu end>
            {data.last_days.map(item => (
              <DropdownItem className='w-100' key={item}>
                {item}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </UncontrolledDropdown> */}
      </CardHeader>

      <CardBody>
        <ReactApexChart  key={props.data} options={options} series={series} type="area" height={props.height-50} />

      </CardBody>
    </Card>
  ) : null
}
export default workOrderInformation3
