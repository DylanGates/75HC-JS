'use client';

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TrendChartProps {
  expenses: Array<{
    id: string;
    description: string;
    amount: number;
    category: string;
    date: string;
  }>;
}

export default function TrendChart({ expenses }: TrendChartProps) {
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Monthly Expenses',
        data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(month => {
          return expenses
            .filter(expense => {
              const expenseMonth = new Date(expense.date).getMonth();
              return expenseMonth === month;
            })
            .reduce((sum, expense) => sum + expense.amount, 0);
        }),
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trend</h3>
      <div className="h-64">
        <Line 
          data={monthlyData} 
          options={{ 
            responsive: true, 
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom' as const,
              }
            }
          }} 
        />
      </div>
    </div>
  );
}