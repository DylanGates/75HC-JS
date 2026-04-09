# Advanced Expense Tracker

A comprehensive expense tracking application built with Next.js 16.2.3, React 19.2.4, TypeScript, and Chart.js. Features advanced analytics, offline functionality, PDF export, and comprehensive budget management.

## 🚀 Features

### Core Features
- **Expense Tracking**: Add, edit, and delete expenses with categories
- **Interactive Charts**: Visual spending analysis using Chart.js
- **Real-time Updates**: Instant UI updates with expense changes
- **Responsive Design**: Mobile-first responsive interface
- **Data Persistence**: Local storage with hybrid SQLite integration

### Advanced Features
- **SQLite Database**: Full database integration with better-sqlite3
- **Offline Functionality**: Service worker and IndexedDB for offline access
- **PDF Export**: Professional expense reports with @react-pdf/renderer
- **Data Validation**: Comprehensive validation and error handling
- **Receipt Management**: File upload and image compression for receipts
- **Budget Goals**: Set and track budget limits with alerts
- **Income Tracking**: Track income sources alongside expenses
- **Advanced Analytics**: Weekly patterns, year-over-year comparisons, forecasts
- **Data Export/Import**: CSV, PDF, Excel formats with bank statement import
- **Multi-tab Interface**: Overview, Analytics, Budget, and Income tabs

## 🛠️ Technology Stack

- **Frontend**: Next.js 16.2.3, React 19.2.4, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Database**: SQLite with better-sqlite3
- **PDF Generation**: @react-pdf/renderer
- **Storage**: IndexedDB, localStorage, SQLite hybrid system
- **Package Manager**: Bun (configured for pnpm compatibility)

## 📦 Installation & Setup

1. **Clone and Navigate**:
   ```bash
   cd /Users/admin/Projects/75HC/75HC-JS/expense
   ```

2. **Install Dependencies**:
   ```bash
   bun install
   ```

3. **Run Development Server**:
   ```bash
   bun dev
   ```

4. **Open Application**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Usage Guide

### Adding Expenses
1. Fill in the expense form with description, amount, category, and date
2. Click "Add Expense" to save
3. View real-time updates in charts and summaries

### Analytics Dashboard
- **Overview Tab**: Summary cards and basic charts
- **Analytics Tab**: Advanced charts with date filtering
- **Budget Tab**: Budget goals and progress tracking
- **Income Tab**: Income tracking and net calculations

### PDF Export
1. Click "Export to PDF" button
2. Generate professional expense reports
3. Download or share reports

### Offline Mode
- Automatic offline detection
- Data synchronization when back online
- Full functionality without internet connection

## 🔧 Architecture

### Data Storage
- **Hybrid System**: SQLite for structured data, localStorage for quick access
- **Offline Sync**: IndexedDB for offline data persistence
- **Backup/Restore**: Database serialization for data protection

### Component Structure
```
src/
├── app/                    # Next.js app directory
│   └── page.tsx            # Main application component
├── components/             # React components
│   ├── AnalyticsDashboard  # Advanced analytics
│   ├── BudgetGoals         # Budget management
│   ├── CategoryChart       # Category breakdown charts
│   ├── ExpenseForm         # Add/edit expense form
│   ├── ExpenseList         # Expense display list
│   ├── IncomeTracker       # Income tracking
│   ├── PDFExportButton     # PDF export functionality
│   ├── ReceiptUpload       # File upload component
│   ├── SummaryCards        # Summary statistics
│   └── TrendChart          # Spending trend charts
├── hooks/                  # Custom React hooks
│   └── useLocalStorage     # Local storage management
├── lib/                    # Utility libraries
│   ├── budgetManager       # Budget goal management
│   ├── database            # SQLite operations
│   ├── incomeTracker       # Income calculations
│   ├── offlineData         # Offline data management
│   ├── receiptManager      # Receipt file handling
│   ├── types               # TypeScript definitions
│   └── validation          # Data validation
└── public/                 # Static assets
    └── service-worker.js   # Offline functionality
```

## 📈 Chart Types

- **Category Breakdown**: Pie chart showing spending by category
- **Monthly Trends**: Line chart tracking spending over time
- **Weekly Patterns**: Bar chart showing daily spending habits
- **Year-over-Year**: Comparative analysis across years
- **Spending Velocity**: Rate of spending indicators
- **Predictive Forecasts**: Future spending predictions

## 🎯 Budget Management

- **Category Budgets**: Set limits for each spending category
- **Visual Progress**: Progress bars showing budget usage
- **Alert System**: Notifications when approaching limits
- **Budget vs Actual**: Compare planned vs actual spending

## 💰 Income Tracking

- **Income Sources**: Track multiple income streams
- **Recurring Income**: Handle regular income patterns
- **Net Calculations**: Calculate savings/income ratios
- **Trend Analysis**: Monthly income vs expense comparisons

## 🔄 Data Export/Import

### Export Formats
- **PDF**: Professional reports with charts
- **CSV**: Raw data for spreadsheet analysis
- **Excel**: Formatted spreadsheet export

### Import Features
- **Bank Statements**: CSV import from banks
- **Data Validation**: Automatic validation of imported data
- **Duplicate Detection**: Prevent duplicate entries

## 🛡️ Error Handling

- **Validation**: Comprehensive data validation
- **Error Categorization**: Different error types with appropriate handling
- **User Feedback**: Clear error messages and recovery suggestions
- **Graceful Degradation**: App continues functioning with errors

## 🚀 Performance Features

- **Lazy Loading**: Components load on demand
- **Memoization**: Optimized re-renders
- **Image Compression**: Automatic receipt image optimization
- **Efficient Storage**: Optimized data structures

## 📱 Mobile Experience

- **Responsive Design**: Optimized for all screen sizes
- **Touch-Friendly**: Large touch targets and gestures
- **Offline First**: Works seamlessly offline
- **Fast Loading**: Optimized for mobile networks

## 🔒 Security

- **Local Storage**: All data stored locally
- **No External APIs**: No data sent to external servers
- **File Validation**: Secure file upload handling
- **Input Sanitization**: Protected against XSS attacks

## 🧪 Development

### TypeScript
- Strict type checking enabled
- Comprehensive type definitions
- Error-free compilation

### Testing
- Run TypeScript compilation: `bun tsc --noEmit`
- Development server: `bun dev`
- Production build: `bun build`

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🐛 Bug Reports

Please report issues with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information

---

**Built with ❤️ using Next.js, React, TypeScript, and Chart.js**