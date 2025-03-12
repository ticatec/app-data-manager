
# Batch Data Management

Typically used for managing large datasets, it can return data in batches based on retrieval conditions as required. Depending on the needs, you can use `PagedDataManager` (for paginated data display) or `StackDataManager` (for stackable dataset expansion). If there are special requirements, you can directly inherit from `CommonPagedDataManager`.

# CommonPagedDataManager

## Introduction

`CommonPagedDataManager` inherits from `BaseDataManager` and is specifically designed to manage paginated data. It extends `BaseDataManager` by providing a series of methods for paginated data queries, setting pagination parameters, refreshing data, and more.

## Type Definition

* `T extends PagingDataService`: A generic type representing a data service type that inherits from `PagingDataService`.

## Properties

`CommonPagedDataManager` inherits all properties from `BaseDataManager` and adds the following properties:

* `#criteria`: The current query conditions.
* `#pageCount`: Total number of pages.
* `#pageNo`: Current page number.
* `#count`: Total number of records.
* `#rows`: Number of rows per page.

## Static Properties

* `rowsCount`: Default number of rows per page, defaults to `25`.
* `rowsKey`: The query parameter name corresponding to the number of rows per page, defaults to `'rows'`.
* `pageNoKey`: The query parameter name corresponding to the page number, defaults to `'page'`.

## Constructor

```typescript
constructor(service: T, keyField: string | CheckEqual, options: any = null)
```
* Parameters are the same as those in `BaseDataManager`.

## Static Methods

* `setRowsPerPage(value: number)`: Sets the default number of rows per page.
    * `value`: Number of rows per page.

```ts
static setRowsPerPage(value: number): void
```

* `setRowsKey(value: string)`: Sets the query parameter name for the number of rows per page.
    * `value`: The field name in the query parameters for the number of rows per page.

```ts
static setRowsKey(value: string): void
```

* `setPageNoKey(value: string)`: Sets the query parameter name for the page number.
    * `value`: The field name in the query parameters for the page number.

```ts
static setPageNoKey(value: string): void
```

### Methods

* `remove(item: any)`: Deletes a record and removes it from the local collection.
    * `item`: The data item to delete.

```ts
async remove(item: any): Promise<void>
```

* `searchViaProxy(criteria: any)`: Queries data through an interface proxy.
    * `criteria`: Query conditions.

```ts
protected async searchViaProxy(criteria: any)
```

* `searchData(criteria: any, pageNo: number = 1)`: Queries data based on conditions.
    * `criteria`: Query conditions.
    * `pageNo`: Page number, defaults to `1`.

```ts
protected async searchData(criteria: any, pageNo: number = 1): Promise<void>
```

* `processDataResult(result: any)`: Processes the result returned from a query; must be implemented by subclasses.
    * `result`: Query result.

```ts
protected abstract processDataResult(result: any): void
```

* `setPageNo(value: number)`: Sets the current page number.
    * `value`: Page number.

```ts
async setPageNo(value: number): Promise<void>
```

* `setRowsPage(value: number)`: Sets the number of rows per page and queries from the first page.
    * `value`: Number of rows per page.

```ts
async setRowsPage(value: number): Promise<void>
```

* `resetCriteria()`: Resets the query conditions.

```ts
resetCriteria(): any
```

* `resetSearch()`: Resets the query conditions and queries data.

```ts
async resetSearch(): Promise<void>
```

* `search(criteria: any)`: Re-queries data based on conditions.
    * `criteria`: Query conditions.

```ts
async search(criteria: any): Promise<void>
```

* `setCriteria(criteria: any)`: Sets the query conditions and queries data.
    * `criteria`: Query conditions.

```ts
async setCriteria(criteria: any): Promise<void>
```

* `refresh()`: Refreshes the queried data.

```ts
async refresh(): Promise<void>
```

* `get criteria(): any`: Gets the current query conditions.

```ts
get criteria(): any
```

* `getPageNo(): number`: Gets the current page number.

```ts
protected getPageNo(): number
```

* `getPageCount(): number`: Gets the total number of pages.

```ts
protected getPageCount(): number
```

* `get count(): number`: Gets the total number of records.

```ts
get count(): number
```

## Usage Example:

```ts
import CommonPagedDataManager from './common-paged-data-manager';
import { MyPagingDataService } from './my-paging-data-service';

const service = new MyPagingDataService();
class MyPagedDataManager extends CommonPagedDataManager<MyPagingDataService> {
    constructor() {
        super(service, 'id');
    }

    protected processDataResult(result: any): void {
        this.list = result.data;
    }
}



const manager = new MyPagedDataManager(service, checkEqual);

// Set query conditions and query
manager.setCriteria({ name: 'test' }).then(() => {
    const list = manager.list;
    console.log(list);
});

// Set page number
manager.setPageNo(2).then(() => {
    const list = manager.list;
    console.log(list);
});

// Set rows per page
manager.setRowsPage(10).then(() => {
    const list = manager.list;
    console.log(list);
});

// Refresh data
manager.refresh().then(() => {
    const list = manager.list;
    console.log(list);
});
```

## Notes
* `CommonPagedDataManager` is an abstract class and must be inherited to be used.
* `PagingDataService` needs to be implemented based on actual requirements and must provide a `search` method for paginated data queries.
* The `processDataResult` method must be implemented by subclasses to process the query results and set the data to the `list` property.

# PagedDataManager Class Documentation

## Introduction

`PagedDataManager` inherits from `CommonPagedDataManager` and is a concrete paginated data manager used to manage paginated data. It simplifies the usage of `CommonPagedDataManager` and provides more direct property access methods, making it easier for developers to retrieve pagination information.

## Type Definition

* `T extends PagingDataService`: A generic type representing a data service type that inherits from `PagingDataService`.

## Properties

`PagedDataManager` inherits all properties from `CommonPagedDataManager`, including:

* `service`: An instance of `PagingDataService` used to interact with the underlying data service.
* `checkEqual`: A `CheckEqual` function used to compare data items.
* `convert`: A `DataConvert` function used to transform data items.
* `fromTop`: A boolean indicating whether newly added items are added to the top of the list, defaults to `true`.
* `tagData`: Data attached to the data service.
* `list`: The current dataset.
* `#criteria`: The current query conditions.
* `#pageCount`: Total number of pages.
* `#pageNo`: Current page number.
* `#count`: Total number of records.
* `#rows`: Number of rows per page.

Additionally, `PagedDataManager` provides getter methods for the following properties:

* `pageCount`: Total number of pages.
* `pageNo`: Current page number.

## Constructor

```typescript
constructor(service: T, keyField: string | CheckEqual, options: any = null)
```

## Methods

* `processDataResult(result: any)`: Processes the query result and sets the data to the `list` property.
    * `result`: The query result, containing a `list` property representing the data list.

```ts
protected processDataResult(result: any): void
```

* **`PagedDataManager` inherits all other methods from `CommonPagedDataManager`**, including:
    * `remove(item: any)`
    * `searchViaProxy(criteria: any)`
    * `searchData(criteria: any, pageNo: number = 1)`
    * `setPageNo(value: number)`
    * `setRowsPage(value: number)`
    * `resetCriteria()`
    * `resetSearch()`
    * `search(criteria: any)`
    * `setCriteria(criteria: any)`
    * `refresh()`
    * `get criteria(): any`
    * `getPageNo(): number`
    * `getPageCount(): number`
    * `get count(): number`

## Property Accessors

* `get pageCount(): number`: Gets the total number of pages.

```ts
get pageCount(): number
```

* `get pageNo(): number`: Gets the current page number.

```ts
get pageNo(): number
```

## Usage Example

```ts
import PagedDataManager from './paged-data-manager';
import { MyPagingDataService } from './my-paging-data-service';
const service = new MyPagingDataService();
class MyDataManager extends PagedDataManager<MyPagingDataService> {
    constructor(options: any = null) {
        super(service, 'id', options);
    }
}

const manager = new MyDataManager(service, checkEqual);

// Set query conditions and query
manager.setCriteria({ name: 'test' }).then(() => {
    const list = manager.list;
    console.log(list);
    console.log('Page Count:', manager.pageCount);
    console.log('Page No:', manager.pageNo);
});

// Set page number
manager.setPageNo(2).then(() => {
    const list = manager.list;
    console.log(list);
});

// Set rows per page
manager.setRowsPage(10).then(() => {
    const list = manager.list;
    console.log(list);
});

// Refresh data
manager.refresh().then(() => {
    const list = manager.list;
    console.log(list);
});
```

## Notes
* `PagedDataManager` inherits from `CommonPagedDataManager`, so all methods from `CommonPagedDataManager` can be used.
* `PagingDataService` must be implemented based on actual requirements and provide a `search` method for paginated data queries.
* The `processDataResult` method simplifies data processing by directly setting `result.list` to `this.list`.
* The `pageCount` and `pageNo` properties provide a more convenient access method.

# StackDataManager Class Documentation

## Introduction

`StackDataManager` inherits from `CommonPagedDataManager` and is specifically designed to manage stackable paginated data. It extends `CommonPagedDataManager` by providing `loadMore` and `hasMore` methods to implement the logic for stackable "load more" data operations.

## Type Definition

* `T extends PagingDataService`: A generic type representing a data service type that inherits from `PagingDataService`.

## Properties

`StackDataManager` inherits all properties from `CommonPagedDataManager`, including:

* `service`: An instance of `PagingDataService` used to interact with the underlying data service.
* `checkEqual`: A `CheckEqual` function used to compare data items.
* `convert`: A `DataConvert` function used to transform data items.
* `fromTop`: A boolean indicating whether newly added items are added to the top of the list, defaults to `true`.
* `tagData`: Data attached to the data service.
* `list`: The current dataset.
* `#criteria`: The current query conditions.
* `#pageCount`: Total number of pages.
* `#pageNo`: Current page number.
* `#count`: Total number of records.
* `#rows`: Number of rows per page.

## Constructor

```typescript
constructor(service: T, keyField: string | CheckEqual, options: any = null)
```
* `service`: An instance of `PagingDataService`.
* `checkEqual`: A `CheckEqual` function.
* `options`: Optional parameter, including the following properties:
    * `convert`: A `DataConvert` function.
    * `fromTop`: A boolean indicating whether newly added items are added to the top of the list.
    * `tagData`: Data attached to the data service.

## Methods

* `processDataResult(result: any)`: Processes the query result and merges the newly loaded data into the existing `list` using the `union` method and `checkEqual` function to avoid duplicates.
    * `result`: The query result, containing a `list` property representing the newly loaded data list.

```ts
protected processDataResult(result: any): void
```

* `loadMore()`: Loads the next page of data if the current page number is less than the total number of pages.

```ts
async loadMore(): Promise<void>
```

* `hasMore()`: Checks if there are more records available to load.
    * Returns: `true` if the current page number is less than the total number of pages, otherwise `false`.

```ts
hasMore(): boolean
```

* **`StackDataManager` inherits all other methods from `CommonPagedDataManager`**

## Usage Example

```ts
import StackDataManager from './stack-data-manager';
import { MyPagingDataService } from './my-paging-data-service';
const service = new MyPagingDataService();
class MyStackDataManager extends StackDataManager<MyPagingDataService> {
    constructor(options: any = null) {
        super(service, 'id', options);
    }
}

const manager = new MyStackDataManager(service, checkEqual);

// Set query conditions and query
manager.setCriteria({ name: 'test' }).then(() => {
    const list = manager.list;
    console.log(list);

    // Load more data
    if (manager.hasMore()) {
        manager.loadMore().then(() => {
            const newList = manager.list;
            console.log(newList);
        });
    }
});

// Refresh data
manager.refresh().then(() => {
    const list = manager.list;
    console.log(list);
});
```

## Notes
* `StackDataManager` inherits from `CommonPagedDataManager`, so all methods from `CommonPagedDataManager` can be used.
* `PagingDataService` must be implemented based on actual requirements and provide a `search` method for paginated data queries.
* The `processDataResult` method uses the `union` method to merge newly loaded data, avoiding duplicates.
* The `loadMore` and `hasMore` methods provide the logic for stackable "load more" data operations.

