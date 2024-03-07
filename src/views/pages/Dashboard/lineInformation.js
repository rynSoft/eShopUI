// ** Third Party Components
import Chart from 'react-apexcharts'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardSubtitle } from 'reactstrap'
import '@styles/react/libs/charts/apex-charts.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'

const LineInformation = props => {

  const donutColors = {
    series1: '#ffe700',
    series2: '#00d4bd',
    series3: '#826bf8',
    series4: '#2b9bf4',
    series5: '#f56969'
  }

  const options = {
    legend: {
      show: props.dataElapsadTime.length==0 ? false:true,
      position: 'bottom'
    },
    labels: props.dataElapsadTime.length==0 ? ["Mevcut Değil"]:props.dataName,
    //labels: ['Operational', 'Networking', 'Hiring', 'R&D'],

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
              label: 'Durma Yüzdesi',
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
  const series = props.dataElapsadTime.length==0 ? [0]:props.dataElapsadTime.map(x => parseInt(x))
  return (
    <Card style={{ height: props.height }}>
      <CardHeader>
        <div>
          <CardTitle className='mb-75' tag='h4'>
            Hat Durma Yüzdesi
          </CardTitle>
          {/* <CardSubtitle className='text-muted'>Spending on various categories</CardSubtitle> */}
        </div>
      </CardHeader>
      <CardBody>
        <Chart key={props.height} options={options} series={series} type='donut' height={props.height - 50} />
      </CardBody>
    </Card>
  )
}

export default LineInformation
