# CMS Contexts

This directory contains separated, focused contexts for different CMS entities. Each context manages its own state and provides specific functionality for its entity type.

## Structure

- `base.ts` - Common utilities and base interfaces
- `HotelContext.tsx` - Hotel management
- `RestaurantContext.tsx` - Restaurant management
- `TransportContext.tsx` - Transport management
- `TranslatorContext.tsx` - Translator management
- `GuideContext.tsx` - Guide management
- `ActivityContext.tsx` - Activity management
- `GiftContext.tsx` - Gift management
- `ClientContext.tsx` - Client management
- `DayTemplateContext.tsx` - Day template management
- `CMSProvider.tsx` - Combined provider that wraps all contexts
- `index.ts` - Exports all contexts and utilities
- `CMSContext.tsx` - Backward compatibility layer

## Usage

### Individual Contexts (Recommended)

```tsx
import { useHotels, useRestaurants, useTransports } from '../contexts';

function MyComponent() {
  const { hotels, addHotel, updateHotel, deleteHotel } = useHotels();
  const { restaurants, addRestaurant } = useRestaurants();
  const { transports } = useTransports();

  // Use specific context methods
  const handleAddHotel = () => {
    addHotel({
      name: 'New Hotel',
      roomTypes: [],
      websiteLink: 'https://example.com',
      logo: 'logo-url',
      description: 'Hotel description',
      numberOfRooms: 100,
      numberOfRestaurants: 2,
      vatGroup: '20%'
    });
  };

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

### Combined Provider Setup

```tsx
import { CMSProvider } from '../contexts/CMSProvider';

function App() {
  return (
    <CMSProvider>
      {/* Your app components */}
    </CMSProvider>
  );
}
```

### Backward Compatibility

Existing code using `useCMS()` will continue to work:

```tsx
import { useCMS } from '../contexts/CMSContext';

function LegacyComponent() {
  const { hotels, addHotel, restaurants, addRestaurant } = useCMS();
  
  // This still works but is deprecated
}
```

## Benefits of Separation

1. **Focused Responsibility** - Each context handles only its entity type
2. **Better Performance** - Components only re-render when relevant data changes
3. **Easier Testing** - Test individual contexts in isolation
4. **Maintainability** - Smaller, focused files are easier to maintain
5. **Reusability** - Use only the contexts you need
6. **Type Safety** - Better TypeScript inference for specific entity types

## Migration Guide

### From useCMS() to Individual Hooks

**Before:**
```tsx
const { hotels, addHotel, restaurants, addRestaurant } = useCMS();
```

**After:**
```tsx
const { hotels, addHotel } = useHotels();
const { restaurants, addRestaurant } = useRestaurants();
```

### Provider Setup

**Before:**
```tsx
import { CMSProvider } from '../contexts/CMSContext';
```

**After:**
```tsx
import { CMSProvider } from '../contexts/CMSProvider';
// or
import { CMSProvider } from '../contexts';
```

## Base Interface

All contexts implement the `BaseEntityContext<T>` interface:

```tsx
interface BaseEntityContext<T> {
  items: T[];
  addItem: (item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, item: Partial<T>) => void;
  deleteItem: (id: string) => void;
}
```

This provides consistent CRUD operations across all entity types while maintaining backward compatibility.
