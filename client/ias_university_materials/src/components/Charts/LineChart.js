import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = ({ chartData, title }) => {
  // const options = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     datalabels: {
  //       anchor: 'end',
  //       align: 'top',
  //       offset: 1,
  //       font: {
  //         size: 10,
  //         weight: 'bold'
  //       },
  //       color: '#444'
  //     },
  //     legend: {
  //       position: 'top',
  //     }
  //   },
  //   scales: {
  //     y: {
  //       beginAtZero: true,
  //       grace: '5%'
  //     }
  //   }
  // };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        mode: 'index',
        intersect: false
      },
      datalabels: false,
      title: {
        display: Boolean(title),
        text: title,
        align: 'center',
        color: '#111827',
        font: {
          size: 18,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };


  return <Line data={chartData} options={options} />;
};

export default LineChart;