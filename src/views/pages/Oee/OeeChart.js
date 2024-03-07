// ** Third Party Components
import Chart from 'react-apexcharts'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardSubtitle } from 'reactstrap'
import '@styles/react/libs/charts/apex-charts.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { useEffect, useState } from 'react'

const OeeChart = (chartDatas , ooeData ) =>  {

  const { chartData } = chartDatas;
  const { ooeDatas } = ooeData;
  const [chartName, setChartName] = useState([]);
  const [chartValue, setChartVAlue] = useState([]);


  
  useEffect(() => {
    let names = [];
    let elapsedTimes = [];
    chartData.forEach(element=> {
      names.push(element["name"])
      elapsedTimes.push(element["sumElapsedTime"])
    });
    setChartName(names);
    setChartVAlue(elapsedTimes);
  }, [chartData])

  const donutColors = {

    series1: '#ffe700',
    series2: '#00d4bd',
    series3: '#826bf8',
    series4: '#2b9bf4',
    series5: '#f56969',
    series6: '#ffe700',
    series7: '#00d4bd',
    series8: '#826bf8',
    series9: '#2b9bf4',
  }

  const options = {
    legend: {
      show: true,
      position: 'bottom'
    },
    labels: chartName,
    colors: [donutColors.series1, donutColors.series3, donutColors.series5, donutColors.series2,donutColors.series1, donutColors.series3, donutColors.series5, donutColors.series2],
    dataLabels: {
      enabled: true,
      formatter(val) {
        return `${parseInt(val)}%`
      }
    },
    tooltip: {
      x: {
        show: true,
        format: 'dd MMM',
        formatter: undefined,
      },
      y: {
        formatter: undefined,
        title: {
          formatter: (seriesName) => seriesName,
        },
      },
      z: {
        formatter: undefined,
        title: 'Size: '
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            value: {
              formatter(val) {
                return `${parseInt(val)} Dk.`
              }
            },
            total: {
              show: true,
              label: 'T.DURUŞ',
              formatter(val) {
                let x = 0;
                val.config.series.forEach(element => {
                  x += element
                });
                return `${parseInt(x)} Dk.`
              }
            }
          }
        }
      }
    }

  }

  // ** Chart Series
  //const series = [85, 16, 50, 50]
  const series = chartValue.map(x => parseInt(x))
  return (
    <Card >
      <CardBody>
        <Chart options={options} series={series} type='donut' height={320} />
      </CardBody>
    </Card>
  )
}

export default OeeChart
