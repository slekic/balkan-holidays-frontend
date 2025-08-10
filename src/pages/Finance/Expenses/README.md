# Expenses Module

This module follows the same organizational pattern as the Archive module, with a clear separation of concerns and reusable components.

## Structure

```
Expenses/
├── components/          # React components
│   ├── Header.tsx      # Page header with title and export button
│   ├── SummaryCard.tsx # Summary statistics display
│   ├── SearchAndFilters.tsx # Search and filtering interface
│   ├── ExpensesTable.tsx    # Main expenses table
│   ├── EmptyState.tsx       # Empty state display
│   ├── Pagination.tsx       # Pagination controls
│   ├── Expenses.tsx         # Main component orchestrator
│   └── index.ts             # Component exports
├── hooks/              # Custom React hooks
│   ├── useExpenses.ts           # Main expenses state management
│   ├── useExpenseFilters.ts     # Search and filtering logic
│   ├── useExpensePagination.ts # Pagination state management
│   ├── useExpenseActions.ts     # Action handlers
│   └── index.ts                 # Hook exports
├── utils/              # Utility functions and types
│   ├── types.ts        # TypeScript interfaces and types
│   ├── constants.ts    # Constants and configuration
│   ├── helpers.ts      # Helper functions
│   └── index.ts        # Utility exports
├── data/               # Mock data and data sources
│   └── mockData.ts     # Sample expense data
├── Expenses.tsx        # Main component entry point
└── README.md           # This file
```

## Components

### Header
- Displays page title and description
- Contains export to Excel button

### SummaryCard
- Shows total expenses, count, and average amount
- Displays key metrics in a grid layout

### SearchAndFilters
- Search input for text-based filtering
- Advanced filters for entity type, client, creator, dates
- Collapsible filter panel

### ExpensesTable
- Main data table displaying all expense information
- Responsive design with proper overflow handling
- Entity type badges with icons and colors

### EmptyState
- Displayed when no expenses match current filters
- Provides guidance for users

### Pagination
- Page navigation controls
- Shows current page info and navigation buttons

## Hooks

### useExpenses
- Manages expenses data state
- Handles data fetching (currently mock data)

### useExpenseFilters
- Manages search term and filter state
- Applies filters to expenses data
- Provides filter change handlers

### useExpensePagination
- Manages pagination state
- Calculates pagination values
- Provides navigation functions

### useExpenseActions
- Handles expense-related actions
- File viewing, export, edit, delete operations

## Utils

### Types
- `Expense` interface for expense data
- `ExpenseFilters` for filter state
- `PaginationState` for pagination data
- `ExpenseSummary` for summary statistics

### Constants
- Entity type icons and colors
- Entity type labels
- Mock data arrays
- Configuration values

### Helpers
- `calculateExpenseSummary` - calculates summary statistics
- `filterExpenses` - applies filters and search
- `paginateExpenses` - handles pagination logic

## Data

### Mock Data
- Sample expense records for development
- Covers all entity types
- Includes various scenarios and edge cases

## Usage

The main `Expenses.tsx` component orchestrates all the pieces:

```tsx
import Expenses from "./Expenses";

// Use in your app
<Expenses />
```

## Benefits of This Structure

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Components can be easily reused in other parts of the app
3. **Maintainability**: Clear organization makes code easier to maintain
4. **Testability**: Individual components and hooks can be tested in isolation
5. **Scalability**: Easy to add new features or modify existing ones
6. **Consistency**: Follows the same pattern as other modules in the app

