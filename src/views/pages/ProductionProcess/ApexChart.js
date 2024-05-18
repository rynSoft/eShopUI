
import Chart from "react-apexcharts";
import React, { useState, useEffect } from "react";

const data = {
  series: [45, 55, ],
  options: {
    colors : ['', ''],
    //colors : ['#864AF9', '#F8E559','#f3ca20', '#000000'],
    chart: {
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
            enabled: true,
            delay: 150
        },
        dynamicAnimation: {
            enabled: true,
            speed: 350
        }
    }
    ,
      foreColor: '#7BC9FF',
      width: 350,
      type: 'pie',
    },
    labels: ['Tamamlanan', 'Kalan', ],
    responsive: [{
      breakpoint: 400,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  },
};

const  ApexChart = ({colorDones,colorRemains, data1, data2}) =>
 {

  data.options.colors[0] = colorDones;
  data.options.colors[1] = colorRemains;

  const data5 = {  series: [Number(data1),Number(data2) ] }
  console.log(data5.series);
  return (
    <>
      <Chart
        options={data.options}
        series={data5.series}
        type="donut"
        height= '454'
      />
    </>
  );
}
export default ApexChart;

