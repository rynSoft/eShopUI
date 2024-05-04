import React from "react";
import Chart from "react-apexcharts";

const data = {
  series: [45, 55, ],
  options: {
    colors : ['#f3ca20', '#000000'],
    chart: {
      width: 380,
      type: 'pie',
    },
    labels: ['Tamamlanan', 'Kalan', ],
    responsive: [{
      breakpoint: 480,
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
function ApexChart() {
  return (
    <>
      <Chart
        options={data.options}
        series={data.series}
        type="pie"
        height={350}
      />
    </>
  );
}
export default ApexChart;