'use client';

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryChartProps {
  expenses: Array<{
    id: string;
    description: string;
    amount: number;
    category: string;
    date: string;
  }>;
}

const categories = [
  { value: 'food', label: 'Food' },
  { value: 'transport', label: 'Transport' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'health', label: 'Health' },
  { value: 'other', label: 'Other' },
];

export default function CategoryChart({ expenses }: CategoryChartProps) {
  const categoryData = {
    labels: categories.map(cat => cat.label),
    datasets: [
      {
        data: categories.map(cat => {
          return expenses
            .filter(expense => expense.category === cat.value)
            .reduce((sum, expense) => sum + expense.amount, 0);
        }),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
        ],
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
      <div className="h-64">
        <Pie 
          data={categoryData} 
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