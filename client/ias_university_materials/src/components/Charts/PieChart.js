import React from 'react';
import { Pie } from 'react-chartjs-2';
// Добавляем импорт плагина
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

// Важно: регистрируем ChartDataLabels вместе с остальными элементами
ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

const PieChart = ({ chartData, startYear, endYear, title }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 20,
          font: { size: 16 }
        }
      },
      title: {
        display: true,
        text: title,
        font: { size: 14, weight: 'bold' }
      },
      // Настройка отображения чисел поверх секторов
      datalabels: {
        display: (context) => {
          // Если значение 0, скрываем цифру, чтобы они не накладывались друг на друга
          return context.dataset.data[context.dataIndex] > 0;
        },
        color: '#fff', // Белый цвет текста для хорошего контраста
        font: {
          weight: 'bold',
          size: 13
        },
        formatter: (value) => {
          // Отображаем точное количество материалов
          return value;
        }
      }
    },
  };

  return <Pie data={chartData} options={options} />;
};

export default PieChart;