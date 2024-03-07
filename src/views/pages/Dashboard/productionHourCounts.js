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
import { useEffect, useState } from 'react'
const ProductionHourCount = props => {
  const [name, setName] = useState([]);
  const [elapsadTime, setElapsadTime] = useState([]);
  useEffect(()=>{
    if(props.data["getProductionHoursCount"]){
      props.data["getProductionHoursCount"].sort(function(a, b) { 
        return a.hour - b.hour;
    })
      let names = [];
      let elapsedTimes = [];
      props.data["getProductionHoursCount"].forEach(element => {
      
        names.push(element["hour"]);
        elapsedTimes.push(
          element["productionCount"]
        );
     });
  
     setName(names);
     setElapsadTime(elapsedTimes);
    }
  },[props.data])


  const options = {
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false
      },
      toolbar:{
        show: false,
      },

      
    },
    colors: ['#e74c3c'],
    dataLabels: {
      enabled: false
    },

    stroke: {
      curve: 'straight'
    },
    markers: {
      colors: ['#e74c3c']
   },
    grid: {
      row: {
        colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      },
    },


    xaxis: {
      categories:   name,
      labels: {
        formatter: function (value) {
          return value +":00";
        }
      }

    },  
      tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return val +" Adet"; 
        }
      }
    }
  }
  const data = [{
    name: props.data.uretimAdis,
    data: elapsadTime
  }]

  return data !== null ? (
    <Card style={{ height: props.height }}>
      <CardHeader className='pb-0'>
        <CardTitle tag='h3'>Saat Bazlı Üretim Verisi</CardTitle>

      </CardHeader>

      <CardBody>


        <ReactApexChart  key={props.data} options={options} series={data} type="line" height={props.height -50} />


      </CardBody>
    </Card>
  ) : null
}
export default ProductionHourCount
