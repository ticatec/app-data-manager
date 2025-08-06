# App Data Manager

[![npm version](https://badge.fury.io/js/@ticatec%2Fapp-data-manager.svg)](https://badge.fury.io/js/@ticatec%2Fapp-data-manager)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[中文文档](./README-CN.md)

A comprehensive TypeScript library that provides a hierarchical set of data manager classes for handling CRUD operations and paginated data retrieval via HTTP requests. This library simplifies data management in frontend applications by abstracting the complexity of data operations and providing a structured approach to managing different types of datasets.

## Features

- **Type-safe**: Full TypeScript support with comprehensive type definitions
- **Hierarchical Architecture**: Well-structured inheritance hierarchy for different data management needs
- **Pagination Support**: Built-in pagination handling with both standard and stackable pagination
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Data Transformation**: Built-in data conversion and validation support
- **Extensible**: Easy to extend and customize for specific use cases
- **Dependency Injection**: Service-based architecture for better testability

## Installation

```bash
npm install @ticatec/app-data-manager
```

## Architecture Overview

The library is built on a hierarchical structure with the following core classes:

```
BaseDataManager (Abstract)
├── FullListDataManager
└── CommonPagedDataManager (Abstract)
    ├── PagedDataManager
    └── StackDataManager
```

## Core Classes

### 1. BaseDataManager

**Abstract base class** for managing data collections with common CRUD operations.

**Key Features:**
- Data collection management with local caching
- CRUD operations with automatic local synchronization
- Data transformation support via `convert` function
- Equality checking via `checkEqual` function
- Service-based architecture for data operations

**Properties:**
- `service: CommonDataService` - Data service instance
- `checkEqual: CheckEqual` - Function to compare data items
- `convert?: DataConvert` - Optional data transformation function
- `list: Array<any>` - Current dataset (read-only copy)

**Methods:**
- `save(data: any, isNew: boolean): Promise<void>` - Save/update data
- `remove(item: any): Promise<void>` - Delete data
- `append(item: any): void` - Add item to beginning of list
- `replace(item: any): void` - Replace existing item with matching key
- `removeItem(item: any): void` - Remove item from local collection only

### 2. FullListDataManager

**Concrete class** inheriting from `BaseDataManager` for managing complete datasets.

**Use Cases:**
- Dropdown lists
- Static reference data
- Small to medium-sized complete datasets
- Configuration lists

**Constructor:**
```typescript
protected constructor(
  service: T, 
  keyField: string | CheckEqual, 
  options: ManagerOptions = null
)
```

**Additional Methods:**
- `loadData(): Promise<void>` - Load complete dataset from service using tagData as filter conditions

**Example:**
```typescript
import { FullListDataManager } from '@ticatec/app-data-manager';
import { MyFullListDataService } from './services';

class CategoryManager extends FullListDataManager<MyFullListDataService> {
  constructor() {
    super(
      new MyFullListDataService(), 
      'id', 
      {
        tagData: { status: 'active', type: 'public' } // filter conditions for getList
      }
    );
  }
}

const manager = new CategoryManager();
await manager.loadData(); // Uses tagData as filter conditions
console.log(manager.list); // Filtered category list
```

### 3. CommonPagedDataManager

**Abstract base class** for paginated data management with comprehensive pagination support.

**Constructor:**
```typescript
protected constructor(
  service: T, 
  keyField: string | CheckEqual, 
  options: any = null
)
```

**Key Features:**
- Pagination state management (pageNo, pageCount, totalCount)
- Query criteria handling with tagData-based initialization
- Configurable pagination parameters
- Abstract `processDataResult` method for custom data processing

**Static Configuration:**
- `CommonPagedDataManager.setRowsPerPage(25)` - Set default rows per page
- `CommonPagedDataManager.setRowsKey('rows')` - Set rows parameter name
- `CommonPagedDataManager.setPageNoKey('page')` - Set page parameter name

**Properties:**
- `criteria: any` - Current query criteria (initialized from options.tagData or empty object)
- `count: number` - Total record count

**Methods:**
- `search(criteria: any): Promise<void>` - Search with criteria
- `setPageNo(pageNo: number): Promise<void>` - Navigate to specific page
- `setRowsPage(rows: number): Promise<void>` - Change page size
- `refresh(): Promise<void>` - Refresh current data
- `resetSearch(): Promise<void>` - Reset to default criteria

### 4. PagedDataManager

**Concrete implementation** of `CommonPagedDataManager` for standard pagination.

**Use Cases:**
- Data tables with pagination
- Search results with page navigation
- Standard paginated lists

**Additional Properties:**
- `pageCount: number` - Total number of pages
- `pageNo: number` - Current page number

**Data Processing:**
- Replaces entire dataset with new page data
- Simple and straightforward pagination

**Constructor:**
```typescript
constructor(
  service: T, 
  keyField: string | CheckEqual, 
  options: any = null
)
```

**Example:**
```typescript
import { PagedDataManager } from '@ticatec/app-data-manager';
import { MyPagingDataService } from './services';

class UserManager extends PagedDataManager<MyPagingDataService> {
  constructor() {
    super(
      new MyPagingDataService(), 
      'userId',
      {
        tagData: { status: 'active' } // default criteria via tagData
      }
    );
  }
}

const manager = new UserManager();
// Will search with default criteria from tagData { status: 'active' }
await manager.resetSearch(); 
console.log(`Page ${manager.pageNo} of ${manager.pageCount}`);
console.log(`Total users: ${manager.count}`);
console.log(manager.list); // Current page users

// Navigate to next page
await manager.setPageNo(2);

// Search with additional criteria
await manager.search({ status: 'active', role: 'admin' });
```

### 5. StackDataManager

**Concrete implementation** of `CommonPagedDataManager` for stackable pagination ("infinite scroll").

**Use Cases:**
- Social media feeds
- Infinite scroll implementations
- "Load More" functionality
- Progressive data loading

**Key Features:**
- Accumulates data across pages
- Automatic duplicate prevention using `union` method
- `loadMore()` and `hasMore()` methods for progressive loading

**Additional Methods:**
- `loadMore(): Promise<void>` - Load next page and append to existing data
- `hasMore(): boolean` - Check if more pages are available

**Data Processing:**
- Merges new data with existing dataset
- Prevents duplicates using `checkEqual` function

**Constructor:**
```typescript
constructor(
  service: T, 
  keyField: string | CheckEqual, 
  options: any = null
)
```

**Example:**
```typescript
import { StackDataManager } from '@ticatec/app-data-manager';
import { MyPagingDataService } from './services';

class FeedManager extends StackDataManager<MyPagingDataService> {
  constructor() {
    super(
      new MyPagingDataService(), 
      'postId',
      {
        tagData: { category: 'technology' } // default criteria via tagData
      }
    );
  }
}

const manager = new FeedManager();
// Will search with default criteria from tagData { category: 'technology' }
await manager.resetSearch();

// Load more content
while (manager.hasMore()) {
  await manager.loadMore();
  console.log(`Loaded ${manager.list.length} posts`);
}

// Search with different criteria
await manager.search({ category: 'science', featured: true });
```

## Type Definitions

### CheckEqual
```typescript
type CheckEqual = (e1: any, e2: any) => boolean;
```
Function to determine if two data items are equal (typically by comparing primary keys).

### DataConvert
```typescript
type DataConvert = (item: any, isNew: boolean) => any;
```
Optional function to transform data items during save/load operations.

### ManagerOptions
```typescript
interface ManagerOptions {
  convert?: DataConvert;    // Data transformation function
  fromTop?: boolean;        // Add new items to top of list (default: true)
  tagData?: any;           // Default query criteria/filter conditions
}
```

**tagData Usage:**
- **For paginated managers**: Used as default query criteria for searches
- **For FullListDataManager**: Used as filter conditions for the getList method

## Advanced Usage

### Custom Data Manager

```typescript
import { BaseDataManager } from '@ticatec/app-data-manager';

class CustomDataManager extends BaseDataManager<MyDataService> {
  constructor(service: MyDataService) {
    super(service, 'id', {
      convert: (item, isNew) => ({
        ...item,
        timestamp: isNew ? Date.now() : item.timestamp
      }),
      fromTop: true
    });
  }
  
  // Custom business logic
  async archiveItem(item: any): Promise<void> {
    const archived = { ...item, archived: true };
    await this.save(archived, false);
  }
}
```

### Service Implementation Example

```typescript
import { PagingDataService } from '@ticatec/app-data-service';

class MyPagingService extends PagingDataService {
    constructor() {
        super('/api/users');
    }
}
```

## Best Practices

1. **Choose the Right Manager:**
   - Use `FullListDataManager` for small, static datasets
   - Use `PagedDataManager` for traditional paginated tables
   - Use `StackDataManager` for infinite scroll or feed-like interfaces

2. **Implement Proper Equality Checking:**
   ```typescript
   // Good: Use unique identifiers
   const manager = new PagedDataManager(service, 'id');
   
   // Better: Custom comparison for complex keys
   const manager = new PagedDataManager(service, (a, b) => 
     a.companyId === b.companyId && a.userId === b.userId
   );
   ```

3. **Handle Errors Gracefully:**
   ```typescript
   try {
     await manager.search({ query: 'user input' });
   } catch (error) {
     console.error('Search failed:', error);
     // Handle error appropriately
   }
   ```

4. **Use Data Conversion for Consistency:**
   ```typescript
   const options = {
     convert: (item, isNew) => ({
       ...item,
       createdAt: isNew ? new Date().toISOString() : item.createdAt,
       updatedAt: new Date().toISOString()
     })
   };
   ```

## Dependencies

- **[@ticatec/app-data-service](https://www.npmjs.com/package/@ticatec/app-data-service)** - Data service interfaces and base implementations
- **[@ticatec/enhanced-utils](https://www.npmjs.com/package/@ticatec/enhanced-utils)** - Utility functions including array extensions

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Node.js 14+

## Contributing

Issues and pull requests are welcome. Please ensure:

1. All tests pass
2. Code follows TypeScript best practices
3. Documentation is updated for new features
4. Examples are provided for new functionality

## License

Copyright © 2023 Ticatec. All rights reserved.

This library is released under the MIT License. See [LICENSE](LICENSE) file for details.

## Contact

- **Email:** huili.f@gmail.com
- **GitHub:** https://github.com/ticatec/app-data-manager
- **Issues:** https://github.com/ticatec/app-data-manager/issues