# Finance Archive Module

This module has been refactored from a single large component into a clean, modular structure following the same pattern as the OfferCreation module.

## Structure

```
src/pages/Finance/
├── components/           # Reusable UI components
│   ├── Header.tsx       # Page header with title and export button
│   ├── SearchAndFilters.tsx # Search and filtering interface
│   ├── OffersGrid.tsx   # Grid layout for finance offers
│   ├── FinanceOfferCard.tsx # Individual offer card component
│   ├── EmptyState.tsx   # Empty state display
│   ├── Pagination.tsx   # Pagination controls
│   └── index.ts         # Component exports
├── hooks/               # Custom React hooks
│   ├── useFinanceOffers.ts # Manages offers data and state
│   ├── useFinanceFilters.ts # Handles search and filtering
│   ├── useFinancePagination.ts # Manages pagination
│   ├── useFinanceActions.ts # Handles user actions
│   └── index.ts         # Hook exports
├── utils/               # Utility functions and constants
│   ├── types.ts         # TypeScript interfaces and types
│   ├── constants.ts     # Mock data and configuration
│   ├── helpers.ts       # Utility functions
│   └── index.ts         # Utility exports
├── FinanceArchive.tsx   # Main component (orchestrates everything)
└── README.md            # This file
```

## Components

### Header
- Displays page title and description
- Contains export to Excel button

### SearchAndFilters
- Search input for offer name/code
- Advanced filters for client, status, payment status, etc.
- Toggle to show/hide advanced filters

### FinanceOfferCard
- Individual offer display card
- Shows offer details, payment progress, and actions
- Handles invoice generation actions

### OffersGrid
- Grid layout for multiple offer cards
- Responsive design (1 column on mobile, 2 on desktop)

### Pagination
- Page navigation controls
- Shows current page info and navigation buttons

### EmptyState
- Displayed when no offers match current filters
- Customizable message and description

## Hooks

### useFinanceOffers
- Manages offers data and state
- Calculates totals (value, paid, outstanding)
- Provides filtered offers management

### useFinanceFilters
- Handles search functionality
- Manages filter state and logic
- Applies filters to offers data

### useFinancePagination
- Manages pagination state
- Handles page navigation
- Automatically resets to first page when filters change

### useFinanceActions
- Handles user actions (view, edit, duplicate, etc.)
- Manages invoice generation actions
- Handles Excel export functionality

## Utilities

### Types
- `FinanceOffer` interface
- `FinanceFilters` interface
- `PaginationState` interface
- `ActionType` union type

### Constants
- Mock data for development
- Filter options
- Configuration constants

### Helpers
- Status color functions
- Payment progress calculation
- Currency and date formatting

## Benefits of This Structure

1. **Maintainability**: Each component has a single responsibility
2. **Reusability**: Components can be easily reused in other parts of the app
3. **Testability**: Individual components and hooks can be tested in isolation
4. **Readability**: Main component is clean and easy to understand
5. **Scalability**: Easy to add new features or modify existing ones
6. **Consistency**: Follows the same pattern as other modules in the app

## Usage

The main `FinanceArchive` component orchestrates all the pieces:

```tsx
import FinanceArchive from "./pages/Finance/FinanceArchive";

// Use in your app
<FinanceArchive />
```

All the complexity is hidden behind clean interfaces, making the main component easy to understand and maintain.
