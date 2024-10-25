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
  ticket_type: string;
  agent: string;
  total_sold: number;
  total_amount: number;
}

interface LineChartProps {
  period: string; // 'day', 'week', or 'month'
}

const LineChart: React.FC<LineChartProps> = ({ period }) => {
  const [salesLogs, setSalesLogs] = useState<TicketSalesLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicketSalesLog = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get('/api/admin/ticket-sales-log/', {
          params: { period }
        });

        if (response.data && response.data.sales_log) {
          // Map the response data to the desired format
          const formattedData = response.data.sales_log.map((log: any) => ({
            ticket_type: log.ticket_type__name,
            agent: `${log.agent__first_name} ${log.agent__last_name}`,
            total_sold: log.total_sold,
            total_amount: log.total_amount
          }));
          setSalesLogs(formattedData);
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
  }, [period]);

  const ticketTypes = salesLogs.map((log) => log.ticket_type);
  const totalAmounts = salesLogs.map((log) => log.total_amount);

  const data = {
    labels: ticketTypes,
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
          text: 'Ticket Type'
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
