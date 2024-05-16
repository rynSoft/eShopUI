
import Chart from "react-apexcharts";
import React, { useState, useEffect } from "react";

const data = {
  series: [45, 55, ],
  options: {
    
    colors : ['#f3ca20', '#000000'],
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

const  ApexChartSecond = ({
  colorDones,
  colorRemains
}) =>
 {

  const [colorDone, setcolorDone] = React.useState(colorDones);
  const [colorRemain, setcolorRemain] = React.useState(colorRemains);
  data.options.colors[0] = colorDone;
  data.options.colors[1] = colorRemain;

  console.log(data.options.colors[0]);
  console.log(data.options.colors[1]);

  return (
    <>
      <Chart
        options={data.options}
        series={data.series}
        type="pie"
        height= '454'
   
      />
    </>
  );
}
export default ApexChartSecond;

