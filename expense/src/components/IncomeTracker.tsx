'use client';

import { useState, useEffect } from 'react';
import { Income, incomeTracker, IncomeStats } from '@/lib/incomeTracker';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

interface IncomeTrackerProps {
  expenses: Array<{ amount: number; date: string; category: string }>;
}

export default function IncomeTracker({ expenses }: IncomeTrackerProps) {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [stats, setStats] = useState<IncomeStats | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    category: 'salary' as Income['category'],
    date: new Date().toISOString().split('T')[0],
    frequency: 'monthly' as Income['frequency'],
    isRecurring: false,
    notes: ''
  });

  useEffect(() => {
    loadIncomes();
  }, []);

  useEffect(() => {
    const newStats = incomeTracker.calculateIncomeStats(expenses);
    setStats(newStats);
  }, [incomes, expenses]);

  const loadIncomes = () => {
    const allIncomes = incomeTracker.getAllIncome();
    setIncomes(allIncomes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const incomeData: Omit<Income, 'id'> = {
      source: formData.source,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      frequency: formData.frequency,
      isRecurring: formData.isRecurring,
      notes: formData.notes
    };

    if (editingIncome) {
      incomeTracker.updateIncome(editingIncome.id, incomeData);
    } else {
      incomeTracker.createIncome(incomeData);
    }

    loadIncomes();
    resetForm();
  };

  const handleEdit = (income: Income) => {
    setFormData({
      source: income.source,
      amount: income.amount.toString(),
      category: income.category,
      date: income.date,
      frequency: income.frequency,
      isRecurring: income.isRecurring,
      notes: income.notes || ''
    });
    setEditingIncome(income);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this income entry?')) {
      incomeTracker.deleteIncome(id);
      loadIncomes();
    }
  };

  const resetForm = () => {
    setFormData({
      source: '',
      amount: '',
      category: 'salary',
      date: new Date().toISOString().split('T')[0],
      frequency: 'monthly',
      isRecurring: false,
      notes: ''
    });
    setShowForm(false);
    setEditingIncome(null);
  };

  const exportToCSV = () => {
    const csv = incomeTracker.exportToCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `income-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Chart data
  const monthlyTrendData = stats ? {
    labels: stats.monthlyTrend.map(item => item.month),
    datasets: [
      {
        label: 'Income',
        data: stats.monthlyTrend.map(item => item.income),
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: stats.monthlyTrend.map(item => item.expenses),
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Net',
        data: stats.monthlyTrend.map(item => item.net),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
      }
    ]
  } : { labels: [], datasets: [] };

  const categoryData = stats ? {
    labels: stats.byCategory.map(item => item.category.charAt(0).toUpperCase() + item.category.slice(1)),
    datasets: [{
      label: 'Income by Category',
      data: stats.byCategory.map(item => item.total),
      backgroundColor: [
        'rgba(34, 197, 94, 0.6)',
        'rgba(59, 130, 246, 0.6)',
        'rgba(168, 85, 247, 0.6)',
        'rgba(245, 158, 11, 0.6)',
        'rgba(236, 72, 153, 0.6)',
      ],
    }]
  } : { labels: [], datasets: [] };

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
        <h2 className="text-2xl font-bold text-gray-900">Income Tracker</h2>
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Export CSV
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            {showForm ? 'Cancel' : 'Add Income'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-600">Total Income</h3>
            <p className="text-2xl font-bold text-green-900">${stats.totalIncome.toFixed(2)}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-600">Monthly Average</h3>
            <p className="text-2xl font-bold text-blue-900">${stats.monthlyAverage.toFixed(2)}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-600">Projected Monthly</h3>
            <p className="text-2xl font-bold text-purple-900">${incomeTracker.getProjectedMonthlyIncome().toFixed(2)}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-orange-600">Income Sources</h3>
            <p className="text-2xl font-bold text-orange-900">{stats.bySource.length}</p>
          </div>
        </div>
      )}

      {/* Income Form */}
      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingIncome ? 'Edit Income' : 'Add New Income'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <input
                type="text"
                value={formData.source}
                onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Salary, Freelance, Investment"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="salary">Salary</option>
                <option value="freelance">Freelance</option>
                <option value="investment">Investment</option>
                <option value="business">Business</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="one-time">One-time</option>
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="recurring"
                checked={formData.isRecurring}
                onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="recurring" className="text-sm text-gray-700">Recurring income</label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                {editingIncome ? 'Update Income' : 'Add Income'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Charts */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trend</h3>
            <div className="h-64">
              <Line data={monthlyTrendData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Income by Category</h3>
            <div className="h-64">
              <Bar data={categoryData} options={chartOptions} />
            </div>
          </div>
        </div>
      )}

      {/* Income List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Income</h3>
        {incomes.length === 0 ? (
          <p className="text-gray-500">No income entries yet. Add your first income above!</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {incomes.map((income) => (
              <div key={income.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium text-gray-900">{income.source}</p>
                  <p className="text-sm text-gray-500">
                    {income.category.charAt(0).toUpperCase() + income.category.slice(1)} • {income.date}
                    {income.isRecurring && ' • Recurring'}
                  </p>
                  {income.notes && (
                    <p className="text-xs text-gray-400 mt-1">{income.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-green-600">${income.amount.toFixed(2)}</span>
                  <button
                    onClick={() => handleEdit(income)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(income.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}