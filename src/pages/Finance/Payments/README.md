# Payments Module

This module handles payment tracking and management for accepted offers in the finance system.

## Structure

```
Payments/
├── components/           # React components
│   ├── Header.tsx       # Page header with title and export button
│   ├── SummaryCards.tsx # Payment statistics cards
│   ├── SearchAndFilters.tsx # Search and filtering interface
│   ├── PaymentsTable.tsx    # Main payments data table
│   ├── AddPaymentModal.tsx  # Modal for adding new payments
│   ├── PaymentHistoryModal.tsx # Modal for viewing payment history
│   ├── Pagination.tsx       # Pagination controls
│   └── index.ts             # Component exports
├── hooks/               # Custom React hooks
│   ├── usePayments.ts       # Main payments state management
│   ├── usePaymentFilters.ts # Search and filtering logic
│   ├── usePaymentPagination.ts # Pagination logic
│   ├── usePaymentActions.ts   # Action handlers (modals, exports)
│   └── index.ts              # Hook exports
├── utils/               # Utility functions and types
│   ├── types.ts             # TypeScript interfaces
│   ├── constants.ts         # Constants and configuration
│   ├── helpers.ts           # Helper functions
│   └── index.ts             # Utility exports
├── data/                # Mock data
│   └── mockData.ts          # Sample payment offers data
├── Payments.tsx         # Main component orchestrating everything
└── README.md            # This file
```

## Components

### Header
- Displays page title and description
- Contains export to Excel button

### SummaryCards
- Shows payment statistics in 4 cards:
  - Total receivable
  - Total received
  - Outstanding amount
  - Collection rate

### SearchAndFilters
- Search input for offers by name, code, or client
- Advanced filters for payment status, client, and date range
- Clear filters functionality

### PaymentsTable
- Displays payment offers in a table format
- Shows payment progress with visual indicators
- Action buttons for adding payments and viewing history

### AddPaymentModal
- Form for adding new payments to offers
- Fields for amount, payment method, and comment
- Validation and submission handling

### PaymentHistoryModal
- Displays payment history for a specific offer
- Shows all payments with amounts, dates, and methods

### Pagination
- Navigation controls for browsing through offers
- Page information display

## Hooks

### usePayments
- Manages payment offers state
- Handles adding new payments
- Updates payment status automatically

### usePaymentFilters
- Manages search and filter state
- Applies filters to offers
- Handles filter clearing

### usePaymentPagination
- Manages pagination state
- Calculates page information
- Provides navigation functions

### usePaymentActions
- Manages modal states
- Handles payment form updates
- Manages export functionality

## Utils

### Types
- `Payment`: Individual payment record
- `PaymentOffer`: Offer with payment information
- `PaymentFilters`: Filter configuration
- `NewPayment`: New payment form data

### Constants
- Payment methods
- Payment status options
- Client options
- Status colors and styling

### Helpers
- Payment calculations
- Currency formatting
- Date formatting
- Statistical calculations

## Data Flow

1. **Initial Load**: `usePayments` loads mock data
2. **Filtering**: `usePaymentFilters` applies search and filters
3. **Pagination**: `usePaymentPagination` slices data for current page
4. **Display**: Components render filtered and paginated data
5. **Actions**: User interactions trigger state updates through hooks
6. **Updates**: State changes automatically update the UI

## Usage

The main `Payments.tsx` component orchestrates all the pieces:

```tsx
import Payments from './Payments';

// In your router or parent component
<Payments />
```

## Features

- ✅ Payment tracking and management
- ✅ Search and filtering
- ✅ Pagination
- ✅ Payment history viewing
- ✅ Add new payments
- ✅ Export functionality (placeholder)
- ✅ Responsive design
- ✅ TypeScript support
- ✅ Modular architecture
