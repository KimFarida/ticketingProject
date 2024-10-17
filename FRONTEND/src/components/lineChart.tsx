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
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  transactions: Array<{ date: string; amount: number }>;
}

const LineChart: React.FC<LineChartProps> = ({ transactions }) => {
  
  const dates = transactions.map((transaction) => transaction.date);
  const amounts = transactions.map((transaction) => transaction.amount);

  const data = {
    labels: dates, 
    datasets: [
      {
        label: 'Transaction Amount',
        data: amounts, 
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.4, // Curved lines
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(75,192,192,1)',
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Amount (USD)'
        },
        beginAtZero: true
      }
    }
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
