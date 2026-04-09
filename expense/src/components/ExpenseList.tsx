'use client';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  searchTerm: string;
  categoryFilter: string;
  onSearchChange: (term: string) => void;
  onCategoryFilterChange: (category: string) => void;
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

export default function ExpenseList({
  expenses,
  onDeleteExpense,
  searchTerm,
  categoryFilter,
  onSearchChange,
  onCategoryFilterChange,
}: ExpenseListProps) {
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filteredExpenses.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No expenses found</p>
        ) : (
          filteredExpenses.map(expense => (
            <div key={expense.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <div>
                <p className="font-medium text-gray-900">{expense.description}</p>
                <p className="text-sm text-gray-500">
                  {categories.find(cat => cat.value === expense.category)?.label} • {expense.date}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">${expense.amount.toFixed(2)}</span>
                <button
                  onClick={() => onDeleteExpense(expense.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}