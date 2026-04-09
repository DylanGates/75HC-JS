'use client';

interface SummaryCardsProps {
  totalExpenses: number;
  monthlyAverage: number;
}

export default function SummaryCards({ totalExpenses, monthlyAverage }: SummaryCardsProps) {
  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Expense Tracker</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
          <p className="text-2xl font-bold text-gray-900">${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Monthly Average</h3>
          <p className="text-2xl font-bold text-gray-900">${monthlyAverage.toFixed(2)}</p>
        </div>
      </div>
    </header>
  );
}