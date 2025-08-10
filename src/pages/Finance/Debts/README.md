# Finance Debts Module

This module has been refactored from a single large `Debts.tsx` file into a clean, modular structure following the same pattern as the `OfferCreation` module.

## 📁 Directory Structure

```
src/pages/Finance/Debts/
├── components/           # 7 reusable UI components
│   ├── Header.tsx       # Page header with title and export button
│   ├── SummaryCards.tsx # Summary statistics cards
│   ├── CriticalDebtsAlert.tsx # Warning banner for critical debts
│   ├── SearchAndFilters.tsx # Search and filtering interface
│   ├── DebtsTable.tsx   # Table display for debt offers
│   ├── EmptyState.tsx   # Empty state display
│   ├── Pagination.tsx   # Pagination controls
│   └── index.ts         # Component exports
├── hooks/               # 4 custom React hooks
│   ├── useDebtOffers.ts # Manages debt offers data and state
│   ├── useDebtFilters.ts # Handles search and filtering logic
│   ├── useDebtPagination.ts # Manages pagination state and logic
│   ├── useDebtActions.ts # Handles user actions and operations
│   └── index.ts         # Hook exports
├── utils/               # 3 utility files
│   ├── types.ts         # TypeScript interfaces and types
│   ├── constants.ts     # Mock data and configuration
│   ├── helpers.ts       # Utility functions and calculations
│   └── index.ts         # Utility exports
├── Debts.tsx            # Main component (orchestrates everything)
└── README.md            # This documentation
```

## 🧩 Components

### Header
- Page title and description
- Export to Excel button

### SummaryCards
- Total outstanding amount
- Critical debts count
- Average debt amount
- Collection rate percentage

### CriticalDebtsAlert
- Warning banner for critical payment statuses
- Only shows when critical debts exist

### SearchAndFilters
- Search input for offers, codes, and clients
- Advanced filters for client, urgency level, status, and amount range
- Toggle filters visibility
- Clear all filters functionality

### DebtsTable
- Responsive table displaying all debt information
- Columns: Offer details, client, amounts, payment progress, urgency, days overdue
- Hover effects and proper formatting

### EmptyState
- Displayed when no debts match search/filter criteria
- Informative message with icon

### Pagination
- Page navigation controls
- Shows current page info and total items
- Previous/next buttons with proper disabled states

## 🎣 Custom Hooks

### useDebtOffers
- Manages debt offers data
- Handles filtered offers state
- Provides update functions

### useDebtFilters
- Manages search term and filter state
- Applies filtering logic to offers
- Handles filter changes and clearing

### useDebtPagination
- Manages pagination state
- Calculates page information
- Provides navigation functions

### useDebtActions
- Handles user actions like export, reminders, marking as paid
- Placeholder for future functionality

## 🛠️ Utilities

### Types
- `DebtOffer`: Main debt offer interface
- `DebtFilters`: Filter configuration interface
- `PaginationState`: Pagination state interface
- `DebtSummary`: Summary statistics interface

### Constants
- `mockDebtOffers`: Sample data for development
- `filterOptions`: Available filter options
- `ITEMS_PER_PAGE`: Pagination configuration

### Helpers
- `getUrgencyColor`: Returns CSS classes for urgency levels
- `getStatusColor`: Returns CSS classes for status types
- `getPaymentProgressColor`: Returns progress bar colors
- `calculateDebtSummary`: Calculates summary statistics
- `formatCurrency`: Formats currency amounts
- `formatDate`: Formats date strings

## 🔄 Main Component

The main `Debts.tsx` component:
- Orchestrates all hooks and components
- Manages data flow between components
- Handles state updates and side effects
- Maintains clean separation of concerns

## 📊 Features

- **Responsive Design**: Works on all screen sizes
- **Advanced Filtering**: Multiple filter criteria with search
- **Real-time Updates**: Filters update results immediately
- **Pagination**: Efficient data display with navigation
- **Summary Statistics**: Key metrics always visible
- **Critical Debt Alerts**: Prominent warnings for urgent cases
- **Export Functionality**: Excel export capability
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🚀 Benefits of Refactoring

1. **Maintainability**: Each component has a single responsibility
2. **Reusability**: Components can be used in other parts of the application
3. **Testability**: Individual components and hooks can be tested in isolation
4. **Readability**: Main component is now only ~80 lines vs. 600+ lines
5. **Scalability**: Easy to add new features or modify existing ones
6. **Consistency**: Follows the same pattern as other modules in the application

## 🔧 Usage

The module is used exactly the same way as before - simply import from `src/pages/Finance/Debts.tsx`. The refactoring is completely transparent to the rest of the application.

## 📝 Future Enhancements

- Add debt reminder functionality
- Implement mark as paid actions
- Add debt history tracking
- Create debt analytics dashboard
- Add bulk actions for multiple debts
- Implement debt aging reports
