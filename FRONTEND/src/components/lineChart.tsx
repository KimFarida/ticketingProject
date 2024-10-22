import React, { useEffect, useState } from 'react';
import axios from 'axios';
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

interface TicketSalesLog {
  date: string;
  ticket_type: string;
  agent: string;
  total_sold: number;
  total_amount: number;
}

interface LineChartProps {
  period: string; // 'day', 'week', or 'month'
  date: string; // Date in YYYY-MM-DD format
  agentId?: string; // Optional agent ID filter
}

const LineChart: React.FC<LineChartProps> = ({ period, date, agentId }) => {
  const [salesLogs, setSalesLogs] = useState<TicketSalesLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicketSalesLog = async () => {
      setLoading(true);
      setError(null);

      const params = {
        period,
        date,
        agent_id: agentId,
        format: 'json'
      };

      try {
        const response = await axios.get('/api/admin/ticket-sales-log/', { params });
        if (response.data && Array.isArray(response.data.data)) {
          setSalesLogs(response.data.data);
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (err) {
        console.error('Error fetching ticket sales log:', err);
        setError('Failed to load ticket sales data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTicketSalesLog();
  }, [period, date, agentId]);

  const dates = salesLogs.map((log) => log.date);
  const totalAmounts = salesLogs.map((log) => log.total_amount);

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Total Amount Sold',
        data: totalAmounts,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.4,
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
          text: 'Total Amount (USD)'
        },
        beginAtZero: true
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl mb-4">Ticket Sales Log</h2>
      {loading ? (
        <p>Loading sales data...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <Line data={data} options={options} />
      )}
    </div>
  );
};

export default LineChart;
