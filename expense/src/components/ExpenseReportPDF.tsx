'use client';

import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Expense } from '@/lib/types';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  summaryCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e9ecef',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
  },
  headerCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#495057',
  },
  categoryBadge: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '4 8',
    borderRadius: 4,
    fontSize: 10,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#666',
  },
});

interface ExpenseReportPDFProps {
  expenses: Expense[];
  totalExpenses: number;
  monthlyAverage: number;
  startDate?: string;
  endDate?: string;
}

function ExpenseReportPDF({ expenses, totalExpenses, monthlyAverage, startDate, endDate }: ExpenseReportPDFProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      food: '#FF6384',
      transport: '#36A2EB',
      utilities: '#FFCE56',
      entertainment: '#4BC0C0',
      shopping: '#9966FF',
      health: '#FF9F40',
      other: '#FF6384',
    };
    return colors[category] || '#6c757d';
  };

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as { [key: string]: number });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Expense Report</Text>
          <Text style={styles.subtitle}>
            Generated on {new Date().toLocaleDateString()}
          </Text>
          {startDate && endDate && (
            <Text style={styles.subtitle}>
              Period: {formatDate(startDate)} - {formatDate(endDate)}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>Total Expenses</Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalExpenses)}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>Monthly Average</Text>
            <Text style={styles.summaryValue}>{formatCurrency(monthlyAverage)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expenses by Category</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>Category</Text>
              <Text style={styles.headerCell}>Amount</Text>
              <Text style={styles.headerCell}>Percentage</Text>
            </View>
            {Object.entries(categoryTotals).map(([category, amount]) => (
              <View key={category} style={styles.tableRow}>
                <Text style={styles.tableCell}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
                <Text style={styles.tableCell}>{formatCurrency(amount)}</Text>
                <Text style={styles.tableCell}>
                  {((amount / totalExpenses) * 100).toFixed(1)}%
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detailed Expenses</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>Date</Text>
              <Text style={styles.headerCell}>Description</Text>
              <Text style={styles.headerCell}>Category</Text>
              <Text style={styles.headerCell}>Amount</Text>
            </View>
            {expenses.map((expense) => (
              <View key={expense.id} style={styles.tableRow}>
                <Text style={styles.tableCell}>{formatDate(expense.date)}</Text>
                <Text style={styles.tableCell}>{expense.description}</Text>
                <View style={styles.tableCell}>
                  <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(expense.category) }]}>
                    <Text style={{ color: 'white', fontSize: 10 }}>
                      {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.tableCell}>{formatCurrency(expense.amount)}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.footer}>
          Generated by Expense Tracker - {new Date().toLocaleDateString()}
        </Text>
      </Page>
    </Document>
  );
}

export default ExpenseReportPDF;