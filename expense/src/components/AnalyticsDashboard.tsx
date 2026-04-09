'use client';

import { useState, useEffect } from 'react';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Expense } from '@/lib/types';
import { formatCurrency } from '@/lib/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AnalyticsDashboardProps {
  expenses: Expense[];
}

interface DateRange {
  start: string;
  end: string;
}

export default function AnalyticsDashboard({ expenses }: AnalyticsDashboardProps) {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>(expenses);

  useEffect(() => {
    const filtered = expenses.filter(expense => 
      expense.date >= dateRange.start && expense.date <= dateRange.end
    );
    setFilteredExpenses(filtered);
  }, [expenses, dateRange]);

  // Weekly spending patterns
  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Average Spending',
      data: [0, 1, 2, 3, 4, 5, 6].map(day => {
        const dayExpenses = filteredExpenses.filter(expense => {
          const date = new Date(expense.date);
          return date.getDay() === day;
        });
        return dayExpenses.reduce((sum, expense) => sum + expense.amount, 0) / Math.max(1, dayExpenses.length);
      }),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    }]
  };

  // Year-over-year comparison
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;
  
  const yearlyComparison = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: `${currentYear}`,
        data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(month => {
          return filteredExpenses
            .filter(expense => {
              const date = new Date(expense.date);
              return date.getFullYear() === currentYear && date.getMonth() === month;
            })
            .reduce((sum, expense) => sum + expense.amount, 0);
        }),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
      {
        label: `${lastYear}`,
        data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(month => {
          return filteredExpenses
            .filter(expense => {
              const date = new Date(expense.date);
              return date.getFullYear() === lastYear && date.getMonth() === month;
            })
            .reduce((sum, expense) => sum + expense.amount, 0);
        }),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
      }
    ]
  };

  // Spending velocity indicator
  const calculateSpendingVelocity = () => {
    const last30Days = filteredExpenses.filter(expense => {
      const date = new Date(expense.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return date >= thirtyDaysAgo;
    });

    const previous30Days = filteredExpenses.filter(expense => {
      const date = new Date(expense.date);
      const sixtyDaysAgo = new Date();
      const thirtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return date >= sixtyDaysAgo && date < thirtyDaysAgo;
    });

    const currentTotal = last30Days.reduce((sum, expense) => sum + expense.amount, 0);
    const previousTotal = previous30Days.reduce((sum, expense) => sum + expense.amount, 0);
    
    const velocity = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;
    
    return {
      current: currentTotal,
      previous: previousTotal,
      velocity,
      trend: velocity > 10 ? 'increasing' : velocity < -10 ? 'decreasing' : 'stable'
    };
  };

  const velocity = calculateSpendingVelocity();

  // Predictive spending forecast (simplified)
  const forecastData = {
    labels: ['Current', 'Next Month', '2 Months', '3 Months'],
    datasets: [{
      label: 'Spending Forecast',
      data: [
        velocity.current,
        velocity.current * 1.02, // 2% increase
        velocity.current * 1.04, // 4% increase
        velocity.current * 1.06, // 6% increase
      ],
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 2,
    }]
  };

  // Category breakdown with percentages
  const categoryTotals = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as { [key: string]: number });

  const totalSpending = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

  const categoryData = {
    labels: Object.keys(categoryTotals).map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
    datasets: [{
      data: Object.values(categoryTotals),
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#FF6384',
      ],
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
        <div className="flex gap-2">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          />
          <span className="self-center text-gray-500">to</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-600">Total Spending</h3>
          <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalSpending)}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-600">30-Day Velocity</h3>
          <p className="text-2xl font-bold text-green-900">
            {velocity.velocity > 0 ? '+' : ''}{velocity.velocity.toFixed(1)}%
          </p>
          <p className="text-xs text-green-600 capitalize">{velocity.trend}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-600">Avg Daily</h3>
          <p className="text-2xl font-bold text-purple-900">
            {formatCurrency(velocity.current / 30)}
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-orange-600">Categories</h3>
          <p className="text-2xl font-bold text-orange-900">{Object.keys(categoryTotals).length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Weekly Spending Patterns */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Spending Patterns</h3>
          <div className="h-64">
            <Bar data={weeklyData} options={chartOptions} />
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
          <div className="h-64">
            <Doughnut data={categoryData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Year-over-Year Comparison */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Year-over-Year Comparison</h3>
          <div className="h-64">
            <Line data={yearlyComparison} options={chartOptions} />
          </div>
        </div>

        {/* Spending Forecast */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Forecast</h3>
          <div className="h-64">
            <Line data={forecastData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Detailed Category Breakdown */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(categoryTotals).map(([category, amount]) => {
            const percentage = totalSpending > 0 ? (amount / totalSpending) * 100 : 0;
            return (
              <div key={category} className="bg-white p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900 capitalize">{category}</span>
                  <span className="text-sm text-gray-500">{percentage.toFixed(1)}%</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(amount)}</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}